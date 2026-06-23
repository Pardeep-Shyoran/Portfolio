const DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

export const statsCache = {
  /**
   * Set cache entry in localStorage
   * @param {string} key 
   * @param {any} data 
   */
  set(key, data) {
    try {
      const entry = {
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(`portfolio_stats_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  /**
   * Get valid cache data. Returns null if expired or not found.
   * @param {string} key 
   * @param {number} ttl - custom Time-To-Live in milliseconds
   * @returns {any|null}
   */
  get(key, ttl = DEFAULT_TTL) {
    try {
      const raw = localStorage.getItem(`portfolio_stats_${key}`);
      if (!raw) return null;

      const entry = JSON.parse(raw);
      if (!entry || typeof entry.timestamp !== 'number') return null;

      const age = Date.now() - entry.timestamp;
      if (age > ttl) {
        return null; // Cache expired
      }

      return entry.data;
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
      return null;
    }
  },

  /**
   * Get raw cached data regardless of whether it is expired.
   * Useful for background syncing fallbacks and quick loading.
   * @param {string} key 
   * @returns {any|null}
   */
  getRaw(key) {
    try {
      const raw = localStorage.getItem(`portfolio_stats_${key}`);
      if (!raw) return null;

      const entry = JSON.parse(raw);
      return entry ? entry.data : null;
    } catch (e) {
      console.warn('Failed to read raw localStorage cache:', e);
      return null;
    }
  },

  /**
   * Check if a cache key exists and is valid.
   * @param {string} key 
   * @param {number} ttl 
   * @returns {boolean}
   */
  isValid(key, ttl = DEFAULT_TTL) {
    return this.get(key, ttl) !== null;
  },

  /**
   * Clear cache for a specific key
   * @param {string} key 
   */
  clear(key) {
    try {
      localStorage.removeItem(`portfolio_stats_${key}`);
    } catch (e) {
      console.warn('Failed to clear localStorage key:', e);
    }
  }
};
