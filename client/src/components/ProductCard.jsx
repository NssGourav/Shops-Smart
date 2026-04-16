import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const priceNumber = Number(product?.price);
  const formattedPrice = Number.isFinite(priceNumber)
    ? priceNumber.toFixed(2)
    : null;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="product-image"
        />
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">
          {product.category?.name || 'Category'}
        </p>
        <p className="product-price">
          {formattedPrice ? `$${formattedPrice}` : 'Price N/A'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
