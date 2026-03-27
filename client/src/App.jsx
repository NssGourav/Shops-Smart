import { useState, useEffect } from 'react'
import './index.css'

function App() {
    const [status, setStatus] = useState(null)

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        fetch(`${apiUrl}/api/health`)
            .then(res => res.json())
            .then(data => setStatus(data.status))
            .catch(() => setStatus('offline'))
    }, [])

    return (
        <div className="app-wrapper">
            <nav className="navbar container">
                <a href="/" className="brand-logo">Luxe<span>Spirit</span></a>
                <div className="nav-links">
                    <a href="#" className="nav-link">New Arrivals</a>
                    <a href="#" className="nav-link">Collections</a>
                    <a href="#" className="nav-link">Cart (0)</a>
                </div>
            </nav>

            <main className="hero">
                <h1 className="hero-title">Redefining Elegance</h1>
                <p className="hero-subtitle">
                    Discover our premium collection of modern fashion, crafted with uncompromising quality and minimalist aesthetics.
                </p>
                <button className="btn-primary">Shop the Collection</button>
            </main>

            {/* Hidden debug info for the backend status if needed, or just console */}
            {status !== 'ok' && (
                <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', opacity: 0.5, fontSize: '0.8rem' }}>
                    Backend: {status || 'checking...'}
                </div>
            )}
        </div>
    )
}

export default App
