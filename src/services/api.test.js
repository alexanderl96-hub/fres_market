import { describe, it, expect, vi } from 'vitest';
import { apiRequest } from './api';

// Network calls are stubbed so tests never reach a real server.
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve('') })));

// tw:generated apiRequest
describe('apiRequest', () => {
  it('resolves with sample input', async () => {
    await apiRequest('test', undefined);
  });
});
