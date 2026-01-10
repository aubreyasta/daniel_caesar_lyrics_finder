from fastapi import FastAPI
import json
from fuzzywuzzy import fuzz
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {'message': 'Daniel Caesar Lyrics Search API'}


with open("daniel_caesar_lyrics.json", "r") as file:
    songs = json.load(file)

# Store split lyrics (one array per song)
# one array = one full lyric of a song
songs_split_lyrics = []
for song in songs:
    songs_split_lyrics.append(song['Lyrics'].split('\n'))

# Loops through each array (song) in songs_split_lyrics, selects the first line.
# Creates a dictionary object containing the line itself, and relevant metadata
# Appends said dictionary object to all_lines. Moves to next line.
# all_lines contains dictionaries of each line in daniel caesar's discography
all_lines = []

for song_idx, song in enumerate(songs):
    lines = songs_split_lyrics[song_idx]

    for line_idx, line in enumerate(lines):
        all_lines.append({
            'line': line,
            'title': song["Title"],
            'album': song["Album"],
            'song_idx': song_idx,
            'line_idx': line_idx
        })

print(f"Loaded {len(all_lines)} lines from {len(songs)} songs.")


@app.get("/search")
def searchLyrics(query: str):
    """
    Search for lyrics matching the query string. 

    :param query: Description
    :type query: str
    """
    results = []

    for item in all_lines:
        if fuzz.partial_ratio(query.lower(), item['line'].lower()) >= 90:
            lines = songs_split_lyrics[item['song_idx']]
            i = item['line_idx']

            results.append({
                'title': item['title'],
                'album': item['album'],
                'before': lines[i-1] if i > 0 else '',
                'match': lines[i],
                'after': lines[i+1] if i < len(lines) - 1 else ''
            })

    return {'query': query, 'results': results}
