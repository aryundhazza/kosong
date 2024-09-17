import React from 'react';
import { FormikProps } from 'formik';
import { ErrorMsg } from './errorMessage';

interface Option {
  value: string;
  label: string;
}

interface FieldSelectProps {
  name: string;
  label?: string;
  formik: FormikProps<any>;
  options: Option[];
  className?: string;
}

const FieldSelect: React.FC<FieldSelectProps> = ({
  name,
  label,
  formik,
  options,
  className,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorMsg formik={formik} name={name} />
    </div>
  );
};

export default FieldSelect;
