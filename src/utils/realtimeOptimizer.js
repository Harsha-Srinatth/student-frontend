/**
 * Optimize real-time updates to prevent performance issues
 * Debounce and batch updates to reduce re-renders
 */

let updateQueue = new Map();
let updateTimer = null;
const DEBOUNCE_DELAY = 100; // 100ms debounce

/**
 * Debounced update function
 * Batches multiple rapid updates into a single update
 */
export const debouncedUpdate = (key, updateFn, delay = DEBOUNCE_DELAY) => {
  // Clear existing timer for this key
  if (updateQueue.has(key)) {
    clearTimeout(updateQueue.get(key).timer);
  }

  // Store the update function
  updateQueue.set(key, {
    updateFn,
    timer: setTimeout(() => {
      updateFn();
      updateQueue.delete(key);
    }, delay),
  });
};

/**
 * Clear all pending updates
 */
export const clearUpdateQueue = () => {
  updateQueue.forEach(({ timer }) => clearTimeout(timer));
  updateQueue.clear();
};

/**
 * Check if a value has actually changed
 * Prevents unnecessary updates
 */
export const hasChanged = (oldValue, newValue) => {
  if (oldValue === newValue) return false;
  if (typeof oldValue !== typeof newValue) return true;
  
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length !== newValue.length) return true;
    // Deep comparison for arrays (simplified)
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  }
  
  if (typeof oldValue === 'object' && typeof newValue === 'object') {
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  }
  
  return true;
};

/**
 * Merge updates intelligently
 * Only update changed fields
 */
export const smartMerge = (existing, incoming) => {
  if (!incoming || Object.keys(incoming).length === 0) {
    return existing;
  }

  const merged = { ...existing };
  
  Object.keys(incoming).forEach((key) => {
    const newValue = incoming[key];
    
    // Skip null/undefined values unless they're explicitly clearing data
    if (newValue === null || newValue === undefined) {
      return;
    }
    
    // Only update if value actually changed
    if (hasChanged(merged[key], newValue)) {
      if (Array.isArray(newValue)) {
        merged[key] = newValue;
      } else if (typeof newValue === 'object') {
        merged[key] = { ...merged[key], ...newValue };
      } else {
        merged[key] = newValue;
      }
    }
  });

  return merged;
};

