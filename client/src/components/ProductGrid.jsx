import ProductCard from './ProductCard';

function ProductGridSkeleton() {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-img" />
          <div className="skeleton-line skeleton-line--lg" />
          <div className="skeleton-line" />
        </div>
      ))}
    </div>
  );
}

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <ProductGridSkeleton />;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!products || products.length === 0)
    return <div className="empty-state">No products match your filters.</div>;

  return (
    <div className="product-grid" aria-label="Product results">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
