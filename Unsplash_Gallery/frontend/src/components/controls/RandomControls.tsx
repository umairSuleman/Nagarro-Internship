import React from "react";
import { Shuffle } from "lucide-react";
import { FormCard } from "../form/FormCard";
import { FilterGroup } from "../form/FilterGroup";
import { Select } from "../form/Select";
import { Button } from "../buttons/Button";

interface RandomControlsProps {
    count: number;
    onCountChange :(count: number) => void;
    orientation: "" | "landscape" | "portrait" | "squarish";
    onOrientationChange: (orientation:"" | "landscape" | "portrait" | "squarish" ) => void;
    onGenerate: () => void;
    loading?: boolean;
}

export const RandomControls: React.FC<RandomControlsProps> = ({
  count,
  onCountChange,
  orientation,
  onOrientationChange,
  onGenerate,
  loading = false
}) => {
  const countOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => ({
    value: num.toString(),
    label: num.toString()
  }));
  
  const orientationOptions = [
    { value: '', label: 'Any' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'squarish', label: 'Squarish' }
  ];
  
  return (
    <FormCard>
      <FilterGroup>
        <Select
          label="Count"
          value={count.toString()}
          onChange={(value) => onCountChange(Number(value))}
          options={countOptions}
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
        
        <Button
          onClick={onGenerate}
          disabled={loading}
          variant="success"
          icon={Shuffle}
          loading={loading}
        >
          {loading ? 'Generating...' : 'Generate Random'}
        </Button>
      </FilterGroup>
    </FormCard>
  );
};