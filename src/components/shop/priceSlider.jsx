function PriceSlider({
  
  maxPrice,
  setMaxPrice,
}) {

  return (
    <div>

      <h3 className="font-semibold mb-3">
        Price
      </h3>

      <input
        type="range"
        min="0"
        max="10000"
        value={maxPrice}
        onChange={(e) =>
          setMaxPrice(
            Number(e.target.value)
          )
        }
        className="w-full"
      />

      <p className="mt-2 text-sm">
        ₹0 - ₹{maxPrice}
      </p>

    </div>
  );
}

export default PriceSlider;
