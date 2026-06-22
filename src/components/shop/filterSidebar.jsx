import PriceSlider from "./priceSlider";
import BrandFilter from "./brandFilter";

function FilterSidebar(props) {

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">

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