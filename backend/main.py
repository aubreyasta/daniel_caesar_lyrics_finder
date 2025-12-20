from fastapi import FastAPI
import json

app = FastAPI()


@app.get("/")
def home():
    return {'message': 'Daniel Caesar Lyrics Search API'}


with open("daniel_caesar_lyrics.json", "r") as file:
    songs = json.load(file)


@app.get("/search")
def searchLyrics(query: str):
    result = []

    for song in songs:
        if query.lower() in song['lyrics'].lower():
            result.append(song['title'])

    return {'word': query, 'matches': result}
