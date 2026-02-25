/**
 * Resolves an image URL to an absolute path.
 * Uses the VITE_API_URL env variable instead of hardcoded localhost.
 */
export function getImageUrl(imageUrl: string | undefined | null): string | null {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    // Strip trailing /api if present so we get the root domain
    const rootUrl = baseUrl.replace(/\/api\/?$/, '');
    return `${rootUrl}${imageUrl}`;
}
