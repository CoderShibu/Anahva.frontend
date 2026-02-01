# Frontend Troubleshooting Guide

## Black Screen on Chat/Journal Pages - Diagnostic Steps

If you're still seeing black screens, follow these steps to diagnose the issue:

### Step 1: Check Browser Console

1. Open your deployed frontend (e.g., https://anahva-frontend.vercel.app)
2. Login with username `Shibasish` and password `Shibasish`
3. Navigate to the Chat or Journal page
4. Press F12 to open Developer Tools
5. Go to the "Console" tab
6. Look for RED error messages

**Common Errors and Fixes:**

#### Error: "Cannot read properties of undefined (reading 'useContext')"
**Fix:** Context provider is missing. Check that all context providers are in App.tsx

####  Error: "Failed to fetch" or "NetworkError"
**Fix:** Backend URL is incorrect or backend is down
- Check that `VITE_BACKEND_URL` environment variable is set in Vercel
- Verify backend is running: https://anahva-backend-vh3h.vercel.app/

#### Error: Related to "import.meta.env"
**Fix:** Environment variables not loaded
- Add `VITE_BACKEND_URL` in Vercel dashboard under Settings → Environment Variables

#### Blank screen with NO console errors
**Fix:** CSS or rendering issue
- Clear browser cache (Ctrl+F5)
- Try incognito/private browsing mode
- Check if Navigation component is rendering

### Step 2: Check Network Tab

1. In Developer Tools, go to "Network" tab
2. Navigate to Chat or Journal page
3. Look for failed requests (red status codes)

**If you see 404 or 500 errors:**
- The Vercel deployment might have failed
- Check Vercel dashboard for build errors

**If you see CORS errors:**
- Backend CORS is blocking the request
- Should not happen as backend allows all origins

### Step 3: Verify Vercel Deployment

1. Go to https://vercel.com/dashboard
2. Find your `Anahva.frontend` project
3. Check latest deployment status
4. Click on the deployment to see build logs

**If build failed:**
- Check the error logs in Vercel
- May need to fix TypeScript or ESLint issues
- Try redeploying from Vercel dashboard

### Step 4: Test Direct URLs

Try accessing the pages directly:
- `https://your-frontend.vercel.app/chat`
- `https://your-frontend.vercel.app/journal`

**If you get redirected to login:**
- Authentication is working correctly
- Login and try again

**If you get a 404:**
- Vercel routing might not be configured
- Need to add a `vercel.json` with rewrites

### Step 5: Check if Backend is Accessible

Open a new tab and go to:
```
https://anahva-backend-vh3h.vercel.app/
```

You should see: "Anahva backend is running"

**If you see an error:**
- Backend deployment failed
- Check Vercel logs for backend project

### Step 6: Try Local Testing

To test if it's a Vercel issue vs a code issue:

1. Clone the frontend repo locally:
   ```powershell
   cd d:\Anahata
   cd frontend-repo
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_BACKEND_URL=https://anahva-backend-vh3h.vercel.app
   ```

4. Run dev server:
   ```powershell
   npm run dev
   ```

5. Open browser to `http://localhost:5173`
6. Login and test Chat/Journal pages

**If it works locally but not on Vercel:**
- Vercel build issue
- Environment variable not set
- Check Vercel build logs

**If it doesn't work locally either:**
- Code issue that needs fixing
- Send me the console error messages

## What to Report Back

If still having issues, please provide:

1. **Exact frontend URL** you're accessing (e.g., https://abc123.vercel.app)
2. **Any error messages** from browser console (screenshot or copy-paste)
3. **Network tab errors** (any red/failed requests)
4. **Vercel deployment status** (did the latest build succeed?)
5. **What you see** on the page (completely black? navigation visible? etc.)

This will help me pinpoint the exact issue!
