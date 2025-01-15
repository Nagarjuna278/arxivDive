from fastapi import HTTPException
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import re
import sqlite3
import os

# Initialize model and FAISS index
model = SentenceTransformer('all-MiniLM-L6-v2')
dimension = model.get_sentence_embedding_dimension()
index_path = "faiss_index.faiss"

if not os.path.exists(index_path):
    print("FAISS index not found, creating a new one...")
    index = faiss.IndexFlatL2(dimension)
    faiss.write_index(index, index_path)
    print("New FAISS index created and saved.")
else:
    print("FAISS index file exists.")
    index = faiss.read_index(index_path)
    print("FAISS index loaded successfully")

# Database initialization
def initialize_database():
    conn = sqlite3.connect('papers.db', check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS papers
                      (id TEXT PRIMARY KEY,
                       faiss_index_id INTEGER UNIQUE)''')
    return conn, cursor

# Add a paper to the database
def add_paper_to_db(cursor, paper_id, faiss_index_id):
    cursor.execute(
        "INSERT OR REPLACE INTO papers (id, faiss_index_id) VALUES (?, ?)",
        (paper_id, faiss_index_id)
    )

# Retrieve FAISS index for a paper ID
def get_paper_faiss_indices(cursor, paper_id):
    cursor.execute("SELECT faiss_index_id FROM papers WHERE id = ? LIMIT 1", (paper_id,))
    result = cursor.fetchone()
    return result[0] if result else None

# Retrieve similar paper IDs
def get_similar_paper_ids(cursor, faiss_indices):
    similar_ids = []
    cursor.execute("SELECT * from papers")
    print(cursor.fetchall())
    for i in faiss_indices[0]:
        print(i)
        
        cursor.execute("SELECT id FROM papers WHERE faiss_index_id = ?", (int(i),))
        result = cursor.fetchall()
        print(result)
        if result:
            print(result[0][0])
            similar_ids.append(result[0][0])  # Extract paper ID
    return similar_ids

def check_alreadyexists(cursor,paper_id):
    cursor.execute("SELECT * from papers where id = ?",(paper_id,))
    result = cursor.fetchall()
    print(result)
    if(len(result)==0):
        return False
    return True

# Add paper embeddings and metadata
def dataprocess(obj, conn, cursor, model, index):
    try:
        if check_alreadyexists(cursor, obj['id']):
            print("inside")
            return None
        summary = re.sub(r'\s+', ' ', re.sub(r'[^a-zA-Z0-9\s]', '', obj['summary']).strip())
        embedding = model.encode([summary])[0]
        
        # Add embedding to FAISS index
        index.add(np.array([embedding]).astype('float32'))
        faiss.write_index(index, index_path)
        faiss_index_id = index.ntotal - 1

        # Update the database
        add_paper_to_db(cursor, obj['id'], faiss_index_id)
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Find similar papers
def getSimilar(conn, cursor, paper_id, model, index):
    print(paper_id)
    paper_id_to_find = paper_id
    faiss_index = get_paper_faiss_indices(cursor, paper_id_to_find)

    if faiss_index is not None:
        print(f"Faiss index for {paper_id_to_find}: {faiss_index}")
    else:
        print(f"No paper found with ID: {paper_id_to_find}")
        raise HTTPException(status_code=404, detail="Paper ID not found")

    faiss_index_id = faiss_index

    # Retrieve embedding from the FAISS index
    retrieved_embedding = index.reconstruct(faiss_index_id).astype('float32')
    k = 3
    distances, indices = index.search(np.array([retrieved_embedding]).astype('float32'), k)
    print(indices)

    # Get similar paper IDs
    similar_ids = get_similar_paper_ids(cursor, indices)
    print([str(sim_id) for sim_id in similar_ids])

    return {
        "similar_ids": [str(sim_id) for sim_id in similar_ids]  # Ensure JSON-serializable
    }
