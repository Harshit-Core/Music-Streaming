// Sample Music Data
const musicData = {
    // Sample Songs with Free Music URLs
    songs: [
        {
            id: 1,
            title: "Happier Than Ever",
            artist: "Billie Eilish",
            album: "",
            duration: "3:42",
            genre: "Indie Pop",
            year: 2024,
            artwork: "2.png",
            audioUrl: "hbd.mp3", // Placeholder - you'll need actual music files
            lyrics: `Sunny days are here again
Feeling good, no need to pretend
Walking down the street with a smile
Everything's been worth the while

[Chorus]
Oh these sunny days
Wash the blues away
Nothing's gonna stop us now
We'll find our way somehow`,
            isLiked: false,
            playCount: 1204
        },
        {
            id: 2,
            title: "Midnight Drive",
            artist: "Neon Dreams",
            album: "City Lights",
            duration: "4:15",
            genre: "Synthwave",
            year: 2023,
            artwork: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
            audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            lyrics: `Driving through the city lights
Neon signs and sleepless nights
Radio playing our favorite song
This is where we both belong

[Chorus]
Midnight drive, feeling alive
Under stars that never die
Hold my hand, don't let me go
This is all we need to know`,
            isLiked: true,
            playCount: 892
        },
        {
            id: 3,
            title: "Ocean Breeze",
            artist: "Coastal Calm",
            album: "Waves",
            duration: "5:20",
            genre: "Ambient",
            year: 2024,
            artwork: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop",
            audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            lyrics: `Gentle waves upon the shore
Peaceful sounds I can't ignore
Ocean breeze through my hair
Not a worry, not a care

[Chorus]
Let the ocean set me free
This is where I'm meant to be
Endless blue and endless sky
Time just seems to pass me by`,
            isLiked: false,
            playCount: 567
        },
        {
            id: 4,
            title: "Electric Dreams",
            artist: "Cyber Sound",
            album: "Digital",
            duration: "3:58",
            genre: "Electronic",
            year: 2024,
            artwork: "3.jpeg",
            audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            lyrics: `In the digital world we live
Electric dreams we have to give
Synthesized and amplified
Nothing left to hide

[Chorus]
Electric dreams light up the night
Everything's gonna be alright
In this world of ones and zeros
We can all be heroes`,
            isLiked: true,
            playCount: 1456
        },
        {
            id: 5,
            title: "Mountain High",
            artist: "Folk Stories",
            album: "Wanderer",
            duration: "4:32",
            genre: "Folk",
            year: 2023,
            artwork: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
            audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            lyrics: `Climbing mountains, reaching high
Touch the clouds up in the sky
Every step brings me closer
To the dreams I'm meant to foster

[Chorus]
Mountain high, valley low
There's so much more I need to know
Journey long but spirit strong
This is where my heart belongs`,
            isLiked: false,
            playCount: 743
        },
        {
            id: 6,
            title: "Jazz Café",
            artist: "Smooth Operators",
            album: "Late Night Sessions",
            duration: "6:18",
            genre: "Jazz",
            year: 2024,
            artwork: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
            audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            lyrics: `In the corner of the jazz café
Where the music takes your breath away
Saxophone singing through the night
Everything just feels so right

[Instrumental Bridge]
*Saxophone solo*

[Chorus]
Jazz café, take me away
Let the music guide the way
In this smoky, dimlit room
Music chases away the gloom`,
            isLiked: true,
            playCount: 982
        },
        {
            id: 7,
            title: "Happier Than Ever",
            artist: "Billie Eilish",
            album: "Studio album",
            duration: "5:16",
            genre: "Pop music",
            year: 2021,
            artwork: "2.png",
            audioUrl: "hbd.mp3", // Placeholder - you'll need actual music files,
            lyrics: `[Chorus]
When I'm away from you
I'm happier than ever
Wish I could explain it better
I wish it wasn't true

[Verse 1]
Give me a day or two to think of something clever
To write myself a letter
To tell me what to do, mm-mm
Do you read my interviews`,
            isLiked: false,
            playCount: 1678
        },
        {
            id: 8,
            title: "Classical Dawn",
            artist: "Orchestra Moderne",
            album: "Symphonic",
            duration: "7:45",
            genre: "Classical",
            year: 2023,
            artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
            audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            lyrics: `[Instrumental]
No lyrics - Classical instrumental piece featuring full orchestra arrangement`,
            isLiked: true,
            playCount: 534
        }
    ], 
 
    artists: [
        // Artists
        {
            id: 1,
            name: "Indie Wave",
            genre: "Indie Pop",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            followers: 125400,
            monthlyListeners: 45600,
            bio: "Indie Wave brings fresh sounds to the indie pop scene with catchy melodies and heartfelt lyrics.",
            verified: true,
            albums: [1, 2],
            topSongs: [1, 3, 5]
        },
        {
            id: 2,
            name: "Neon Dreams",
            genre: "Synthwave",
            image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
            followers: 89300,
            monthlyListeners: 32100,
            bio: "Electronic music duo creating nostalgic synthwave sounds inspired by 80s aesthetics.",
            verified: true,
            albums: [3],
            topSongs: [2, 4]
        },
        {
            id: 3,
            name: "Coastal Calm",
            genre: "Ambient",
            image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop",
            followers: 76200,
            monthlyListeners: 28900,
            bio: "Ambient music project focusing on peaceful soundscapes and natural environments.",
            verified: false,
            albums: [4],
            topSongs: [3]
        },
        {
            id: 4,
            name: "Thunder Strike",
            genre: "Rock",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            followers: 234500,
            monthlyListeners: 87600,
            bio: "High-energy rock band delivering powerful performances and memorable anthems.",
            verified: true,
            albums: [5],
            topSongs: [7]
        }
    ],

    // Albums
    albums: [
        {
            id: 1,
            title: "Summer Vibes",
            artist: "Indie Wave",
            artistId: 1,
            year: 2024,
            genre: "Indie Pop",
            artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            tracks: [1],
            duration: "42:18",
            description: "A collection of feel-good indie pop songs perfect for summer.",
            label: "Independent"
        },
        {
            id: 2,
            title: "City Lights",
            artist: "Neon Dreams",
            artistId: 2,
            year: 2023,
            genre: "Synthwave",
            artwork: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
            tracks: [2, 4],
            duration: "38:45",
            description: "Synthwave journey through neon-lit cityscapes and midnight adventures.",
            label: "Retro Wave Records"
        },
        {
            id: 3,
            title: "Waves",
            artist: "Coastal Calm",
            artistId: 3,
            year: 2024,
            genre: "Ambient",
            artwork: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop",
            tracks: [3],
            duration: "52:30",
            description: "Relaxing ambient soundscapes inspired by ocean environments.",
            label: "Nature Sounds"
        },
        {
            id: 4,
            title: "Maximum Volume",
            artist: "Thunder Strike",
            artistId: 4,
            year: 2024,
            genre: "Rock",
            artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            tracks: [7],
            description: "High-energy rock album with powerful guitar riffs and driving rhythms.",
            duration: "45:20",
            label: "Rock Solid Records"
        }
    ],

    // Playlists
    playlists: [
        {
            id: 1,
            name: "Today's Top Hits",
            description: "The most played songs right now",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            tracks: [1, 2, 4, 7],
            creator: "SoundWave",
            isPublic: true,
            followers: 2340000,
            duration: "16:00",
            lastUpdated: "2024-07-31"
        },
        {
            id: 2,
            name: "Chill Vibes",
            description: "Relaxing music for any time of day",
            image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop",
            tracks: [3, 5, 8],
            creator: "SoundWave",
            isPublic: true,
            followers: 1850000,
            duration: "17:37",
            lastUpdated: "2024-07-30"
        },
        {
            id: 3,
            name: "Electronic Beats",
            description: "The best in electronic music",
            image: "3.jpeg",
            tracks: [2, 4],
            creator: "SoundWave",
            isPublic: true,
            followers: 987000,
            duration: "8:13",
            lastUpdated: "2024-07-29"
        },
        {
            id: 4,
            name: "My Favorites",
            description: "Your liked songs",
            image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
            tracks: [2, 4, 6, 8],
            creator: "You",
            isPublic: false,
            followers: 1,
            duration: "22:16",
            lastUpdated: "2024-07-31"
        }
    ],

    // Genres
    genres: [
        {
            id: 1,
            name: "Pop",
            color: "#ff6b6b",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            description: "Popular music from around the world"
        },
        {
            id: 2,
            name: "Rock",
            color: "#4ecdc4",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            description: "Classic and modern rock music"
        },
        {
            id: 3,
            name: "Electronic",
            color: "#45b7d1",
            image: "https://images.unsplash.com/photo-1571115764595-644a64828c75?w=300&h=300&fit=crop",
            description: "Electronic and dance music"
        },
        {
            id: 4,
            name: "Jazz",
            color: "#f9ca24",
            image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
            description: "Smooth jazz and blues"
        },
        {
            id: 5,
            name: "Classical",
            color: "#6c5ce7",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
            description: "Classical and orchestral music"
        },
        {
            id: 6,
            name: "Ambient",
            color: "#a29bfe",
            image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop",
            description: "Relaxing ambient soundscapes"
        }
    ],

    // Recently Played
    recentlyPlayed: [
        { songId: 2, playedAt: "2024-07-31T10:30:00Z" },
        { songId: 1, playedAt: "2024-07-31T09:15:00Z" },
        { songId: 4, playedAt: "2024-07-30T20:45:00Z" },
        { songId: 6, playedAt: "2024-07-30T18:20:00Z" }
    ],

    // User Data
    user: {
        id: 1,
        name: "Music Lover",
        email: "user@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c9d4dc96?w=40&h=40&fit=crop&crop=face",
        premium: false,
        preferences: {
            theme: "dark",
            autoplay: true,
            crossfade: true,
            volume: 0.8,
            showLyrics: true
        },
        likedSongs: [2, 4, 6, 8],
        followedArtists: [1, 2, 4],
        createdPlaylists: []
    }
};

// Helper Functions
const musicHelpers = {
    // Get song by ID
    getSongById(id) {
        return musicData.songs.find(song => song.id === id);
    },

    // Get artist by ID
    getArtistById(id) {
        return musicData.artists.find(artist => artist.id === id);
    },

    // Get album by ID
    getAlbumById(id) {
        return musicData.albums.find(album => album.id === id);
    },

    // Get playlist by ID
    getPlaylistById(id) {
        return musicData.playlists.find(playlist => playlist.id === id);
    },

    // Get songs by genre
    getSongsByGenre(genre) {
        return musicData.songs.filter(song => 
            song.genre.toLowerCase().includes(genre.toLowerCase())
        );
    },

    // Get songs by artist
    getSongsByArtist(artistName) {
        return musicData.songs.filter(song => 
            song.artist.toLowerCase().includes(artistName.toLowerCase())
        );
    },

    // Search songs
    searchSongs(query) {
        const lowercaseQuery = query.toLowerCase();
        return musicData.songs.filter(song => 
            song.title.toLowerCase().includes(lowercaseQuery) ||
            song.artist.toLowerCase().includes(lowercaseQuery) ||
            song.album.toLowerCase().includes(lowercaseQuery) ||
            song.genre.toLowerCase().includes(lowercaseQuery)
        );
    },

    // Search artists
    searchArtists(query) {
        const lowercaseQuery = query.toLowerCase();
        return musicData.artists.filter(artist => 
            artist.name.toLowerCase().includes(lowercaseQuery) ||
            artist.genre.toLowerCase().includes(lowercaseQuery)
        );
    },

    // Search albums
    searchAlbums(query) {
        const lowercaseQuery = query.toLowerCase();
        return musicData.albums.filter(album => 
            album.title.toLowerCase().includes(lowercaseQuery) ||
            album.artist.toLowerCase().includes(lowercaseQuery) ||
            album.genre.toLowerCase().includes(lowercaseQuery)
        );
    },

    // Search playlists
    searchPlaylists(query) {
        const lowercaseQuery = query.toLowerCase();
        return musicData.playlists.filter(playlist => 
            playlist.name.toLowerCase().includes(lowercaseQuery) ||
            playlist.description.toLowerCase().includes(lowercaseQuery)
        );
    },

    // Get trending songs (most played)
    getTrendingSongs() {
        return musicData.songs
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 10);
    },

    // Get recommended songs based on liked songs
    getRecommendedSongs(likedSongIds) {
        const likedGenres = likedSongIds
            .map(id => this.getSongById(id))
            .filter(Boolean)
            .map(song => song.genre);
        
        const uniqueGenres = [...new Set(likedGenres)];
        
        return musicData.songs
            .filter(song => 
                uniqueGenres.includes(song.genre) && 
                !likedSongIds.includes(song.id)
            )
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 8);
    },

    // Format duration from seconds to MM:SS
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Get random songs
    getRandomSongs(count = 5) {
        const shuffled = [...musicData.songs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // Get songs from playlist
    getPlaylistSongs(playlistId) {
        const playlist = this.getPlaylistById(playlistId);
        if (!playlist) return [];
        
        return playlist.tracks
            .map(songId => this.getSongById(songId))
            .filter(Boolean);
    },

    // Add song to playlist
    addSongToPlaylist(songId, playlistId) {
        const playlist = this.getPlaylistById(playlistId);
        if (playlist && !playlist.tracks.includes(songId)) {
            playlist.tracks.push(songId);
            playlist.lastUpdated = new Date().toISOString().split('T')[0];
            return true;
        }
        return false;
    },

    // Remove song from playlist
    removeSongFromPlaylist(songId, playlistId) {
        const playlist = this.getPlaylistById(playlistId);
        if (playlist) {
            const index = playlist.tracks.indexOf(songId);
            if (index > -1) {
                playlist.tracks.splice(index, 1);
                playlist.lastUpdated = new Date().toISOString().split('T')[0];
                return true;
            }
        }
        return false;
    },

    // Toggle like song
    toggleLikeSong(songId) {
        const song = this.getSongById(songId);
        if (song) {
            song.isLiked = !song.isLiked;
            
            const userLikedIndex = musicData.user.likedSongs.indexOf(songId);
            if (song.isLiked && userLikedIndex === -1) {
                musicData.user.likedSongs.push(songId);
            } else if (!song.isLiked && userLikedIndex > -1) {
                musicData.user.likedSongs.splice(userLikedIndex, 1);
            }
            
            return song.isLiked;
        }
        return false;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { musicData, musicHelpers };
}
