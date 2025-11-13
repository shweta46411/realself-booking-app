import '@testing-library/jest-dom/vitest';
import { beforeAll } from 'vitest';
import { URL, URLSearchParams } from 'url';

// Ensure URL and URLSearchParams are available in jsdom
beforeAll(() => {
  if (typeof globalThis.URL === 'undefined') {
    globalThis.URL = URL as typeof globalThis.URL;
    globalThis.URLSearchParams = URLSearchParams as typeof globalThis.URLSearchParams;
  }
});
