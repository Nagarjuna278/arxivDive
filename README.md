# Arxiv Full-Stack Web Application

This project is a full-stack web application designed to facilitate research by providing seamless access to arXiv papers. It allows users to search, summarize, and find similar research papers using advanced machine learning techniques and modern web technologies.

## Features

- **Search Papers**: Search for research papers on arXiv by keywords or paper IDs.
- **Summarize Papers**: Generate concise and context-rich summaries of research papers using a pre-trained Huggingface summarization model.
- **Find Similar Papers**: Retrieve similar papers based on FAISS vector similarity search.
- **Interactive Frontend**: React-based user interface for displaying paper details, embedded PDFs, and recommendations.

## Technologies Used

- **Frontend**: React
- **Backend**: FastAPI
- **Database**: SQLite
- **Machine Learning**: Huggingface Transformers, FAISS

---

## Installation and Setup

### Prerequisites

Ensure you have the following installed on your system:

- Python 3.8 or later
- Node.js and npm
- SQLite

### Backend Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Nagarjuna278/arxivDive.git
   cd arxiv-webapp/backend
   ```

2. **Create a Virtual Environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:

   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Run the Backend**:

   ```bash
   python3 backend/main.py
   ```

   The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Frontend**:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

---

## API Documentation

### Endpoints

#### 1. Fetch Data

- **URL**: `/`
- **Method**: `GET`
- **Description**: Fetches the latest papers in the `cs.AI` category from arXiv.

#### 2. Search Papers

- **URL**: `/search/{search_query}`
- **Method**: `GET`
- **Description**: Searches arXiv for papers based on the query string.

#### 3. Get Summary

- **URL**: `/summary`
- **Method**: `POST`
- **Description**: Generates a summary for the given text.
- **Payload**:
  ```json
  {
    "text": "Full text of the paper to summarize."
  }
  ```

#### 4. Fetch Paper by ID

- **URL**: `/paper/{arxiv_id}`
- **Method**: `GET`
- **Description**: Fetches metadata for a paper by its arXiv ID.

#### 5. Get Similar Papers

- **URL**: `/recom/{paper_id}`
- **Method**: `GET`
- **Description**: Retrieves a list of similar papers based on the given paper ID.

---

## Directory Structure

```
project-root
│
├── backend
│   ├── main.py        # FastAPI application
│   ├── dataprep.py    # Data preparation and FAISS handling
│   ├── summarize.py   # Summarization logic
│   ├── requirements.txt
│   └── papers.db      # SQLite database
│
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## How It Works

1. **Data Fetching**: Papers are fetched from the arXiv API and stored in a structured SQLite database.
2. **Summarization**: Paper summaries are generated using the Huggingface Transformers summarizer pipeline.
3. **Vector Similarity Search**: Paper embeddings are generated with Sentence Transformers and stored in a FAISS index for similarity queries.
4. **Frontend Integration**: A React-based frontend interacts with the backend API for dynamic and interactive user experiences.

---

## Contributing

We welcome contributions to improve this project! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and submit a pull request.

---

## Acknowledgements

- [arXiv API](https://arxiv.org/help/api/index)
- [Huggingface Transformers](https://huggingface.co/transformers/)
- [FAISS](https://github.com/facebookresearch/faiss)

