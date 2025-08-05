// Main Application Controller
class MusicApp {
    constructor() {
        this.currentSection = 'discover';
        this.searchQuery = '';
        this.searchFilter = 'all';
        this.userPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];
        this.likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Store API results for playback
        this.apiSongs = new Map(); // Store API songs by ID
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.bindNavigationEvents();
        this.bindSearchEvents();
        this.bindModalEvents();
        this.bindPanelEvents();
        this.bindAPIEvents();
        this.loadInitialContent();
        this.updateSidebarPlaylists();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    bindNavigationEvents() {
        // Sidebar navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Back and forward buttons
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });

        document.getElementById('forwardBtn').addEventListener('click', () => {
            this.goForward();
        });
    }

    bindSearchEvents() {
        const globalSearch = document.getElementById('globalSearch');
        let searchTimeout;

        globalSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.trim();
                if (this.searchQuery) {
                    this.navigateToSection('search');
                    this.performSearch();
                }
            }, 300);
        });

        globalSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchQuery = e.target.value.trim();
                if (this.searchQuery) {
                    this.navigateToSection('search');
                    this.performSearch();
                }
            }
        });

        // Search filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.searchFilter = btn.getAttribute('data-filter');
                if (this.searchQuery) {
                    this.performSearch();
                }
            });
        });
    }

    bindModalEvents() {
        // Create playlist modal
        const createPlaylistBtn = document.getElementById('createPlaylistBtn');
        const createPlaylistModal = document.getElementById('createPlaylistModal');
        const closeCreatePlaylist = document.getElementById('closeCreatePlaylist');
        const cancelCreatePlaylist = document.getElementById('cancelCreatePlaylist');
        const confirmCreatePlaylist = document.getElementById('confirmCreatePlaylist');

        createPlaylistBtn.addEventListener('click', () => {
            this.showCreatePlaylistModal();
        });

        closeCreatePlaylist.addEventListener('click', () => {
            this.hideCreatePlaylistModal();
        });

        cancelCreatePlaylist.addEventListener('click', () => {
            this.hideCreatePlaylistModal();
        });

        confirmCreatePlaylist.addEventListener('click', () => {
            this.createPlaylist();
        });

        // Close modal when clicking outside
        createPlaylistModal.addEventListener('click', (e) => {
            if (e.target === createPlaylistModal) {
                this.hideCreatePlaylistModal();
            }
        });

        // API Settings Modal
        const apiSettingsModal = document.getElementById('apiSettingsModal');
        const closeApiSettings = document.getElementById('closeApiSettings');
        const cancelApiSettings = document.getElementById('cancelApiSettings');
        const saveSpotifyConfig = document.getElementById('saveSpotifyConfig');
        const saveYoutubeConfig = document.getElementById('saveYoutubeConfig');
        const testAPIs = document.getElementById('testAPIs');

        closeApiSettings.addEventListener('click', () => {
            this.hideAPISettingsModal();
        });

        cancelApiSettings.addEventListener('click', () => {
            this.hideAPISettingsModal();
        });

        saveSpotifyConfig.addEventListener('click', () => {
            this.saveSpotifyConfiguration();
        });

        saveYoutubeConfig.addEventListener('click', () => {
            this.saveYouTubeConfiguration();
        });

        testAPIs.addEventListener('click', () => {
            if (musicAPI) {
                this.showNotification('Testing APIs... Check console for details', 'info');
                musicAPI.testAPIs();
            }
        });

        // Close modal when clicking outside
        apiSettingsModal.addEventListener('click', (e) => {
            if (e.target === apiSettingsModal) {
                this.hideAPISettingsModal();
            }
        });
    }

    bindPanelEvents() {
        // Queue panel
        const queueBtn = document.getElementById('queueBtn');
        const queuePanel = document.getElementById('queuePanel');
        const closeQueue = document.getElementById('closeQueue');

        queueBtn.addEventListener('click', () => {
            queuePanel.classList.toggle('active');
        });

        closeQueue.addEventListener('click', () => {
            queuePanel.classList.remove('active');
        });

        // Lyrics panel
        const lyricsBtn = document.getElementById('lyricsBtn');
        const lyricsPanel = document.getElementById('lyricsPanel');
        const closeLyrics = document.getElementById('closeLyrics');

        lyricsBtn.addEventListener('click', () => {
            lyricsPanel.classList.toggle('active');
            if (lyricsPanel.classList.contains('active')) {
                this.loadLyrics();
            }
        });

        closeLyrics.addEventListener('click', () => {
            lyricsPanel.classList.remove('active');
        });

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    bindAPIEvents() {
        // Connect Spotify button
        const connectSpotify = document.getElementById('connectSpotify');
        const spotifyStatus = document.getElementById('spotifyStatus');
        const apiSettingsBtn = document.getElementById('apiSettingsBtn');
        
        connectSpotify.addEventListener('click', () => {
            if (musicAPI && musicAPI.isSpotifyConfigured()) {
                if (musicAPI.isAuthenticated()) {
                    this.showNotification('Already connected to Spotify!', 'success');
                } else {
                    musicAPI.authenticateSpotify();
                }
            } else {
                this.showAPISettings();
            }
        });

        // API Settings button
        apiSettingsBtn.addEventListener('click', () => {
            this.showAPISettings();
        });

        // Update Spotify status on page load
        this.updateAPIStatus();
        
        // Check for API status updates every few seconds
        setInterval(() => {
            this.updateAPIStatus();
        }, 5000);
    }

    showAPISettings() {
        const modal = document.getElementById('apiSettingsModal');
        modal.classList.add('active');
        
        // Load existing configuration
        if (musicAPI) {
            document.getElementById('spotifyClientId').value = musicAPI.config.spotify.clientId === 'YOUR_SPOTIFY_CLIENT_ID' ? '' : musicAPI.config.spotify.clientId;
            document.getElementById('youtubeApiKey').value = musicAPI.config.youtube.apiKey === 'YOUR_YOUTUBE_API_KEY' ? '' : musicAPI.config.youtube.apiKey;
        }
        
        // Show helpful message if no APIs are configured
        setTimeout(() => {
            if (!musicAPI.isSpotifyConfigured() && !musicAPI.isYouTubeConfigured()) {
                this.showNotification('Configure at least one API to access millions of songs!', 'info');
            }
        }, 500);
    }

    updateAPIStatus() {
        const spotifyStatus = document.getElementById('spotifyStatus');
        const connectBtn = document.getElementById('connectSpotify');
        
        if (musicAPI && musicAPI.isAuthenticated()) {
            spotifyStatus.innerHTML = '<i class="fas fa-circle"></i><span>Connected ✓</span>';
            spotifyStatus.classList.add('connected');
            connectBtn.innerHTML = '<i class="fab fa-spotify"></i><span>Connected ✓</span>';
            connectBtn.classList.add('connected');
        } else if (musicAPI && musicAPI.isSpotifyConfigured()) {
            spotifyStatus.innerHTML = '<i class="fas fa-circle"></i><span>Ready to Connect</span>';
            spotifyStatus.classList.remove('connected');
            connectBtn.innerHTML = '<i class="fab fa-spotify"></i><span>Connect Spotify</span>';
            connectBtn.classList.remove('connected');
        } else {
            spotifyStatus.innerHTML = '<i class="fas fa-circle"></i><span>Not Configured</span>';
            spotifyStatus.classList.remove('connected');
            connectBtn.innerHTML = '<i class="fab fa-spotify"></i><span>Setup Required</span>';
            connectBtn.classList.remove('connected');
        }
        
        // Update title with current status
        const totalConfigured = (musicAPI?.isSpotifyConfigured() ? 1 : 0) + (musicAPI?.isYouTubeConfigured() ? 1 : 0);
        const totalConnected = musicAPI?.isAuthenticated() ? 1 : 0;
        
        if (totalConfigured === 0) {
            connectBtn.title = 'Click to configure APIs and access millions of songs';
        } else if (totalConnected === 0) {
            connectBtn.title = 'APIs configured - click to connect';
        } else {
            connectBtn.title = 'Connected to APIs - access millions of songs!';
        }
    }

    onAPIConnected(apiName) {
        this.showNotification(`Successfully connected to ${apiName}! 🎉`, 'success');
        this.updateAPIStatus();
        
        // Show what's now possible
        setTimeout(() => {
            this.showNotification(`Try searching for your favorite artist now!`, 'info');
        }, 2000);
        
        // Refresh current content with API data
        if (this.currentSection === 'search' && this.searchQuery) {
            this.performSearch();
        }
    }

    navigateToSection(sectionName) {
        // Update active navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${sectionName}"]`).parentElement.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionName).classList.add('active');
        this.currentSection = sectionName;

        // Load content for section
        this.loadSectionContent(sectionName);
    }

    loadInitialContent() {
        this.loadSectionContent('discover');
    }

    loadSectionContent(sectionName) {
        switch (sectionName) {
            case 'discover':
                this.loadDiscoverContent();
                break;
            case 'search':
                if (this.searchQuery) {
                    this.performSearch();
                }
                break;
            case 'library':
                this.loadLibraryContent();
                break;
            case 'playlists':
                this.loadPlaylistsContent();
                break;
            case 'artists':
                this.loadArtistsContent();
                break;
            case 'albums':
                this.loadAlbumsContent();
                break;
        }
    }

    loadDiscoverContent() {
        // Load featured playlists
        this.loadFeaturedPlaylists();
        
        // Load trending songs
        this.loadTrendingSongs();
        
        // Load genres
        this.loadGenres();
    }

    loadFeaturedPlaylists() {
        const container = document.getElementById('featuredPlaylists');
        const playlists = musicData.playlists.filter(p => p.isPublic).slice(0, 6);
        
        container.innerHTML = playlists.map(playlist => `
            <div class="card" onclick="app.playPlaylist(${playlist.id})">
                <img src="${playlist.image}" alt="${playlist.name}" class="card-image">
                <h3 class="card-title">${playlist.name}</h3>
                <p class="card-subtitle">${playlist.description}</p>
                <button class="play-btn-overlay" onclick="event.stopPropagation(); app.playPlaylist(${playlist.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
    }

    loadTrendingSongs() {
        const container = document.getElementById('trendingSongs');
        const trending = musicHelpers.getTrendingSongs().slice(0, 10);
        
        container.innerHTML = trending.map((song, index) => `
            <div class="song-item" onclick="app.playSong(${song.id})">
                <div class="song-number">${index + 1}</div>
                <div class="song-info">
                    <img src="${song.artwork}" alt="${song.title}" class="song-artwork">
                    <div class="song-details">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="song-album">${song.album}</div>
                <div class="song-duration">${song.duration}</div>
                <div class="song-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); app.toggleLikeSong(${song.id})">
                        <i class="fa${song.isLiked ? 's' : 'r'} fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); app.addToQueue(${song.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadGenres() {
        const container = document.getElementById('genreGrid');
        
        container.innerHTML = musicData.genres.map(genre => `
            <div class="card genre-card" style="background: linear-gradient(135deg, ${genre.color}, ${genre.color}CC)" onclick="app.browseGenre('${genre.name}')">
                <h3 class="genre-title">${genre.name}</h3>
            </div>
        `).join('');
    }

    async performSearch() {
        console.log('performSearch called with query:', this.searchQuery, 'filter:', this.searchFilter);
        const resultsContainer = document.getElementById('searchResults');
        
        if (!this.searchQuery) {
            resultsContainer.innerHTML = `
                <div class="search-placeholder">
                    <i class="fas fa-search"></i>
                    <h3>Start searching</h3>
                    <p>Find songs, artists, albums, and playlists</p>
                </div>
            `;
            return;
        }

        // Show loading state
        resultsContainer.innerHTML = `
            <div class="api-loading">
                <i class="fas fa-spinner"></i>
                <span>Searching...</span>
            </div>
        `;

        try {
            let localResults = {};
            let apiResults = {};

            console.log('Searching local data...');
            // Search local data
            switch (this.searchFilter) {
                case 'songs':
                    localResults.songs = musicHelpers.searchSongs(this.searchQuery);
                    break;
                case 'artists':
                    localResults.artists = musicHelpers.searchArtists(this.searchQuery);
                    break;
                case 'albums':
                    localResults.albums = musicHelpers.searchAlbums(this.searchQuery);
                    break;
                case 'playlists':
                    localResults.playlists = musicHelpers.searchPlaylists(this.searchQuery);
                    break;
                default: // 'all'
                    localResults = {
                        songs: musicHelpers.searchSongs(this.searchQuery),
                        artists: musicHelpers.searchArtists(this.searchQuery),
                        albums: musicHelpers.searchAlbums(this.searchQuery),
                        playlists: musicHelpers.searchPlaylists(this.searchQuery)
                    };
                    break;
            }
            
            console.log('Local search results:', localResults);

            // Search APIs if available
            console.log('Checking API availability...', {
                musicAPI_exists: typeof musicAPI !== 'undefined',
                isAuthenticated: musicAPI ? musicAPI.isAuthenticated() : false,
                isYouTubeConfigured: musicAPI ? musicAPI.isYouTubeConfigured() : false
            });
            
            if (musicAPI && (musicAPI.isAuthenticated() || musicAPI.isYouTubeConfigured())) {
                console.log('Searching APIs...');
                try {
                    apiResults = await musicAPI.searchAll(this.searchQuery, 10);
                    console.log('API search results:', apiResults);
                } catch (error) {
                    console.error('API search error:', error);
                    this.showNotification('Some search sources are unavailable', 'warning');
                }
            } else if (musicAPI && (musicAPI.isSpotifyConfigured() || musicAPI.isYouTubeConfigured())) {
                // APIs are configured but not authenticated
                console.log('APIs configured but not authenticated');
                if (musicAPI.isSpotifyConfigured() && !musicAPI.isAuthenticated()) {
                    this.showNotification('Click "Connect Spotify" in sidebar to access Spotify music', 'info');
                }
            } else {
                // No APIs configured - show helpful message on first search
                console.log('No APIs configured');
                if (this.searchQuery && localResults.songs && localResults.songs.length === 0) {
                    setTimeout(() => {
                        this.showNotification('💡 Configure Spotify/YouTube APIs for millions more songs!', 'info');
                    }, 1000);
                }
            }

            // Combine results
            const combinedResults = this.combineSearchResults(localResults, apiResults);

            // Display results based on filter
            switch (this.searchFilter) {
                case 'songs':
                    this.displaySongResults(combinedResults.songs || []);
                    break;
                case 'artists':
                    this.displayArtistResults(combinedResults.artists || []);
                    break;
                case 'albums':
                    this.displayAlbumResults(combinedResults.albums || []);
                    break;
                case 'playlists':
                    this.displayPlaylistResults(combinedResults.playlists || []);
                    break;
                default: // 'all'
                    this.displayAllResults(combinedResults);
                    break;
            }
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = `
                <div class="api-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Search failed. Please try again.</span>
                </div>
            `;
        }
    }

    combineSearchResults(localResults, apiResults) {
        const combined = {
            songs: [...(localResults.songs || [])],
            artists: [...(localResults.artists || [])],
            albums: [...(localResults.albums || [])],
            playlists: [...(localResults.playlists || [])]
        };

        // Add API results and store them in our map
        if (apiResults.songs) {
            apiResults.songs.forEach(song => {
                this.apiSongs.set(song.id, song); // Store API song data
            });
            combined.songs.push(...apiResults.songs);
        }
        
        if (apiResults.artists) {
            combined.artists.push(...apiResults.artists);
        }
        
        if (apiResults.albums) {
            combined.albums.push(...apiResults.albums);
        }
        
        if (apiResults.playlists) {
            combined.playlists.push(...apiResults.playlists);
        }

        return combined;
    }

    displaySongResults(songs) {
        const container = document.getElementById('searchResults');
        
        if (songs.length === 0) {
            container.innerHTML = '<div class="no-results">No songs found</div>';
            return;
        }

        container.innerHTML = `
            <div class="results-section">
                <h3>Songs</h3>
                <div class="song-list">
                    ${songs.map((song, index) => `
                        <div class="song-item" onclick="app.playSong(${song.id})">
                            <div class="song-number">${index + 1}</div>
                            <div class="song-info">
                                <img src="${song.artwork}" alt="${song.title}" class="song-artwork">
                                <div class="song-details">
                                    <h4>${song.title}</h4>
                                    <p>${song.artist}</p>
                                </div>
                            </div>
                            <div class="song-album">${song.album}</div>
                            <div class="song-duration">${song.duration}</div>
                            <div class="song-actions">
                                <button class="action-btn" onclick="event.stopPropagation(); app.toggleLikeSong(${song.id})">
                                    <i class="fa${song.isLiked ? 's' : 'r'} fa-heart"></i>
                                </button>
                                <button class="action-btn" onclick="event.stopPropagation(); app.addToQueue(${song.id})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    displayArtistResults(artists) {
        const container = document.getElementById('searchResults');
        
        if (artists.length === 0) {
            container.innerHTML = '<div class="no-results">No artists found</div>';
            return;
        }

        container.innerHTML = `
            <div class="results-section">
                <h3>Artists</h3>
                <div class="artist-grid">
                    ${artists.map(artist => `
                        <div class="card" onclick="app.viewArtist(${artist.id})">
                            <img src="${artist.image}" alt="${artist.name}" class="card-image">
                            <h3 class="card-title">${artist.name}</h3>
                            <p class="card-subtitle">${artist.genre}</p>
                            <button class="play-btn-overlay" onclick="event.stopPropagation(); app.playArtistTop(${artist.id})">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    displayAllResults(combinedResults = null) {
        let songs, artists, albums, playlists;
        
        if (combinedResults) {
            songs = combinedResults.songs.slice(0, 8);
            artists = combinedResults.artists.slice(0, 6);
            albums = combinedResults.albums.slice(0, 6);
            playlists = combinedResults.playlists.slice(0, 6);
        } else {
            songs = musicHelpers.searchSongs(this.searchQuery).slice(0, 5);
            artists = musicHelpers.searchArtists(this.searchQuery).slice(0, 5);
            albums = musicHelpers.searchAlbums(this.searchQuery).slice(0, 5);
            playlists = musicHelpers.searchPlaylists(this.searchQuery).slice(0, 5);
        }

        const container = document.getElementById('searchResults');
        
        let html = '';

        if (songs.length > 0) {
            html += `
                <div class="results-section">
                    <h3>Songs</h3>
                    <div class="song-list">
                        ${songs.map((song, index) => `
                            <div class="song-item ${song.source ? `data-source="${song.source}"` : ''}" onclick="app.playSong('${song.id}')">
                                <div class="song-number">${index + 1}</div>
                                <div class="song-info">
                                    <img src="${song.artwork}" alt="${song.title}" class="song-artwork">
                                    <div class="song-details">
                                        <h4>${song.title} ${song.source ? `<span class="api-source-indicator ${song.source}"><i class="fab fa-${song.source}"></i></span>` : ''}</h4>
                                        <p>${song.artist}</p>
                                    </div>
                                </div>
                                <div class="song-album">${song.album}</div>
                                <div class="song-duration">${song.duration}</div>
                                <div class="song-actions">
                                    <button class="action-btn" onclick="event.stopPropagation(); app.toggleLikeSong('${song.id}')">
                                        <i class="fa${song.isLiked ? 's' : 'r'} fa-heart"></i>
                                    </button>
                                    ${song.source ? `
                                        <button class="action-btn" onclick="event.stopPropagation(); app.openExternalLink('${song.externalUrl || song.youtubeUrl || ''}')">
                                            <i class="fas fa-external-link-alt"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (artists.length > 0) {
            html += `
                <div class="results-section">
                    <h3>Artists</h3>
                    <div class="card-grid">
                        ${artists.map(artist => `
                            <div class="card" onclick="app.viewArtist(${artist.id})">
                                <img src="${artist.image}" alt="${artist.name}" class="card-image">
                                <h3 class="card-title">${artist.name}</h3>
                                <p class="card-subtitle">${artist.genre}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html || '<div class="no-results">No results found</div>';
    }

    loadLibraryContent() {
        // Load user's library content
        const tabBtns = document.querySelectorAll('.tab-btn');
        const libraryContent = document.getElementById('libraryContent');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tab = btn.getAttribute('data-tab');
                this.loadLibraryTab(tab);
            });
        });

        // Load default tab (songs)
        this.loadLibraryTab('songs');
    }

    loadLibraryTab(tab) {
        const container = document.getElementById('libraryContent');
        
        switch (tab) {
            case 'songs':
                const likedSongs = musicData.songs.filter(song => song.isLiked);
                this.displaySongResults(likedSongs);
                break;
            case 'artists':
                const followedArtists = musicData.artists.filter(artist => 
                    musicData.user.followedArtists.includes(artist.id)
                );
                this.displayArtistResults(followedArtists);
                break;
            case 'albums':
                this.displayAlbumResults(musicData.albums.slice(0, 10));
                break;
        }
    }

    loadPlaylistsContent() {
        const container = document.getElementById('playlistGrid');
        const allPlaylists = [...musicData.playlists, ...this.userPlaylists];
        
        container.innerHTML = allPlaylists.map(playlist => `
            <div class="card" onclick="app.viewPlaylist(${playlist.id})">
                <img src="${playlist.image}" alt="${playlist.name}" class="card-image">
                <h3 class="card-title">${playlist.name}</h3>
                <p class="card-subtitle">${playlist.description}</p>
                <button class="play-btn-overlay" onclick="event.stopPropagation(); app.playPlaylist(${playlist.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
    }

    loadArtistsContent() {
        const container = document.getElementById('artistGrid');
        
        container.innerHTML = musicData.artists.map(artist => `
            <div class="card" onclick="app.viewArtist(${artist.id})">
                <img src="${artist.image}" alt="${artist.name}" class="card-image">
                <h3 class="card-title">${artist.name}</h3>
                <p class="card-subtitle">${artist.genre} • ${artist.followers.toLocaleString()} followers</p>
                <button class="play-btn-overlay" onclick="event.stopPropagation(); app.playArtistTop(${artist.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
    }

    loadAlbumsContent() {
        const container = document.getElementById('albumGrid');
        
        container.innerHTML = musicData.albums.map(album => `
            <div class="card" onclick="app.viewAlbum(${album.id})">
                <img src="${album.artwork}" alt="${album.title}" class="card-image">
                <h3 class="card-title">${album.title}</h3>
                <p class="card-subtitle">${album.artist} • ${album.year}</p>
                <button class="play-btn-overlay" onclick="event.stopPropagation(); app.playAlbum(${album.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
    }

    // Playback Actions
    playSong(songId) {
        let song = musicHelpers.getSongById(songId);
        
        // If not found in local data, check if it's an API song
        if (!song && this.apiSongs.has(songId)) {
            song = this.apiSongs.get(songId);
        }
        
        if (song) {
            // Handle YouTube videos with embedded playback
            if (song.source === 'youtube' && song.youtubeId) {
                if (player) {
                    player.playSong(song);
                    this.showNotification(`Playing "${song.title}" from YouTube`, 'success');
                }
                return;
            }
            
            // For Spotify songs without direct audio URLs, open external link
            if (song.source === 'spotify' && (!song.audioUrl || song.audioUrl === '')) {
                this.showNotification(`Opening "${song.title}" on Spotify...`, 'info');
                
                // Open external link
                const externalUrl = song.externalUrl || song.spotifyUri;
                if (externalUrl) {
                    setTimeout(() => {
                        if (song.spotifyUri) {
                            // Try to open Spotify URI first, fallback to web URL
                            const spotifyUrl = song.spotifyUri.replace('spotify:', 'https://open.spotify.com/');
                            window.open(spotifyUrl, '_blank');
                        } else {
                            window.open(externalUrl, '_blank');
                        }
                    }, 1000);
                } else {
                    this.showNotification('External link not available', 'error');
                }
                return;
            }
            
            // For local songs or API songs with preview URLs
            if (player) {
                if (song.audioUrl && song.audioUrl !== '') {
                    player.playSong(song);
                } else {
                    this.showNotification('No audio available for this track', 'warning');
                }
            }
        } else {
            this.showNotification('Song not found', 'error');
        }
    }

    playPlaylist(playlistId) {
        const playlist = musicHelpers.getPlaylistById(playlistId);
        if (playlist && player) {
            const songs = musicHelpers.getPlaylistSongs(playlistId);
            if (songs.length > 0) {
                player.playSong(songs[0], songs, 0);
            }
        }
    }

    playArtistTop(artistId) {
        const artist = musicHelpers.getArtistById(artistId);
        if (artist && player) {
            const artistSongs = musicHelpers.getSongsByArtist(artist.name);
            if (artistSongs.length > 0) {
                player.playSong(artistSongs[0], artistSongs, 0);
            }
        }
    }

    toggleLikeSong(songId) {
        const isLiked = musicHelpers.toggleLikeSong(songId);
        this.saveData();
        
        // Update UI
        if (this.currentSection === 'discover') {
            this.loadTrendingSongs();
        } else if (this.currentSection === 'search') {
            this.performSearch();
        }
    }

    addToQueue(songId) {
        const song = musicHelpers.getSongById(songId);
        if (song && player) {
            player.addToQueue(song);
        }
    }

    browseGenre(genreName) {
        this.searchQuery = genreName;
        this.searchFilter = 'songs';
        this.navigateToSection('search');
        this.performSearch();
    }

    // Modal Methods
    showCreatePlaylistModal() {
        const modal = document.getElementById('createPlaylistModal');
        modal.classList.add('active');
        
        // Clear form
        document.getElementById('playlistName').value = '';
        document.getElementById('playlistDescription').value = '';
        
        // Focus name input
        setTimeout(() => {
            document.getElementById('playlistName').focus();
        }, 100);
    }

    hideCreatePlaylistModal() {
        const modal = document.getElementById('createPlaylistModal');
        modal.classList.remove('active');
    }

    createPlaylist() {
        const name = document.getElementById('playlistName').value.trim();
        const description = document.getElementById('playlistDescription').value.trim();
        
        if (!name) {
            alert('Please enter a playlist name');
            return;
        }

        const newPlaylist = {
            id: Date.now(), // Simple ID generation
            name,
            description: description || 'My custom playlist',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
            tracks: [],
            creator: 'You',
            isPublic: false,
            followers: 1,
            duration: '0:00',
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        this.userPlaylists.push(newPlaylist);
        this.saveData();
        this.updateSidebarPlaylists();
        this.hideCreatePlaylistModal();
        
        // Show success message
        if (player) {
            player.showNotification(`Created playlist "${name}"`);
        }

        // Navigate to playlists if not already there
        if (this.currentSection === 'playlists') {
            this.loadPlaylistsContent();
        }
    }

    updateSidebarPlaylists() {
        const container = document.getElementById('sidebarPlaylists');
        const playlists = [...musicData.playlists.filter(p => p.creator === 'You'), ...this.userPlaylists];
        
        container.innerHTML = `
            <li class="playlist-item" onclick="app.navigateToSection('library')">
                <i class="fas fa-heart"></i>
                <span>Liked Songs</span>
            </li>
            <li class="playlist-item" onclick="app.showCreatePlaylistModal()">
                <i class="fas fa-plus"></i>
                <span>Create Playlist</span>
            </li>
            ${playlists.map(playlist => `
                <li class="playlist-item" onclick="app.viewPlaylist(${playlist.id})">
                    <i class="fas fa-music"></i>
                    <span>${playlist.name}</span>
                </li>
            `).join('')}
        `;
    }

    loadLyrics() {
        const lyricsContent = document.getElementById('lyricsContent');
        
        if (!player || !player.currentSong) {
            lyricsContent.innerHTML = `
                <div class="lyrics-placeholder">
                    <i class="fas fa-music"></i>
                    <p>No song playing</p>
                </div>
            `;
            return;
        }

        const song = player.currentSong;
        
        if (song.lyrics) {
            lyricsContent.innerHTML = `
                <div class="lyrics-text">
                    <h3>${song.title}</h3>
                    <p class="lyrics-artist">${song.artist}</p>
                    <div class="lyrics-body">
                        ${song.lyrics.split('\n').map(line => `<p>${line}</p>`).join('')}
                    </div>
                </div>
            `;
        } else {
            lyricsContent.innerHTML = `
                <div class="lyrics-placeholder">
                    <i class="fas fa-music"></i>
                    <p>Lyrics not available for this song</p>
                </div>
            `;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Navigation history (simplified)
    goBack() {
        // Implement navigation history
        console.log('Go back');
    }

    goForward() {
        // Implement navigation history
        console.log('Go forward');
    }

    // Data persistence
    saveData() {
        localStorage.setItem('userPlaylists', JSON.stringify(this.userPlaylists));
        localStorage.setItem('likedSongs', JSON.stringify(this.likedSongs));
    }

    // API Configuration Methods
    saveSpotifyConfiguration() {
        const clientId = document.getElementById('spotifyClientId').value.trim();
        const clientSecret = document.getElementById('spotifyClientSecret').value.trim();
        
        if (!clientId || !clientSecret) {
            this.showNotification('Please fill in both Client ID and Client Secret', 'error');
            return;
        }
        
        if (musicAPI) {
            musicAPI.config.spotify.clientId = clientId;
            musicAPI.config.spotify.clientSecret = clientSecret;
            
            // Save to localStorage
            localStorage.setItem('spotify_client_id', clientId);
            localStorage.setItem('spotify_client_secret', clientSecret);
            
            this.showNotification('Spotify configuration saved! You can now connect.', 'success');
            this.hideAPISettingsModal();
            
            // Update connect button
            this.updateAPIStatus();
        }
    }
    
    saveYouTubeConfiguration() {
        const apiKey = document.getElementById('youtubeApiKey').value.trim();
        
        if (!apiKey) {
            this.showNotification('Please enter your YouTube API key', 'error');
            return;
        }
        
        if (musicAPI) {
            musicAPI.config.youtube.apiKey = apiKey;
            
            // Save to localStorage
            localStorage.setItem('youtube_api_key', apiKey);
            
            this.showNotification('YouTube configuration saved!', 'success');
            this.hideAPISettingsModal();
        }
    }
    
    hideAPISettingsModal() {
        const modal = document.getElementById('apiSettingsModal');
        modal.classList.remove('active');
    }
    
    openExternalLink(url) {
        if (url) {
            window.open(url, '_blank');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    
    // Wait for API to be ready, or initialize without it
    const initializeApp = () => {
        app = new MusicApp();
        console.log('Initializing MusicApp  ...');
        console.log('MusicApp initialized:', app);
        
        // Add some loading animations
        document.body.classList.add('fade-in');
        
        // Handle mobile responsiveness
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                document.body.classList.add('mobile');
            } else {
                document.body.classList.remove('mobile');
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
    };
    
    // Check if API is ready, if not wait for it
    if (window.apiReady || typeof musicAPI !== 'undefined') {
        initializeApp();
    } else {
        document.addEventListener('apiReady', initializeApp);
        // Fallback: initialize after 1 second even if API isn't ready
        setTimeout(initializeApp, 1000);
    }
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


