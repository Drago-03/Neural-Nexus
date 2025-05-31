/**
 * Simple polyfill for Node.js timers/promises module
 * This provides the minimum functionality needed for MongoDB in the browser
 */

// Create a basic implementation of setTimeout as a promise
function setTimeout(delay, value) {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve(value);
    }, delay);
  });
}

// Create a basic implementation of setImmediate as a promise
function setImmediate(value) {
  return new Promise(resolve => {
    // Use setTimeout with 0ms delay as a browser-compatible alternative to setImmediate
    window.setTimeout(() => {
      resolve(value);
    }, 0);
  });
}

module.exports = {
  setTimeout,
  setImmediate
}; 