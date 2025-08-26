# CORS Configuration for Exposr Backend

## Environment Variables

Add this to your backend environment variables in Vercel:

```
ALLOWED_ORIGINS=https://exposrmvp-8eqrmknxw-oshaea30s-projects.vercel.app,https://exposrmvp-nbdjaz9zs-oshaea30s-projects.vercel.app
```

## How It Works

The new CORS implementation:

1. **Reads `ALLOWED_ORIGINS` from environment variables**
2. **Splits into an array** (comma-separated)
3. **For each request**: Checks if the `Origin` header is in the allowlist
4. **If allowed**: Sets `Access-Control-Allow-Origin` to that exact origin (single value only)
5. **Always includes standard CORS headers**:
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`
   - `Access-Control-Allow-Credentials`
   - `Access-Control-Max-Age`
6. **Handles OPTIONS preflight** for `/api/*` routes by returning `204`

## Security Benefits

- ✅ **No wildcard origins** - only specific allowed origins
- ✅ **Echoes single origin** - prevents multiple origin attacks
- ✅ **Proper preflight handling** - supports complex requests
- ✅ **Standard CORS headers** - ensures compatibility

## Example Usage

```bash
# Single origin
ALLOWED_ORIGINS=https://exposrmvp-8eqrmknxw-oshaea30s-projects.vercel.app

# Multiple origins (comma-separated)
ALLOWED_ORIGINS=https://exposrmvp-8eqrmknxw-oshaea30s-projects.vercel.app,https://exposrmvp-nbdjaz9zs-oshaea30s-projects.vercel.app

# Include localhost for development
ALLOWED_ORIGINS=http://localhost:3000,https://exposrmvp-8eqrmknxw-oshaea30s-projects.vercel.app
```
