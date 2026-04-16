import { useState, useEffect } from 'react';
import './index.css';
import ProductGrid from './components/ProductGrid';
import { useCart } from './context/CartContext';

function App() {
  const [status, setStatus] = useState(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('offline'));
  }, []);

  const backendStatusLabel =
    status === 'ok' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking';
  const backendStatusClass =
    status === 'ok'
      ? 'status-chip--ok'
      : status === 'offline'
        ? 'status-chip--bad'
        : 'status-chip--neutral';

  return (
    <div className="app-wrapper">
      <nav className="navbar container">
        <a href="/" className="brand-logo">
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
          <a href="#" className="nav-link">
            New Arrivals
          </a>
          <a href="#" className="nav-link">
            Collections
          </a>
          <a href="#" className="nav-link">
            Cart ({totalItems})
          </a>
        </div>
      </nav>

      <main className="hero">
        <h1 className="hero-title">Redefining Elegance</h1>
        <p className="hero-subtitle">
          Discover our premium collection of modern fashion, crafted with
          uncompromising quality and minimalist aesthetics.
        </p>
        <button className="btn-primary">Shop the Collection</button>
      </main>

      <ProductGrid />
    </div>
  );
}

export default App;
