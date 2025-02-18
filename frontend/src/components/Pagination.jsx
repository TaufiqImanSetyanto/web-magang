/* eslint-disable react/prop-types */
export default function Pagination({ indexOfFirstData, indexOfLastData, totalData, totalPages, currentPage, nextPage, prevPage }) {
  return (
    <div className="flex justify-between items-center my-3 sm:mx">
      <p className="text-sm text-gray-600">
        Showing {indexOfFirstData + 1} to {Math.min(indexOfLastData, totalData)} of {totalData} results
      </p>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1} className={`px-3 py-1 mr-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}>
          Previous
        </button>
        <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}>
          Next
        </button>
      </div>
    </div>
  );
}
