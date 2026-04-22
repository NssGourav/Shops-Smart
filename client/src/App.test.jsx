import { render, screen } from '@testing-library/react';
import App from './App';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartProvider } from './context/CartContext';

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the storefront branding', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => {
        if (String(url).includes('/api/health')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                status: 'ok',
                message: 'Test Msg',
                timestamp: 'now',
              }),
            ok: true,
          });
        }

        return Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true,
        });
      })
    );

    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    expect(
      await screen.findByRole('link', {
        name: /Shop\s*Smart/i,
      })
    ).toBeInTheDocument();
    expect(await screen.findByText(/Redefining Elegance/i)).toBeInTheDocument();
    expect(await screen.findByText(/Latest Arrivals/i)).toBeInTheDocument();
  });

  it('falls back to demo mode when the API is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('offline')))
    );

    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    expect(await screen.findByText(/Demo mode is active/i)).toBeInTheDocument();
    expect(await screen.findByText(/Monolith Chair/i)).toBeInTheDocument();
  });
});
