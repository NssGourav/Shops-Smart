import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

function formatMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0.00';
  return number.toFixed(2);
}

export default function CartDrawer({ open, onClose }) {
  const {
    cart,
    cartTotal,
    totalItems,
    clearCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <div className={`drawer-root ${open ? 'drawer-root--open' : ''}`}>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="drawer-header">
          <div>
            <p className="drawer-kicker">Your Cart</p>
            <h3 className="drawer-title">{totalItems} items</h3>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <p className="drawer-empty-title">Cart is empty</p>
              <p className="drawer-empty-subtitle">
                Add items from the catalog to see them here.
              </p>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    className="cart-item-img"
                    src={item.imageUrl || 'https://via.placeholder.com/120'}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="cart-item-main">
                    <div className="cart-item-top">
                      <div>
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-meta">
                          {item.category?.name || 'Category'}
                        </p>
                      </div>
                      <p className="cart-item-price">
                        ${formatMoney(item.price)}
                      </p>
                    </div>

                    <div className="cart-item-actions">
                      <div className="qty">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-value" aria-label="Quantity">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="link-danger"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="drawer-footer">
          <div className="drawer-totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <strong>${formatMoney(cartTotal)}</strong>
            </div>
            <p className="totals-note">
              Taxes and shipping calculated at checkout.
            </p>
          </div>

          <div className="drawer-cta">
            <button
              type="button"
              className="btn-secondary btn-secondary--danger"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Clear cart
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
