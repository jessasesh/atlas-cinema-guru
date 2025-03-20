"use client";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const baseButtonClasses =
    "px-5 py-3 w-28 text-darkBlue bg-teal transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-darkBlue-300";

  return (
    <nav
      className="flex items-center justify-center gap-2 my-5 py-5"
      aria-label="Pagination Navigation"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClasses} rounded-l-full ${
          currentPage === 1 ? "opacity-10 cursor-not-allowed" : "hover:opacity-50"
        }`}
        aria-label="Go to previous page"
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : 0}
        style={{ backgroundColor: "#1ED2AF", color: "#001F3F" }}
      >
        Previous
      </button>

      <span className="px-4 py-3 text-white font-semibold" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${baseButtonClasses} rounded-r-full ${
          currentPage >= totalPages ? "opacity-10 cursor-not-allowed" : "hover:opacity-50"
        }`}
        aria-label="Go to next page"
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : 0}
        style={{ backgroundColor: "#1ED2AF", color: "#001F3F" }}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;