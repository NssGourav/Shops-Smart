import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
import { CartProvider } from './context/CartContext';

describe('App', () => {
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
});
