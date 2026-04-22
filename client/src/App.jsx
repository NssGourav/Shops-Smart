import { useEffect, useMemo, useState } from 'react';
import './index.css';
import CartDrawer from './components/CartDrawer';
import FiltersBar from './components/FiltersBar';
import ProductGrid from './components/ProductGrid';
import { useCart } from './context/CartContext';
import demoProducts from './data/demoProducts';

function App() {
  const [status, setStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [catalogMode, setCatalogMode] = useState('live');
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const { totalItems } = useCart();

  useEffect(() => {
    let cancelled = false;
    const apiUrl = import.meta.env.VITE_API_URL || '';

    async function run() {
      try {
        setProductsLoading(true);
        const [healthResponse, productsResponse] = await Promise.all([
          fetch(`${apiUrl}/api/health`),
          fetch(`${apiUrl}/api/products`),
        ]);

        if (!healthResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to load live storefront data');
        }

        const [healthData, productsData] = await Promise.all([
          healthResponse.json(),
          productsResponse.json(),
        ]);

        if (!cancelled) {
          setStatus(healthData.status);
          setProducts(Array.isArray(productsData) ? productsData : []);
          setCatalogMode('live');
        }
      } catch {
        if (!cancelled) {
          setStatus('demo');
          setProducts(demoProducts);
          setCatalogMode('demo');
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
    status === 'ok' ? 'Online' : status === 'demo' ? 'Demo' : 'Checking';
  const backendStatusClass =
    status === 'ok' ? 'status-chip--ok' : 'status-chip--neutral';

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
    if (sort === 'newest') {
      sorted.sort(
        (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
      );
    } else if (sort === 'price-asc') {
      sorted.sort((a, b) => Number(a?.price) - Number(b?.price));
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => Number(b?.price) - Number(a?.price));
    }
    return sorted;
  }, [products, category, query, sort]);

  const showcaseStats = useMemo(() => {
    const categoryCount = Math.max(categories.length - 1, 0);
    const stockedUnits = products.reduce(
      (total, product) => total + Number(product?.stock || 0),
      0
    );
    const inventoryValue = products.reduce(
      (total, product) =>
        total + Number(product?.price || 0) * Number(product?.stock || 0),
      0
    );

    return [
      { label: 'Categories', value: categoryCount },
      { label: 'Units', value: stockedUnits },
      { label: 'Inventory', value: `$${inventoryValue.toFixed(0)}` },
    ];
  }, [categories.length, products]);

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
            <span className="hero-metric-label">Stack</span>
            <span className="hero-metric-value">MERN</span>
          </div>
        </div>
      </main>

      <section className="insights container" aria-label="Store insights">
        <div className="insights-panel">
          <div className="insights-copy">
            <p className="hero-kicker">Submission-ready experience</p>
            <h2 className="insights-title">
              Designed to work as a live product and as a hosted portfolio demo.
            </h2>
            <p className="insights-note">
              When the backend is reachable, the catalog runs fully live. If a
              static host is used, the storefront gracefully falls back to a
              curated demo dataset so the UI still tells a complete story.
            </p>
          </div>

          <div className="insights-grid">
            {showcaseStats.map((item) => (
              <article key={item.label} className="insight-card">
                <span className="insight-label">{item.label}</span>
                <strong className="insight-value">{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="catalog container">
        <div className="catalog-head">
          <div>
            <h2 className="catalog-title">Latest Arrivals</h2>
            <p className="catalog-note">
              Search, filter, and sort products like a showcase grid.
            </p>
          </div>
        </div>

        {catalogMode === 'demo' ? (
          <div className="demo-banner" role="status">
            Demo mode is active. This keeps the hosted frontend showcase working
            even when a backend API is not attached.
          </div>
        ) : null}

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
          error={null}
        />
      </section>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
