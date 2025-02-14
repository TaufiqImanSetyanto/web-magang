/* eslint-disable react/prop-types */
export default function Information({ first, second }) {
  return (
    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <div className="text-sm/6 font-medium text-gray-900">{first}</div>
      <div className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{second}</div>
    </div>
  );
}
