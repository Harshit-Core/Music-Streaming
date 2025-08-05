// Music Player Controller
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.currentSong = null;
        this.currentPlaylist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none'; // 'none', 'one', 'all'
        this.volume = 0.8;
        this.isMuted = false;
        this.previousVolume = this.volume;
        
        // Queue management
        this.queue = [];
        this.originalQueue = [];
        
        // Audio context for visualization
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.visualizer = null;
        
        // YouTube Player
        this.youtubePlayer = null;
        this.isYouTubePlayerReady = false;
        this.currentPlayerType = 'audio'; // 'audio' or 'youtube'    
        this.bindEvents();
        this.initializePlayer();
        this.initializeVisualizer();
        this.initializeYouTubePlayer();
    }

    initializePlayer() {
        // Set initial volume
        this.audio.volume = this.volume;
        
        // Load saved preferences
        const savedVolume = localStorage.getItem('player_volume');
        if (savedVolume) {
            this.volume = parseFloat(savedVolume);
            this.audio.volume = this.volume;
        }
        
        const savedRepeat = localStorage.getItem('player_repeat');
        if (savedRepeat) {
            this.repeatMode = savedRepeat;
        }
        
        const savedShuffle = localStorage.getItem('player_shuffle');
        if (savedShuffle) {
            this.isShuffled = savedShuffle === 'true';
        }
        
        this.updateUI();
    }

    bindEvents() {
        // Audio events
        this.audio.addEventListener('loadstart', () => this.onLoadStart());
        this.audio.addEventListener('canplay', () => this.onCanPlay());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
        this.audio.addEventListener('error', (e) => this.onError(e));
        
        // Player control events
        this.bindControlEvents();
        this.bindProgressEvents();
        this.bindVolumeEvents();
    }

    bindControlEvents() {
        // Play/Pause button
        document.getElementById('playBtn').addEventListener('click', () => {
            this.togglePlay();
        });
        
        // Previous button
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.playPrevious();
        });
        
        // Next button
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.playNext();
        });
        
        // Shuffle button
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.toggleShuffle();
        });
        
        // Repeat button
        document.getElementById('repeatBtn').addEventListener('click', () => {
            this.toggleRepeat();
        });
        
        // Like button
        document.getElementById('likeBtn').addEventListener('click', () => {
            this.toggleLike();
        });
    }

    bindProgressEvents() {
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        const progressHandle = document.getElementById('progressHandle');
        
        let isDragging = false;
        
        const handleProgressClick = (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * this.audio.duration;
            
            if (!isNaN(newTime)) {
                this.audio.currentTime = newTime;
                this.updateProgress();
            }
        };
        
        const handleProgressDrag = (e) => {
            if (!isDragging) return;
            handleProgressClick(e);
        };
        
        progressBar.addEventListener('click', handleProgressClick);
        
        progressHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', handleProgressDrag);
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    bindVolumeEvents() {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeFill = document.getElementById('volumeFill');
        const volumeHandle = document.getElementById('volumeHandle');
        const volumeBtn = document.getElementById('volumeBtn');
        
        let isDragging = false;
        
        const handleVolumeClick = (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.setVolume(Math.max(0, Math.min(1, percent)));
        };
        
        const handleVolumeDrag = (e) => {
            if (!isDragging) return;
            handleVolumeClick(e);
        };
        
        volumeSlider.addEventListener('click', handleVolumeClick);
        
        volumeHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', handleVolumeDrag);
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Volume button (mute/unmute)
        volumeBtn.addEventListener('click', () => {
            this.toggleMute();
        });
    }

    async initializeVisualizer() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            // Connect audio element to analyser
            const source = this.audioContext.createMediaElementSource(this.audio);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.visualizer = new AudioVisualizer('visualizer', this.analyser, this.dataArray);
        } catch (error) {
            console.warn('Audio visualization not supported:', error);
        }
    }

    initializeYouTubePlayer() {
        console.log('Initializing YouTube player...');
        
        // Check if YouTube API is already loaded
        if (typeof YT !== 'undefined' && YT.Player) {
            this.createYouTubePlayer();
        } else {
            // YouTube API will call this when ready
            window.onYouTubeIframeAPIReady = () => {
                console.log('YouTube IFrame API Ready');
                this.createYouTubePlayer();
            };
            
            // Fallback: check periodically if API is loaded
            const checkYouTubeAPI = setInterval(() => {
                if (typeof YT !== 'undefined' && YT.Player) {
                    clearInterval(checkYouTubeAPI);
                    if (!this.youtubePlayer) {
                        console.log('YouTube API loaded (fallback)');
                        this.createYouTubePlayer();
                    }
                }
            }, 500);
            
            // Stop checking after 10 seconds
            setTimeout(() => clearInterval(checkYouTubeAPI), 10000);
        }
    }
    
    createYouTubePlayer() {
        try {
            this.youtubePlayer = new YT.Player('youtubePlayer', {
                height: '100%',
                width: '100%',
                playerVars: {
                    'autoplay': 0,
                    'controls': 1,
                    'rel': 0,
                    'showinfo': 0,
                    'modestbranding': 1,
                    'iv_load_policy': 3,
                    'enablejsapi': 1,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': (event) => this.onYouTubePlayerReady(event),
                    'onStateChange': (event) => this.onYouTubePlayerStateChange(event),
                    'onError': (event) => this.onYouTubePlayerError(event)
                }
            });
            console.log('YouTube player created successfully');
        } catch (error) {
            console.error('Failed to create YouTube player:', error);
        }
    }

    onYouTubePlayerReady(event) {
        this.isYouTubePlayerReady = true;
        console.log('YouTube player ready');
    }

    onYouTubePlayerStateChange(event) {
        const state = event.data;
        switch (state) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                this.updatePlayerState();
                this.showEqualizer();
                break;
            case YT.PlayerState.PAUSED:
                this.isPlaying = false;
                this.updatePlayerState();
                this.hideEqualizer();
                break;
            case YT.PlayerState.ENDED:
                this.onEnded();
                break;
        }
    }

    onYouTubePlayerError(event) {
        console.error('YouTube player error:', event.data);
        this.showNotification('YouTube playback error', 'error');
    }

    // Playback Methods
    async playSong(song, playlist = null, index = 0) {
        if (!song) return;
        
        try {
            this.currentSong = song;
            this.currentPlaylist = playlist || [song];
            this.currentIndex = index;
            
            // Update UI immediately
            this.updateSongInfo();
            this.updatePlayerState();
            
            // Stop current playback
            this.stopCurrentPlayback();
            
            // Check if this is a YouTube video
            if (song.source === 'youtube' && song.youtubeId) {
                await this.playYouTubeVideo(song);
            } else {
                await this.playAudioFile(song);
            }
            
            // Update play count and recently played
            song.playCount = (song.playCount || 0) + 1;
            this.addToRecentlyPlayed(song.id);
            
        } catch (error) {
            console.error('Error playing song:', error);
            this.showNotification('Error playing song', 'error');
        }
    }

    stopCurrentPlayback() {
        // Stop audio player
        if (!this.audio.paused) {
            this.audio.pause();
        }
        
        // Stop YouTube player
        if (this.youtubePlayer && this.isYouTubePlayerReady) {
            this.youtubePlayer.pauseVideo();
        }
    }

    async playYouTubeVideo(song) {
        console.log('Playing YouTube video:', song.title, 'ID:', song.youtubeId);
        this.currentPlayerType = 'youtube';
        
        // Show YouTube player container
        const youtubeContainer = document.getElementById('youtubePlayerContainer');
        const artworkImg = document.getElementById('currentArtwork');
        
        if (youtubeContainer && artworkImg) {
            youtubeContainer.style.display = 'block';
            artworkImg.style.display = 'none';
            console.log('YouTube player container shown');
        }
        
        // Load and play YouTube video
        if (this.youtubePlayer && this.isYouTubePlayerReady) {
            console.log('Loading YouTube video with ID:', song.youtubeId);
            this.youtubePlayer.loadVideoById(song.youtubeId);
            setTimeout(() => {
                this.youtubePlayer.playVideo();
                console.log('YouTube video play command sent');
            }, 500);
        } else {
            console.warn('YouTube player not ready. Player:', !!this.youtubePlayer, 'Ready:', this.isYouTubePlayerReady);
            this.showNotification('YouTube player not ready. Please wait and try again.', 'warning');
            
            // Try to initialize if not ready
            if (!this.youtubePlayer) {
                this.initializeYouTubePlayer();
            }
        }
    }

    async playAudioFile(song) {
        console.log('Playing audio file:', song.title, 'URL:', song.audioUrl);
        this.currentPlayerType = 'audio';
        
        // Hide YouTube player container
        const youtubeContainer = document.getElementById('youtubePlayerContainer');
        const artworkImg = document.getElementById('currentArtwork');
        
        if (youtubeContainer && artworkImg) {
            youtubeContainer.style.display = 'none';
            artworkImg.style.display = 'block';
            console.log('Audio player shown, YouTube player hidden');
        }
        
        if (!song.audioUrl || song.audioUrl === '') {
            console.warn('No audio URL available for song:', song.title);
            this.showNotification('No audio available for this track', 'warning');
            return;
        }
        
        try {
            // Load and play audio file
            this.audio.src = song.audioUrl;
            await this.audio.load();
            
            // Resume audio context if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            await this.audio.play();
            console.log('Audio playback started successfully');
        } catch (error) {
            console.error('Error playing audio:', error);
            this.showNotification('Error playing audio file', 'error');
        }
    }

    togglePlay() {
        if (!this.currentSong) {
            // Play first song from trending if no song is selected
            const trending = musicHelpers.getTrendingSongs();
            if (trending.length > 0) {
                this.playSong(trending[0], trending, 0);
            }
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    async play() {
        try {
            if (this.currentPlayerType === 'youtube' && this.youtubePlayer && this.isYouTubePlayerReady) {
                this.youtubePlayer.playVideo();
            } else {
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }
                await this.audio.play();
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            this.showNotification('Playback error', 'error');
        }
    }

    pause() {
        if (this.currentPlayerType === 'youtube' && this.youtubePlayer && this.isYouTubePlayerReady) {
            this.youtubePlayer.pauseVideo();
        } else {
            this.audio.pause();
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.updateProgress();
    }

    playNext() {
        if (this.currentPlaylist.length === 0) return;
        
        let nextIndex;
        
        if (this.isShuffled) {
            // Random next song
            do {
                nextIndex = Math.floor(Math.random() * this.currentPlaylist.length);
            } while (nextIndex === this.currentIndex && this.currentPlaylist.length > 1);
        } else {
            nextIndex = this.currentIndex + 1;
            if (nextIndex >= this.currentPlaylist.length) {
                if (this.repeatMode === 'all') {
                    nextIndex = 0;
                } else {
                    return; // End of playlist
                }
            }
        }
        
        this.playSong(this.currentPlaylist[nextIndex], this.currentPlaylist, nextIndex);
    }

    playPrevious() {
        if (this.currentPlaylist.length === 0) return;
        
        // If more than 3 seconds played, restart current song
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        
        let prevIndex;
        
        if (this.isShuffled) {
            // Random previous song
            do {
                prevIndex = Math.floor(Math.random() * this.currentPlaylist.length);
            } while (prevIndex === this.currentIndex && this.currentPlaylist.length > 1);
        } else {
            prevIndex = this.currentIndex - 1;
            if (prevIndex < 0) {
                if (this.repeatMode === 'all') {
                    prevIndex = this.currentPlaylist.length - 1;
                } else {
                    prevIndex = 0;
                }
            }
        }
        
        this.playSong(this.currentPlaylist[prevIndex], this.currentPlaylist, prevIndex);
    }

    // Control Methods
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        localStorage.setItem('player_shuffle', this.isShuffled.toString());
        this.updateUI();
        this.showNotification(`Shuffle ${this.isShuffled ? 'on' : 'off'}`);
    }

    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        localStorage.setItem('player_repeat', this.repeatMode);
        this.updateUI();
        
        const messages = {
            'none': 'Repeat off',
            'all': 'Repeat all',
            'one': 'Repeat one'
        };
        this.showNotification(messages[this.repeatMode]);
    }

    toggleLike() {
        if (!this.currentSong) return;
        
        const isLiked = musicHelpers.toggleLikeSong(this.currentSong.id);
        this.updateUI();
        this.showNotification(`${isLiked ? 'Added to' : 'Removed from'} liked songs`);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
        this.isMuted = this.volume === 0;
        
        localStorage.setItem('player_volume', this.volume.toString());
        this.updateVolumeUI();
    }

    toggleMute() {
        if (this.isMuted) {
            this.setVolume(this.previousVolume);
        } else {
            this.previousVolume = this.volume;
            this.setVolume(0);
        }
        this.isMuted = !this.isMuted;
    }

    // Event Handlers
    onLoadStart() {
        console.log('Loading started');
    }

    onCanPlay() {
        console.log('Can play');
    }

    onPlay() {
        this.isPlaying = true;
        this.updatePlayerState();
        if (this.visualizer) {
            this.visualizer.start();
        }
    }

    onPause() {
        this.isPlaying = false;
        this.updatePlayerState();
        if (this.visualizer) {
            this.visualizer.stop();
        }
    }

    onEnded() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.play();
        } else {
            this.playNext();
        }
    }

    onTimeUpdate() {
        this.updateProgress();
    }

    onLoadedMetadata() {
        this.updateProgress();
        this.updateTimeDisplays();
    }

    onError(error) {
        console.error('Audio error:', error);
        this.showNotification('Playback error', 'error');
    }

    // UI Update Methods
    updateSongInfo() {
        if (!this.currentSong) return;
        
        const artwork = document.getElementById('currentArtwork');
        const title = document.getElementById('currentTitle');
        const artist = document.getElementById('currentArtist');
        
        artwork.src = this.currentSong.artwork;
        artwork.alt = this.currentSong.title;
        title.textContent = this.currentSong.title;
        artist.textContent = this.currentSong.artist;
        
        // Update page title
        document.title = `${this.currentSong.title} - ${this.currentSong.artist} | SoundWave`;
    }

    updatePlayerState() {
        const playBtn = document.getElementById('playBtn');
        const playIcon = playBtn.querySelector('i');
        const equalizer = document.getElementById('equalizer');
        
        if (this.isPlaying) {
            playIcon.className = 'fas fa-pause';
            equalizer.classList.add('active');
        } else {
            playIcon.className = 'fas fa-play';
            equalizer.classList.remove('active');
        }
    }

    updateProgress() {
        if (!this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        const progressFill = document.getElementById('progressFill');
        
        progressFill.style.width = `${progress}%`;
        this.updateTimeDisplays();
    }

    updateTimeDisplays() {
        const currentTime = document.getElementById('currentTime');
        const totalTime = document.getElementById('totalTime');
        
        currentTime.textContent = this.formatTime(this.audio.currentTime || 0);
        totalTime.textContent = this.formatTime(this.audio.duration || 0);
    }

    updateVolumeUI() {
        const volumeFill = document.getElementById('volumeFill');
        const volumeBtn = document.getElementById('volumeBtn');
        const volumeIcon = volumeBtn.querySelector('i');
        
        volumeFill.style.width = `${this.volume * 100}%`;
        
        // Update volume icon
        if (this.volume === 0 || this.isMuted) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    updateUI() {
        this.updatePlayerState();
        this.updateVolumeUI();
        this.updateControlStates();
    }

    updateControlStates() {
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');
        const likeBtn = document.getElementById('likeBtn');
        
        // Shuffle button
        if (this.isShuffled) {
            shuffleBtn.classList.add('active');
        } else {
            shuffleBtn.classList.remove('active');
        }
        
        // Repeat button
        repeatBtn.classList.remove('active');
        const repeatIcon = repeatBtn.querySelector('i');
        
        switch (this.repeatMode) {
            case 'none':
                repeatIcon.className = 'fas fa-redo';
                break;
            case 'all':
                repeatIcon.className = 'fas fa-redo';
                repeatBtn.classList.add('active');
                break;
            case 'one':
                repeatIcon.className = 'fas fa-redo';
                repeatBtn.classList.add('active');
                // Add a small indicator for repeat one
                break;
        }
        
        // Like button
        if (this.currentSong && this.currentSong.isLiked) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').className = 'fas fa-heart';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('i').className = 'far fa-heart';
        }
    }

    // Utility Methods
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    addToRecentlyPlayed(songId) {
        const recentItem = {
            songId: songId,
            playedAt: new Date().toISOString()
        };
        
        // Remove if already exists
        musicData.recentlyPlayed = musicData.recentlyPlayed.filter(item => item.songId !== songId);
        
        // Add to beginning
        musicData.recentlyPlayed.unshift(recentItem);
        
        // Keep only last 50 items
        musicData.recentlyPlayed = musicData.recentlyPlayed.slice(0, 50);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#e74c3c' : '#1db954',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: '10000',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Queue Management
    addToQueue(song) {
        this.queue.push(song);
        this.showNotification(`Added "${song.title}" to queue`);
        this.updateQueueUI();
    }

    clearQueue() {
        this.queue = [];
        this.updateQueueUI();
    }

    updateQueueUI() {
        const queueList = document.getElementById('queueList');
        if (!queueList) return;
        
        if (this.queue.length === 0) {
            queueList.innerHTML = '<div class="queue-empty">No songs in queue</div>';
            return;
        }
        
        queueList.innerHTML = this.queue.map((song, index) => `
            <div class="queue-song" data-index="${index}">
                <img src="${song.artwork}" alt="${song.title}" class="song-artwork">
                <div class="song-details">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <button class="action-btn" onclick="player.removeFromQueue(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeFromQueue(index) {
        if (index >= 0 && index < this.queue.length) {
            this.queue.splice(index, 1);
            this.updateQueueUI();
        }
    }
}

// Audio Visualizer Class
class AudioVisualizer {
    constructor(canvasId, analyser, dataArray) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.analyser = analyser;
        this.dataArray = dataArray;
        this.animationId = null;
        this.isRunning = false;
        
        this.setupCanvas();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        if (!this.isRunning) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barWidth = this.canvas.width / this.dataArray.length;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = (this.dataArray[i] / 255) * this.canvas.height * 0.5;
            
            const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, this.canvas.height - barHeight);
            gradient.addColorStop(0, '#1db954');
            gradient.addColorStop(1, '#1ed760');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth;
        }
    }
}

// Initialize player when DOM is loaded
let player;
document.addEventListener('DOMContentLoaded', () => {
    player = new MusicPlayer();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!player) return;
    
    // Prevent shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            player.togglePlay();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            player.playPrevious();
            break;
        case 'ArrowRight':
            e.preventDefault();
            player.playNext();
            break;
        case 'ArrowUp':
            e.preventDefault();
            player.setVolume(Math.min(1, player.volume + 0.1));
            break;
        case 'ArrowDown':
            e.preventDefault();
            player.setVolume(Math.max(0, player.volume - 0.1));
            break;
        case 'KeyM':
            e.preventDefault();
            player.toggleMute();
            break;
        case 'KeyS':
            e.preventDefault();
            player.toggleShuffle();
            break;
        case 'KeyR':
            e.preventDefault();
            player.toggleRepeat();
            break;
        case 'KeyL':
            e.preventDefault();
            player.toggleLike();
            break;
    }
});
