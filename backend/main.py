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
        lines = song['Lyrics'].split('\n')
        for i, line in enumerate(lines):
            if query.lower() in line.lower():
                before = lines[i-1] if i > 0 else ""
                current = line
                after = lines[i+1] if i < len(lines) - 1 else ""

                result.append({
                    'title': song['Title'],
                    'album': song['Album'],
                    'before': before,
                    'match': current,
                    'after': after
                })

    return {'query': query, 'results': result}
