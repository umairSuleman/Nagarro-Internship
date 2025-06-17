import { Select } from "../form/Select";
import { FilterGroup } from "../form/FilterGroup";

interface SearchFiltersProps {
  orderBy: "relevant" | "latest";
  onOrderByChange: (orderBy: "relevant" | "latest") => void;
  orientation: "" | "landscape" | "portrait" | "squarish";
  onOrientationChange: (orientation:"" | "landscape" | "portrait" | "squarish" ) => void;
  color: string;
  onColorChange: (color: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  orderBy,
  onOrderByChange,
  orientation,
  onOrientationChange,
  color,
  onColorChange
}) => {
  const orderByOptions = [
    { value: 'relevant', label: 'Relevant' },
    { value: 'latest', label: 'Latest' }
  ];
  
  const orientationOptions = [
    { value: '', label: 'Any' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'squarish', label: 'Squarish' }
  ];
  
  const colorOptions = [
    { value: '', label: 'Any' },
    { value: 'black_and_white', label: 'Black & White' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'purple', label: 'Purple' },
    { value: 'magenta', label: 'Magenta' },
    { value: 'green', label: 'Green' },
    { value: 'teal', label: 'Teal' },
    { value: 'blue', label: 'Blue' }
  ];
  
  return (
    <FilterGroup>
      <Select
        label="Sort by"
        value={orderBy}
        onChange={(value) => {
          if(value === "relevant" || value === "latest"){
              onOrderByChange(value);
          }
        }}
        options={orderByOptions}
      />
      
      <Select
        label="Orientation"
        value={orientation}
        onChange={(value) => {
          if(value === "" || value === "landscape" || value ==="portrait" || value ==="squarish"){
              onOrientationChange(value);
          }
        }}
        options={orientationOptions}
      />
      
      <Select
        label="Color"
        value={color}
        onChange={onColorChange}
        options={colorOptions}
      />
    </FilterGroup>
  );
};