export default function FiltersBar({
  categories,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="filters">
      <label className="search">
        <span className="sr-only">Search products</span>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search products or categories…"
        />
      </label>

      <div className="pill-row" role="tablist" aria-label="Categories">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={`pill ${name === category ? 'pill--active' : ''}`}
            onClick={() => onCategoryChange(name)}
            role="tab"
            aria-selected={name === category}
          >
            {name}
          </button>
        ))}
      </div>

      <label className="sort">
        <span className="sr-only">Sort products</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </label>
    </div>
  );
}
