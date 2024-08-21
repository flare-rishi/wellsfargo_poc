// src/middleware/cacheMiddleware.js
const cacheMiddleware = (store) => {
  let cache = {}; // Object to hold cached data

  const cleanupCache = () => {
    const currentTime = new Date().getTime();

    // Iterate over cache keys and delete expired entries
    Object.keys(cache).forEach((cacheKey) => {
      const cachedData = cache[cacheKey];
      if (currentTime - cachedData.timestamp >= cachedData.maxAge) {
        delete cache[cacheKey];
      }
    });
  };

  // Periodically clean up expired cache entries (every minute, for example)
  setInterval(cleanupCache, 60000); // Adjust interval as per your application's needs (e.g., every minute)

  return (next) => (action) => {
    if (action.type.endsWith("/pending")) {
      const cacheKey = action.meta.arg; // Use the argument passed to the thunk as the cache key
      const cachedData = cache[cacheKey];

      if (cachedData) {
        const currentTime = new Date().getTime();

        // Check if cached data is within maxAge
        if (currentTime - cachedData.timestamp < cachedData.maxAge) {
          setTimeout(() => {
            store.dispatch({
              type: action.type.replace("/pending", "/fulfilled"),
              payload: cachedData.data,
            });
          }, 0); // Dispatch asynchronously
          return;
        } else {
          // Delete expired cache entry
          delete cache[cacheKey];
        }
      }
    }

    // Call next middleware or thunk in the chain
    const result = next(action);

    if (action.type.endsWith("/fulfilled") && action.meta && action.meta.arg) {
      const cacheKey = action.meta.arg; // Use the argument passed to the thunk as the cache key
      const maxAge = action.payload.maxAge || 300000; // Default maxAge is 5 minutes (300000 milliseconds)

      // Store fetched data in cache with timestamp and maxAge
      const dataToCache = {
        data: store.getState().data.data,
        timestamp: new Date().getTime(),
        maxAge: maxAge,
      };
      cache[cacheKey] = dataToCache;
    }

    return result;
  };
};

export default cacheMiddleware;
