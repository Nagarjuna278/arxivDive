from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
import arxiv
from typing import List
import uvicorn
from similarity import dataprep as dp
from fastapi.middleware.cors import CORSMiddleware
from AI.summarize import summarizePaper

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://10.0.0.59:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn, cursor = dp.initialize_database()

@app.post("/summary")
async def getSummary(request:Request):
    try:
        body = await request.json()  # Attempt to parse the request body as JSON
        print(body)
        if not body:
            raise HTTPException(status_code=400, detail="Request body is empty")

        # Access data from the JSON body
        text_content = body.get("text")  # Example: Get the "text" field
        if not text_content:
            raise HTTPException(status_code=400, detail="Missing 'text' field in request body")
        
        # Process the text content (example)
        summary = summarizePaper(text_content) # replace with your actual summarization logic
        return {"summary": summary}
    
    except HTTPException as http_exc: # Catch HTTPExceptions raised above
        raise http_exc
    except ValueError:  # Handle cases where the body isn't valid JSON
        raise HTTPException(status_code=400, detail="Invalid JSON in request body")
    except Exception as e:
        print(f"An unexpected error occurred: {e}") # Log the error for debugging
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

		

@app.get("/")
async def fetch_data():
	try:
		client = arxiv.Client()
		# Create an arXiv search query
		search = arxiv.Search(
			query="cs.AI",
			max_results=10,
			sort_by=arxiv.SortCriterion.SubmittedDate,
			sort_order=arxiv.SortOrder.Descending
		)
		# Fetch results
		results: List[dict] = []
		for result in client.results(search):
			results.append({
				"title": result.title,
				"authors": [author.name for author in result.authors],
				"summary": result.summary,
				"published": result.published.strftime("%Y-%m-%d %H:%M:%S"),
				"id": result.entry_id[21:],
			})
			dp.dataprocess(results[-1], conn, cursor,dp.model,dp.index)

		return {"results": results}

	except Exception as e:
			raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/search/{search_query}")
async def fetch_search_papers(search_query: str,background_tasks: BackgroundTasks):
    try:
        client = arxiv.Client()
        search = arxiv.Search(
            query=f"all:{search_query}",
            max_results=10,
            sort_by=arxiv.SortCriterion.SubmittedDate,
            sort_order=arxiv.SortOrder.Descending
        )
        results = []
        for result in client.results(search):
            paper = {
                "title": result.title,
                "authors": [author.name for author in result.authors],
                "summary": result.summary,
                "published": result.published.strftime("%Y-%m-%d %H:%M:%S"),
                "id": result.entry_id[21:],
            }
            background_tasks.add_task(dp.dataprocess(paper, conn, cursor, dp.model, dp.index))
            results.append(paper)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/paper/{arxiv_id}")
async def fetch_paper(arxiv_id:str):
	try:
		client = arxiv.Client()
		search = arxiv.Search(
				id_list = [arxiv_id]
		)
		print(id)
		results : List[dict] = []
		for result in client.results(search):
			results.append({
				"title": result.title,
				"authors": [author.name for author in result.authors],
				"summary": result.summary,
				"published": result.published.strftime("%Y-%m-%d %H:%M:%S"),
				"id": result.entry_id[21:]
				})
			dp.dataprocess(results[-1],conn,cursor,dp.model,dp.index)
		return {"results":results}
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/recom/{paper_id}")
async def fetch_suggestions(paper_id: str):
    try:
        suggestions = dp.getSimilar(conn, cursor, paper_id, dp.model, dp.index)
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
