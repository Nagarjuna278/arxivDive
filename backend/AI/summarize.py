# Use a pipeline as a high-level helper
from transformers import pipeline

summarizer = pipeline("summarization", model="Falconsai/text_summarization")

def summarizePaper(summary):
    return summarizer(summary,max_length=100,min_length=30,do_sample=False)
    