# AfyaTrack Setup Instructions

## Google OAuth Setup

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project named "AfyaTrack"

2. **Enable APIs:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Identity Services API" and enable it

3. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in:
     - App name: "AfyaTrack"
     - User support email: your-email@domain.com
     - Developer contact information: your-email@domain.com
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (optional for development)

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost` (for development)
     - `https://yourdomain.com` (for production)
   - Add authorized redirect URIs:
     - `http://localhost` (for development)
     - `https://yourdomain.com` (for production)

5. **Get Client ID:**
   - Copy the generated Client ID
   - Replace `YOUR_GOOGLE_CLIENT_ID_HERE` in `index.html` with your actual Client ID

## File Structure
