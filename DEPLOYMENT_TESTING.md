# Testing Location Features on Deployment

The location-based studio matching feature requires HTTPS to work properly. Since you prefer to test on deployment rather than setting up local HTTPS, here's how to deploy and test the location features:

## Quick Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your project directory
vercel

# Follow the prompts and deploy
# Your app will be available at: https://your-app.vercel.app
```

### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy the 'out' or '.next' folder to Netlify
# Or connect your GitHub repository to Netlify for automatic deployments
```

### Option 3: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

## Testing Location Features

Once deployed to any HTTPS URL:

1. **Visit your deployed app** (e.g., `https://your-app.vercel.app`)
2. **Click "Find Studio"** in the header
3. **Allow location access** when prompted by your browser
4. **Test the location matching** functionality

## What to Test

### ✅ Location Detection
- Click "Find Studio" button
- Browser should prompt for location permission
- Allow location access

### ✅ Studio Matching
- If you have studios within 500m: Should show matched studio name in header
- If no studios nearby: Should show "No Studio Found" message
- Should display distance to matched studio

### ✅ Visual Feedback
- Green pin icon when studio is matched
- Loading spinner during detection
- Toast notifications for success/error states

### ✅ User Controls
- "Clear" button to remove match
- "Find Studio" button to retry detection
- Permission request modal with clear instructions

## Studio Setup for Testing

To test the location matching, you'll need studio profiles with coordinates:

1. **Go to Studio Profile page** (admin only)
2. **Add studio profiles** with Google Maps URLs
3. **Ensure coordinates are extracted** (latitude/longitude fields populated)
4. **Test location matching** from different locations

## Expected Behavior

- **Within 500m of studio**: Header shows studio name, success toast
- **No studios nearby**: "No Studio Found" info toast
- **Permission denied**: Error toast with retry option
- **Location unavailable**: Appropriate error message

## Privacy & Security

The location features are designed with privacy in mind:
- Location data is processed locally (client-side only)
- No location data is stored on servers
- Users can clear matches anytime
- Permission can be revoked at any time

## Troubleshooting

### "Location access denied"
- Check browser location permissions
- Try refreshing the page
- Ensure you're on HTTPS

### "No studios found"
- Add studio profiles with valid coordinates
- Check if you're within 500m of a studio
- Verify coordinates are properly extracted from Google Maps URLs

### "Geolocation not supported"
- Ensure you're using a modern browser
- Check if location services are enabled on your device
