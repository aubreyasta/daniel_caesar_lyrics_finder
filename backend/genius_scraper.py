import os
import lyricsgenius
import json

# Linking to Genius API, set up artist as Daniel Caesar
genius = lyricsgenius.Genius(os.environ['GENIUS_API_KEY'])
artist = genius.search_artist('Daniel Caesar', max_songs=50)

# Saves all song's lyrics
data = []

for song in artist.songs:
    data.append({
        'title': song.title,
        'lyrics': song.lyrics
    })

with open('daniel_caesar_lyrics.json', 'w') as f:
    json.dump(data, f)
