// Use environment variable for backend URL, fallback to production deployment
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://anahva-backend-vh3h.vercel.app";

// Log the backend URL being used (helpful for debugging)
if (import.meta.env.DEV) {
    console.log("🔗 Backend URL:", BACKEND_URL);
}
