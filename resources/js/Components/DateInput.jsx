import React from 'react';

const DateInput = ({ label, ...props }) => (
  <div className="mt-4">
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="date"
      className="mt-1 block w-full"
      {...props}
    />
  </div>
);

export default DateInput;
