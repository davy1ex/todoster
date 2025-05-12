import { getPlatform } from './lib/platform';

// Import platform-specific entrypoints
const platform = getPlatform();

// Dynamic import of platform-specific entrypoint
import(`./entrypoints/${platform}.tsx`).catch((err) => {
    console.error(`Failed to load ${platform} entrypoint:`, err);
    // Fallback to web entrypoint if platform-specific load fails
    import('./entrypoints/web.tsx').catch((err) => {
        console.error('Failed to load web entrypoint:', err);
    });
});
