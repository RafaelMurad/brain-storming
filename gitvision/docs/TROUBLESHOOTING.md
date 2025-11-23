# Troubleshooting Guide

Solutions to common issues when running GitVision.

## Authentication Issues

### "Failed to fetch repositories"

**Symptoms:**
- Dashboard shows error message
- Repositories don't load

**Causes & Solutions:**

1. **Invalid or expired access token**
   ```
   Solution: Sign out and sign in again
   ```

2. **Missing OAuth scopes**
   ```
   Solution: Check your GitHub OAuth app has the `repo` scope
   Go to: GitHub → Settings → Applications → GitVision → Check scopes
   ```

3. **Token not passed correctly**
   ```
   Solution: Clear browser cookies and localStorage, then sign in again
   ```

---

### "NEXTAUTH_SECRET is not set"

**Symptoms:**
- App crashes on startup
- Authentication doesn't work

**Solution:**
```bash
# Generate a secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=your-generated-secret-here
```

---

### OAuth Callback Error

**Symptoms:**
- Error after clicking "Authorize" on GitHub
- Redirect fails

**Causes & Solutions:**

1. **Mismatched callback URL**
   ```
   Solution: Ensure your GitHub OAuth app callback URL is exactly:
   http://localhost:3000/api/auth/callback/github
   ```

2. **Wrong environment**
   ```
   Solution: Make sure NEXTAUTH_URL matches your actual URL:
   - Development: http://localhost:3000
   - Production: https://your-domain.com
   ```

3. **Port conflict**
   ```
   Solution: If port 3000 is in use, either:
   - Kill the process using port 3000
   - Or update NEXTAUTH_URL and OAuth callback to use a different port
   ```

---

### "Client ID or Secret is invalid"

**Symptoms:**
- OAuth flow fails immediately

**Solution:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click on your GitVision app
3. Verify Client ID matches `GITHUB_CLIENT_ID` in `.env.local`
4. Generate a new Client Secret if needed
5. Update `GITHUB_CLIENT_SECRET` in `.env.local`
6. Restart the development server

---

## UI Issues

### Canvas Not Rendering

**Symptoms:**
- Canvas page shows blank area
- Nodes don't appear

**Causes & Solutions:**

1. **Container height issue**
   ```tsx
   // React Flow requires explicit height
   // Ensure parent has: h-screen, h-full, or specific height
   ```

2. **Data not loaded**
   ```
   Solution: Check browser console for API errors
   Verify repositories are being fetched
   ```

3. **Browser compatibility**
   ```
   Solution: Try a different browser (Chrome, Firefox, Edge)
   React Flow works best in modern browsers
   ```

---

### Hydration Errors

**Symptoms:**
- Console shows "Hydration failed" or "Text content mismatch"
- UI looks broken initially

**Causes & Solutions:**

1. **Server/client mismatch**
   ```tsx
   // Add "use client" to components using:
   // - useState, useEffect
   // - Browser APIs (window, document)
   // - Event handlers
   "use client";
   ```

2. **Date formatting differences**
   ```tsx
   // Use suppressHydrationWarning for dates
   <time suppressHydrationWarning>
     {formatDate(date)}
   </time>
   ```

3. **Theme flash**
   ```tsx
   // Already handled in layout with:
   <html suppressHydrationWarning>
   ```

---

### Dark Mode Not Working

**Symptoms:**
- Theme toggle doesn't change colors
- Always stuck in light/dark mode

**Solution:**
1. Check `next-themes` is installed: `npm list next-themes`
2. Verify `ThemeProvider` wraps the app in `src/components/providers.tsx`
3. Check Tailwind config has `darkMode: ["class"]`
4. Clear localStorage and refresh

---

### Styles Not Loading

**Symptoms:**
- Page appears unstyled
- Tailwind classes don't work

**Solutions:**

1. **PostCSS not configured**
   ```js
   // postcss.config.js should contain:
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

2. **Tailwind content paths wrong**
   ```ts
   // tailwind.config.ts should include:
   content: [
     "./src/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   ```

3. **CSS not imported**
   ```tsx
   // src/app/layout.tsx should have:
   import "./globals.css";
   ```

---

## Build Issues

### TypeScript Errors

**Symptoms:**
- `npm run build` fails
- Red squiggly lines in IDE

**Common Fixes:**

1. **Type not found**
   ```bash
   npm run typecheck  # See all errors
   ```

2. **Module not found**
   ```bash
   # Check import paths use @/ alias
   import { Button } from "@/components/ui/button";
   ```

3. **Strict mode issues**
   ```tsx
   // Handle null/undefined properly
   const value = data?.property ?? "default";
   ```

---

### ESLint Errors

**Symptoms:**
- `npm run lint` shows errors
- Build fails due to lint errors

**Solutions:**

1. **Missing ESLint config**
   ```json
   // .eslintrc.json
   {
     "extends": "next/core-web-vitals"
   }
   ```

2. **Unused variables**
   ```tsx
   // Prefix with underscore for intentionally unused
   const [_unused, setUsed] = useState();
   ```

3. **Missing dependencies in useEffect**
   ```tsx
   // Add all dependencies or use eslint-disable comment
   useEffect(() => {
     fetchData();
   }, [fetchData]); // Include all deps
   ```

---

### "Module not found" Errors

**Symptoms:**
- Build fails with import errors

**Solutions:**

1. **Missing package**
   ```bash
   npm install <package-name>
   ```

2. **Wrong import path**
   ```tsx
   // Use @ alias for src imports
   import { Button } from "@/components/ui/button";
   // Not: import { Button } from "../../components/ui/button";
   ```

3. **Case sensitivity**
   ```tsx
   // File: Button.tsx
   // Wrong: import { Button } from "./button";
   // Right: import { Button } from "./Button";
   ```

---

## Performance Issues

### Slow Initial Load

**Solutions:**

1. **Reduce initial data fetch**
   ```tsx
   // Limit repositories fetched initially
   const repos = await octokit.repos.listForAuthenticatedUser({
     per_page: 30,  // Start with fewer
     sort: "updated",
   });
   ```

2. **Add loading states**
   ```tsx
   if (isLoading) {
     return <Skeleton />;  // Show placeholder
   }
   ```

3. **Use React Suspense**
   ```tsx
   <Suspense fallback={<Loading />}>
     <Component />
   </Suspense>
   ```

---

### Canvas Lag with Many Nodes

**Solutions:**

1. **Enable node optimization**
   ```tsx
   <ReactFlow
     nodesDraggable={true}
     nodesConnectable={false}  // Disable if not needed
     nodesFocusable={false}    // Disable if not needed
   >
   ```

2. **Virtualize large lists**
   ```tsx
   // Only render visible nodes
   // React Flow handles this automatically for most cases
   ```

3. **Reduce edge complexity**
   ```tsx
   // Use simple edge types
   type: "straight"  // Instead of "smoothstep"
   ```

---

## API Issues

### Rate Limiting

**Symptoms:**
- API calls fail after many requests
- 403 errors from GitHub

**Solutions:**

1. **Check rate limit status**
   ```bash
   curl -H "Authorization: Bearer <token>" \
     https://api.github.com/rate_limit
   ```

2. **Implement caching**
   ```tsx
   // Cache responses in Zustand store
   // Only refetch when needed
   ```

3. **Batch requests**
   ```tsx
   // Fetch multiple items per request
   per_page: 100  // Max allowed
   ```

---

### CORS Errors

**Symptoms:**
- Console shows CORS errors
- API calls blocked

**Note:** This shouldn't happen with GitVision since API calls go through Next.js API routes. If you see CORS errors:

1. Check you're calling `/api/...` routes, not GitHub directly
2. Verify API routes exist in `src/app/api/`

---

## Getting Help

### Debug Mode

Add to `.env.local` for more logging:
```env
DEBUG=next-auth:*
```

### Check Browser Console

1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

### Verify Environment

```bash
# Check Node version
node --version  # Should be 18+

# Check npm version
npm --version  # Should be 9+

# Check dependencies
npm list
```

### Reset Everything

```bash
# Nuclear option - reset all local state
rm -rf node_modules .next
rm package-lock.json
npm install
npm run dev
```

Also clear browser:
1. Clear cookies for localhost
2. Clear localStorage
3. Hard refresh (Ctrl+Shift+R)
