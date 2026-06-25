import PriceSlider from "./priceSlider";
import BrandFilter from "./brandFilter";

function FilterSidebar(props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">

      <div className="mb-6">
        <h3 className="font-semibold mb-3">
          Categories
        </h3>

        <select
          value={props.selectedCategory}
          onChange={(e) =>
            props.setSelectedCategory(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-2"
        >
          <option value="">
            All Categories
          </option>

          {props.categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <PriceSlider
        maxPrice={props.maxPrice}
        setMaxPrice={props.setMaxPrice}
      />

      <div className="my-6" />

      <BrandFilter
        brands={props.brands}
        selectedBrand={props.selectedBrand}
        setSelectedBrand={
          props.setSelectedBrand
        }
      />

    </div>
  );
}

export default FilterSidebar;