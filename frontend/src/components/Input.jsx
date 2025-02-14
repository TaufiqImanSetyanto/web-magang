/* eslint-disable react/prop-types */
export default function Input({ label, name, value, onChange, type, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={name}
          name={name}
          type={type}
          required
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
        />
      </div>
    </div>
  );
}
