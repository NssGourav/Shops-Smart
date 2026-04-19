import { useEffect, useMemo, useState } from 'react';
import './index.css';
import CartDrawer from './components/CartDrawer';
import FiltersBar from './components/FiltersBar';
import ProductGrid from './components/ProductGrid';
import { useCart } from './context/CartContext';

function App() {
  const [status, setStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const { totalItems } = useCart();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('offline'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const apiUrl = import.meta.env.VITE_API_URL || '';

    async function run() {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const response = await fetch(`${apiUrl}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) {
          setProductsError(
            error instanceof Error ? error.message : 'Failed to fetch products'
          );
          setProducts([]);
        }
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const backendStatusLabel =
    status === 'ok' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking';
  const backendStatusClass =
    status === 'ok'
      ? 'status-chip--ok'
      : status === 'offline'
        ? 'status-chip--bad'
        : 'status-chip--neutral';

  const categories = useMemo(() => {
    const unique = new Set();
    for (const product of products) {
      const name = product?.category?.name;
      if (typeof name === 'string' && name.trim()) unique.add(name.trim());
    }
    return ['All', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let next = products;

    if (category !== 'All') {
      next = next.filter((p) => p?.category?.name === category);
    }

    if (normalizedQuery) {
      next = next.filter((p) => {
        const name = String(p?.name || '').toLowerCase();
        const cat = String(p?.category?.name || '').toLowerCase();
        return name.includes(normalizedQuery) || cat.includes(normalizedQuery);
      });
    }

    const sorted = [...next];
    if (sort === 'price-asc') {
      sorted.sort((a, b) => Number(a?.price) - Number(b?.price));
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => Number(b?.price) - Number(a?.price));
    }
    return sorted;
  }, [products, category, query, sort]);

  return (
    <div className="app-wrapper">
      <div className="bg-orbit" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="navbar container">
        <a href="/" className="brand-logo" aria-label="ShopSmart Home">
          Shop<span>Smart</span>
        </a>

        <div className="nav-links">
          <span
            className={`status-chip ${backendStatusClass}`}
            aria-label={`Backend status: ${backendStatusLabel}`}
            title={`Backend status: ${backendStatusLabel}`}
          >
            Backend: {backendStatusLabel}
          </span>

          <button
            type="button"
            className="cart-pill"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart (${totalItems} items)`}
          >
            Cart <span className="cart-count">{totalItems}</span>
          </button>
        </div>
      </header>

      <main className="hero container">
        <div className="hero-copy">
          <p className="hero-kicker">Portfolio-style storefront</p>
          <h1 className="hero-title">Redefining Elegance</h1>
          <p className="hero-subtitle">
            A sharp, editorial catalog with motion-first micro-interactions.
            Built like a portfolio, used like a shop.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#catalog">
              Browse Catalog
            </a>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCartOpen(true)}
            >
              Open Cart
            </button>
          </div>
        </div>

        <div className="hero-panel" aria-hidden="true">
          <div className="hero-metric">
            <span className="hero-metric-label">Drops</span>
            <span className="hero-metric-value">{products.length}</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric-label">Mood</span>
            <span className="hero-metric-value">Minimal</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric-label">Theme</span>
            <span className="hero-metric-value">Noir</span>
          </div>
        </div>
      </main>

      <section id="catalog" className="catalog container">
        <div className="catalog-head">
          <div>
            <h2 className="catalog-title">Latest Arrivals</h2>
            <p className="catalog-note">
              Search, filter, and sort products like a showcase grid.
            </p>
          </div>
        </div>

        <FiltersBar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />

        <ProductGrid
          products={filteredProducts}
          loading={productsLoading}
          error={productsError}
        />
      </section>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
