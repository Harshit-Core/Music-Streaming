// API Configuration and Management
class MusicAPI {
    constructor() {
        // Load saved configurations from localStorage
        const savedSpotifyClientId = localStorage.getItem('spotify_client_id');
        const savedSpotifyClientSecret = localStorage.getItem('spotify_client_secret');
        const savedYouTubeApiKey = localStorage.getItem('youtube_api_key');
        
        // API Configurations
        this.config = {
            spotify: {
                clientId: savedSpotifyClientId || 'YOUR_SPOTIFY_CLIENT_ID',
                clientSecret: savedSpotifyClientSecret || 'YOUR_SPOTIFY_CLIENT_SECRET',
                redirectUri: window.location.origin,
                scopes: [
                    'streaming',
                    'user-read-email',
                    'user-read-private',
                    'user-library-read',
                    'user-library-modify',
                    'user-read-playback-state',
                    'user-modify-playback-state',
                    'playlist-read-private',
                    'playlist-modify-public',
                    'playlist-modify-private'
                ]
            },
            youtube: {
                apiKey: savedYouTubeApiKey || 'YOUR_YOUTUBE_API_KEY',
                baseUrl: 'https://www.googleapis.com/youtube/v3'
            }
        };
        
        this.accessToken = localStorage.getItem('spotify_access_token');
        this.refreshToken = localStorage.getItem('spotify_refresh_token');
        this.tokenExpiry = localStorage.getItem('spotify_token_expiry');
        
        this.init();
    }

    init() {
        // Check if we have a valid Spotify token
        this.checkSpotifyAuth();
        
        // Handle Spotify callback
        this.handleSpotifyCallback();
    }

    // ===== SPOTIFY API METHODS =====
    
    async authenticateSpotify() {
        const authUrl = this.buildSpotifyAuthUrl();
        window.location.href = authUrl;
    }

    buildSpotifyAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.config.spotify.clientId,
            response_type: 'code',
            redirect_uri: this.config.spotify.redirectUri,
            scope: this.config.spotify.scopes.join(' '),
            state: this.generateRandomString(16),
            show_dialog: true
        });
        
        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    async handleSpotifyCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
            console.error('Spotify authentication error:', error);
            return;
        }
        
        if (code) {
            try {
                await this.exchangeCodeForToken(code);
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error('Error exchanging code for token:', error);
            }
        }
    }

    async exchangeCodeForToken(code) {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(this.config.spotify.clientId + ':' + this.config.spotify.clientSecret)
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.config.spotify.redirectUri
            })
        });

        const data = await response.json();
        
        if (data.access_token) {
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);
            
            // Save tokens
            localStorage.setItem('spotify_access_token', this.accessToken);
            localStorage.setItem('spotify_refresh_token', this.refreshToken);
            localStorage.setItem('spotify_token_expiry', this.tokenExpiry);
            
            console.log('Spotify authentication successful!');
            this.onAuthSuccess();
        }
    }

    async refreshSpotifyToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(this.config.spotify.clientId + ':' + this.config.spotify.clientSecret)
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken
            })
        });

        const data = await response.json();
        
        if (data.access_token) {
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);
            
            localStorage.setItem('spotify_access_token', this.accessToken);
            localStorage.setItem('spotify_token_expiry', this.tokenExpiry);
        }
    }

    async checkSpotifyAuth() {
        if (this.accessToken && this.tokenExpiry) {
            if (Date.now() >= this.tokenExpiry) {
                try {
                    await this.refreshSpotifyToken();
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    this.clearSpotifyAuth();
                }
            }
        }
    }

    clearSpotifyAuth() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expiry');
    }

    async makeSpotifyRequest(endpoint, options = {}) {
        await this.checkSpotifyAuth();
        
        if (!this.accessToken) {
            throw new Error('No valid Spotify access token');
        }

        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (response.status === 401) {
            await this.refreshSpotifyToken();
            return this.makeSpotifyRequest(endpoint, options);
        }

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Search methods
    async searchSpotify(query, type = 'track', limit = 20) {
        const params = new URLSearchParams({
            q: query,
            type: type,
            limit: limit,
            market: 'US'
        });

        return this.makeSpotifyRequest(`/search?${params.toString()}`);
    }

    async getSpotifyTracks(query, limit = 20) {
        const results = await this.searchSpotify(query, 'track', limit);
        return this.formatSpotifyTracks(results.tracks.items);
    }

    async getSpotifyArtists(query, limit = 20) {
        const results = await this.searchSpotify(query, 'artist', limit);
        return this.formatSpotifyArtists(results.artists.items);
    }

    async getSpotifyAlbums(query, limit = 20) {
        const results = await this.searchSpotify(query, 'album', limit);
        return this.formatSpotifyAlbums(results.albums.items);
    }

    async getSpotifyPlaylists(query, limit = 20) {
        const results = await this.searchSpotify(query, 'playlist', limit);
        return this.formatSpotifyPlaylists(results.playlists.items);
    }

    // Get featured content
    async getFeaturedPlaylists(limit = 20) {
        const results = await this.makeSpotifyRequest(`/browse/featured-playlists?limit=${limit}`);
        return this.formatSpotifyPlaylists(results.playlists.items);
    }

    async getNewReleases(limit = 20) {
        const results = await this.makeSpotifyRequest(`/browse/new-releases?limit=${limit}`);
        return this.formatSpotifyAlbums(results.albums.items);
    }

    async getTopTracks(limit = 20) {
        // Get user's top tracks if authenticated, otherwise use featured playlists
        try {
            const results = await this.makeSpotifyRequest(`/me/top/tracks?limit=${limit}&time_range=short_term`);
            return this.formatSpotifyTracks(results.items);
        } catch (error) {
            // Fallback to featured content
            const playlists = await this.getFeaturedPlaylists(1);
            if (playlists.length > 0) {
                return this.getPlaylistTracks(playlists[0].id);
            }
            return [];
        }
    }

    async getPlaylistTracks(playlistId) {
        const results = await this.makeSpotifyRequest(`/playlists/${playlistId}/tracks`);
        return this.formatSpotifyTracks(results.items.map(item => item.track));
    }

    // ===== YOUTUBE API METHODS =====
    
    async searchYouTube(query, maxResults = 20) {
        const params = new URLSearchParams({
            part: 'snippet',
            q: query + ' music',
            type: 'video',
            videoCategoryId: '10', // Music category
            maxResults: maxResults,
            key: this.config.youtube.apiKey
        });

        try {
            const response = await fetch(`${this.config.youtube.baseUrl}/search?${params.toString()}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('YouTube API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('YouTube API Response:', data);
            
            if (data.error) {
                console.error('YouTube API returned error:', data.error);
                throw new Error(`YouTube API error: ${data.error.code} - ${data.error.message}`);
            }
            
            return this.formatYouTubeVideos(data.items || []);
        } catch (error) {
            console.error('YouTube search failed:', error);
            throw error;
        }
    }

    async getYouTubeVideoDetails(videoIds) {
        const params = new URLSearchParams({
            part: 'snippet,contentDetails,statistics',
            id: videoIds.join(','),
            key: this.config.youtube.apiKey
        });

        const response = await fetch(`${this.config.youtube.baseUrl}/videos?${params.toString()}`);
        const data = await response.json();
        return data.items;
    }

    // ===== DATA FORMATTING METHODS =====
    
    formatSpotifyTracks(tracks) {
        return tracks.map(track => ({
            id: `spotify_${track.id}`,
            title: track.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            album: track.album.name,
            duration: this.formatDuration(track.duration_ms / 1000),
            genre: track.album.genres?.[0] || 'Unknown',
            year: new Date(track.album.release_date).getFullYear(),
            artwork: track.album.images[0]?.url || '',
            audioUrl: track.preview_url || '', // 30-second preview
            spotifyUri: track.uri,
            externalUrl: track.external_urls.spotify,
            isLiked: false,
            playCount: track.popularity,
            source: 'spotify'
        }));
    }

    formatSpotifyArtists(artists) {
        return artists.map(artist => ({
            id: `spotify_${artist.id}`,
            name: artist.name,
            genre: artist.genres?.[0] || 'Unknown',
            image: artist.images[0]?.url || '',
            followers: artist.followers.total,
            popularity: artist.popularity,
            spotifyUri: artist.uri,
            externalUrl: artist.external_urls.spotify,
            source: 'spotify'
        }));
    }

    formatSpotifyAlbums(albums) {
        return albums.map(album => ({
            id: `spotify_${album.id}`,
            title: album.name,
            artist: album.artists.map(artist => artist.name).join(', '),
            year: new Date(album.release_date).getFullYear(),
            genre: album.genres?.[0] || 'Unknown',
            artwork: album.images[0]?.url || '',
            totalTracks: album.total_tracks,
            spotifyUri: album.uri,
            externalUrl: album.external_urls.spotify,
            source: 'spotify'
        }));
    }

    formatSpotifyPlaylists(playlists) {
        return playlists.map(playlist => ({
            id: `spotify_${playlist.id}`,
            name: playlist.name,
            description: playlist.description || '',
            image: playlist.images[0]?.url || '',
            tracks: playlist.tracks?.total || 0,
            creator: playlist.owner.display_name,
            isPublic: playlist.public,
            spotifyUri: playlist.uri,
            externalUrl: playlist.external_urls.spotify,
            source: 'spotify'
        }));
    }

    formatYouTubeVideos(videos) {
        return videos.map(video => ({
            id: `youtube_${video.id.videoId}`,
            title: this.cleanYouTubeTitle(video.snippet.title),
            artist: video.snippet.channelTitle,
            album: 'YouTube',
            duration: '0:00', // Would need additional API call to get duration
            genre: 'Music',
            year: new Date(video.snippet.publishedAt).getFullYear(),
            artwork: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
            audioUrl: '', // YouTube doesn't provide direct audio URLs
            youtubeId: video.id.videoId,
            youtubeUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            embedUrl: `https://www.youtube.com/embed/${video.id.videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=1&controls=1`,
            type: 'youtube',
            isLiked: false,
            playCount: 0,
            source: 'youtube'
        }));
    }

    cleanYouTubeTitle(title) {
        // Remove common YouTube title suffixes
        return title
            .replace(/\s*\(Official.*?\)/gi, '')
            .replace(/\s*\[Official.*?\]/gi, '')
            .replace(/\s*- Official.*$/gi, '')
            .replace(/\s*\| Official.*$/gi, '')
            .trim();
    }

    // ===== UTILITY METHODS =====
    
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    onAuthSuccess() {
        // Callback for successful authentication
        if (app) {
            app.onAPIConnected('spotify');
        }
    }

    // ===== COMBINED SEARCH METHODS =====
    
    async searchAll(query, limit = 10) {
        const results = {
            songs: [],
            artists: [],
            albums: [],
            playlists: []
        };

        console.log('API Search started for:', query);

        try {
            // Try Spotify first if authenticated
            if (this.accessToken && this.isAuthenticated()) {
                console.log('Searching Spotify with authenticated user...');
                try {
                    const [spotifySongs, spotifyArtists, spotifyAlbums, spotifyPlaylists] = await Promise.all([
                        this.getSpotifyTracks(query, limit),
                        this.getSpotifyArtists(query, limit),
                        this.getSpotifyAlbums(query, limit),
                        this.getSpotifyPlaylists(query, limit)
                    ]);

                    results.songs.push(...spotifySongs);
                    results.artists.push(...spotifyArtists);
                    results.albums.push(...spotifyAlbums);
                    results.playlists.push(...spotifyPlaylists);
                    
                    console.log('Spotify results:', { 
                        songs: spotifySongs.length, 
                        artists: spotifyArtists.length,
                        albums: spotifyAlbums.length,
                        playlists: spotifyPlaylists.length
                    });
                } catch (spotifyError) {
                    console.error('Spotify search error:', spotifyError);
                }
            } else {
                console.log('Spotify not authenticated, skipping Spotify search');
            }

            // Add YouTube results if API key is configured
            if (this.config.youtube.apiKey && this.config.youtube.apiKey !== 'YOUR_YOUTUBE_API_KEY') {
                console.log('Searching YouTube...');
                try {
                    const youtubeVideos = await this.searchYouTube(query, limit);
                    results.songs.push(...youtubeVideos);
                    console.log('YouTube results:', youtubeVideos.length, 'videos');
                } catch (youtubeError) {
                    console.error('YouTube search error:', youtubeError);
                }
            } else {
                console.log('YouTube API not configured, skipping YouTube search');
            }

        } catch (error) {
            console.error('API search error:', error);
        }

        console.log('Total API results:', results);
        return results;
    }

    // Check if APIs are configured
    isSpotifyConfigured() {
        const isConfigured = this.config.spotify.clientId !== 'YOUR_SPOTIFY_CLIENT_ID' && 
               this.config.spotify.clientSecret !== 'YOUR_SPOTIFY_CLIENT_SECRET';
        console.log('Spotify configured:', isConfigured, {
            clientId: this.config.spotify.clientId !== 'YOUR_SPOTIFY_CLIENT_ID' ? 'SET' : 'NOT_SET',
            clientSecret: this.config.spotify.clientSecret !== 'YOUR_SPOTIFY_CLIENT_SECRET' ? 'SET' : 'NOT_SET'
        });
        return isConfigured;
    }

    isYouTubeConfigured() {
        const isConfigured = this.config.youtube.apiKey !== 'YOUR_YOUTUBE_API_KEY';
        console.log('YouTube configured:', isConfigured, {
            apiKey: this.config.youtube.apiKey !== 'YOUR_YOUTUBE_API_KEY' ? 'SET' : 'NOT_SET'
        });
        return isConfigured;
    }

    isAuthenticated() {
        const authenticated = !!this.accessToken && Date.now() < this.tokenExpiry;
        console.log('Spotify authenticated:', authenticated, {
            hasToken: !!this.accessToken,
            tokenExpiry: new Date(this.tokenExpiry),
            now: new Date()
        });
        return authenticated;
    }

    // Test API connections
    async testAPIs() {
        console.log('=== API Test Results ===');
        
        // Test Spotify
        if (this.isSpotifyConfigured()) {
            if (this.isAuthenticated()) {
                try {
                    const testResult = await this.makeSpotifyRequest('/me');
                    console.log('✅ Spotify API working - User:', testResult.display_name);
                } catch (error) {
                    console.log('❌ Spotify API error:', error.message);
                }
            } else {
                console.log('⚠️ Spotify configured but not authenticated');
            }
        } else {
            console.log('❌ Spotify not configured');
        }
        
        // Test YouTube
        if (this.isYouTubeConfigured()) {
            try {
                const testResult = await this.searchYouTube('test music', 1);
                console.log('✅ YouTube API working - Found', testResult.length, 'results');
            } catch (error) {
                console.log('❌ YouTube API error:', error.message);
            }
        } else {
            console.log('❌ YouTube not configured');
        }
        
        console.log('=== End API Test ===');
    }
}

// Initialize API when DOM is loaded
let musicAPI;
let apiReady = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing MusicAPI...');
    musicAPI = new MusicAPI();
    apiReady = true;
    console.log('MusicAPI initialized:', musicAPI);
    
    // Trigger custom event to notify app that API is ready
    document.dispatchEvent(new CustomEvent('apiReady'));
});
