import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getOrCreateUserId } from '../userInfo';

describe('getOrCreateUserId', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns stored userId when present', () => {
    localStorage.setItem('userId', 'stored-id');
    const id = getOrCreateUserId();
    expect(id).toBe('stored-id');
  });

  it('generates and stores new userId when not present', () => {
    const spy = vi
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue('new-id');
    const id = getOrCreateUserId();
    expect(spy).toHaveBeenCalled();
    expect(id).toBe('new-id');
    expect(localStorage.getItem('userId')).toBe('new-id');
  });
});
