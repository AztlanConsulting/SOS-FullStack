import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getManualById,
  getManuals,
} from '@features/manuals/services/manual.service';

describe('manual.service', () => {
  beforeEach(() => {
    // Use a deterministic base URL for endpoint assertions.
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_BASE_URL', 'http://api.test');
  });

  afterEach(() => {
    // Restore global fetch and environment to avoid cross-test contamination.
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('getManuals returns parsed payload when request succeeds', async () => {
    const payload = { manuals: [{ _id: '1' }], total: 1 };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => payload,
    } as Response);

    const result = await getManuals();

    // Verify endpoint and payload mapping.
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/manuals/getManuals',
    );
    expect(result).toEqual(payload);
  });

  it('getManuals throws when response is not ok', async () => {
    // Non-2xx responses should throw service-level errors.
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(getManuals()).rejects.toThrow('Failed to fetch manuals');
  });

  it('getManualById calls endpoint with id and returns payload', async () => {
    const payload = { manual: { _id: 'm-10', name: 'Manual 10' } };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => payload,
    } as Response);

    const result = await getManualById('m-10');

    // The manual id must be interpolated in the final URL.
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/manuals/getManualById/m-10',
    );
    expect(result).toEqual(payload);
  });

  it('getManualById throws when response is not ok', async () => {
    // Ensure explicit error path for failed id lookups.
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(getManualById('missing')).rejects.toThrow(
      'Failed to fetch a manual by id',
    );
  });
});
