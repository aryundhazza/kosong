import React from 'react';

interface SelectDropdownProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  selectedValue: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  onChange,
  selectedValue,
}) => {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border border-gray-300 rounded-lg"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDropdown;
