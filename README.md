# 🎵 Music Streaming Platform with API Integration

A modern, responsive music streaming platform built with HTML5, CSS3, and vanilla JavaScript. Features integration with Spotify Web API and YouTube Data API for access to millions of songs.

![Music Streaming Platform](https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop)

## ✨ Features

### Core Features
- 🎵 **Music Player**: Full-featured audio player with controls, progress bar, and volume control
- 🎨 **Audio Visualization**: Real-time frequency visualization using Web Audio API
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark/Light Theme**: Toggle between dark and light modes
- 🔍 **Advanced Search**: Search through songs, artists, albums, and playlists
- 📋 **Playlist Management**: Create, edit, and manage custom playlists
- ❤️ **Favorites**: Like and organize your favorite tracks
- ⌨️ **Keyboard Shortcuts**: Control playback with keyboard shortcuts
- 🎛️ **Queue Management**: Add, remove, and reorder tracks in the play queue

### NEW: API Integration
- 🎧 **Spotify Web API**: Access millions of songs, playlists, and user libraries
- 📺 **YouTube Data API**: Search and discover music videos
- 🔄 **Seamless Integration**: Combine local and API results in unified interface
- 🔐 **Secure Authentication**: OAuth2 flow for Spotify integration

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for API functionality) or serve files locally

### Quick Start
1. Clone or download this repository
2. Open `index.html` in your web browser
3. The platform will work with sample data immediately
4. For full functionality, configure API credentials (see below)

### API Setup (Optional but Recommended)

#### Spotify Web API Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in app details:
   - App name: "My Music Platform"
   - App description: "Personal music streaming platform"
   - Website: Your domain or `http://localhost:3000`
   - Redirect URI: Your domain or `http://localhost:3000`
5. Copy your **Client ID** and **Client Secret**
6. In the platform, click the settings gear icon (⚙️) in the top bar
7. Enter your Spotify credentials and click "Save & Connect Spotify"
8. Click "Connect Spotify" in the sidebar to authenticate

#### YouTube Data API Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Go to "Credentials" and create an API key
5. Restrict the API key to YouTube Data API v3 (recommended)
6. In the platform settings, enter your YouTube API key

### Local Development Server
For full API functionality, serve the files through a web server:

```bash
# Using Python 3
python -m http.server 3000

# Using Node.js (with http-server package)
npx http-server -p 3000

# Using PHP
php -S localhost:3000
```

Then open `http://localhost:3000` in your browser.

## 🎹 Keyboard Shortcuts

| Key | Action |
|-----|---------|
| `Space` | Play/Pause |
| `→` | Next track |
| `←` | Previous track |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Mute/Unmute |
| `L` | Toggle lyrics |
| `Q` | Toggle queue |
| `F` | Toggle fullscreen |

## 🔧 API Features

### Spotify Integration
- **Authentication**: Secure OAuth2 login
- **Search**: Find millions of tracks, artists, albums, playlists
- **User Library**: Access your saved music and playlists
- **Playback**: Control Spotify playback (requires Spotify Premium)
- **Recommendations**: Get personalized music suggestions

### YouTube Integration
- **Video Search**: Find music videos by title, artist, or keyword
- **High Quality**: Access high-resolution thumbnails and metadata
- **Direct Links**: Open videos in YouTube for playback

### Combined Search Results
- Local and API results displayed together
- Source indicators (Spotify/YouTube badges)
- External links to original platforms
- Consistent interface across all sources

## 🎨 Customization

### Themes
The platform supports custom themes through CSS custom properties. You can create new themes by modifying the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #1db954;      /* Spotify green */
    --background-color: #121212;   /* Dark background */
    --surface-color: #181818;      /* Card backgrounds */
    --text-primary: #ffffff;       /* Primary text */
    /* ... more variables */
}
```

### Adding Your Music
To add your own music files:

1. Place audio files in a `music/` directory
2. Update the `audioUrl` properties in `data.js`
3. Replace artwork URLs with your own images

Example:
```javascript
{
    id: 9,
    title: "My Song",
    artist: "My Artist",
    audioUrl: "music/my-song.mp3",
    artwork: "images/my-artwork.jpg"
}
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Audio API**: Core audio playback functionality
- **Web Audio API**: Real-time audio analysis and visualization
- **CSS Grid & Flexbox**: Responsive layout system
- **CSS Custom Properties**: Dynamic theming system
- **JavaScript ES6+**: Modern JavaScript features
- **Local Storage**: Persistent user preferences and data
- **Fetch API**: Modern HTTP requests for API integration
- **OAuth2**: Secure authentication with Spotify

### Browser Compatibility
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance Features
- Lazy loading of images and content
- Efficient DOM manipulation
- Optimized audio visualization
- Responsive image serving
- Minimal dependencies (no external libraries)
- API request throttling and caching

## 📂 Project Structure

```
Music Streaming Platform/
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── app.js             # Main application logic
├── player.js          # Music player functionality
├── api.js             # NEW: API integration (Spotify, YouTube)
├── data.js            # Sample music data and helpers
└── README.md          # This file
```

## 🔒 Security & Privacy

### API Security
- Client-side OAuth2 implementation
- No server-side storage of credentials
- Secure token handling and refresh
- API keys stored locally only

### Privacy
- No personal data collection
- All preferences stored locally
- No tracking or analytics
- Transparent API usage

## 🚀 Advanced Usage

### Custom API Endpoints
You can extend the platform with additional music APIs by:

1. Adding new API configurations in `api.js`
2. Implementing search and authentication methods
3. Updating the UI to handle new sources

### Offline Mode
The platform works offline with:
- Local music files
- Cached API responses
- Stored user preferences
- Service worker implementation (planned)

## 🤝 Contributing

This is a personal project, but feel free to:
1. Fork the repository
2. Create feature branches
3. Submit pull requests
4. Report issues or suggest improvements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎵 Credits

### Sample Music
- All sample tracks are placeholder data for demonstration
- Replace with your own music or use API-sourced content

### Images
- Sample artwork from [Unsplash](https://unsplash.com)
- Icons from [Font Awesome](https://fontawesome.com)

### APIs
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

## ❓ Troubleshooting

### Common Issues

**Spotify Connection Failed**
- Check your Client ID and Client Secret
- Verify redirect URI in Spotify app settings
- Ensure you're using HTTPS or localhost

**YouTube Search Not Working**
- Verify your API key is correct
- Check if YouTube Data API v3 is enabled
- Ensure API key restrictions are properly configured

**CORS Errors**
- Serve files through a web server, not file:// protocol
- Use localhost or a proper domain
- Check browser console for specific errors

### Getting Help
1. Check the browser console for error messages
2. Verify API credentials in the settings panel
3. Test with a simple search query first
4. Open an issue on GitHub if problems persist

## 🔮 Future Enhancements

### Planned Features
- [ ] Apple Music API integration
- [ ] SoundCloud API support
- [ ] Last.fm scrobbling
- [ ] Social features (sharing, following)
- [ ] Enhanced audio effects and equalizer
- [ ] Podcast support
- [ ] Voice commands
- [ ] Smart recommendations using machine learning
- [ ] Concert discovery integration
- [ ] Lyrics synchronization

### Technical Improvements
- [ ] Progressive Web App (PWA) features
- [ ] Service worker for offline functionality
- [ ] Better caching strategies
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Testing suite implementation
- [ ] CI/CD pipeline

---

**Enjoy your enhanced music streaming experience! 🎶**

*Now with the power of Spotify and YouTube APIs!*

For questions or support, feel free to open an issue in the repository.
