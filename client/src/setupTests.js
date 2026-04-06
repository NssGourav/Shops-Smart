import '@testing-library/jest-dom';

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: {
    clear: () => {},
    getItem: () => null,
    removeItem: () => {},
    setItem: () => {},
  },
});
