function BrandFilter({
  brands,
  selectedBrand,
  setSelectedBrand,
}) {
  return (
    <div>

      <h3 className="font-semibold mb-3">
        Brands
      </h3>

      {brands.map((brand) => (
        <label
          key={brand}
          className="flex gap-2 mb-2"
        >
          <input
            type="radio"
            checked={
              selectedBrand === brand
            }
            onChange={() =>
              setSelectedBrand(brand)
            }
          />

          {brand}
        </label>
      ))}

    </div>
  );
}

export default BrandFilter;