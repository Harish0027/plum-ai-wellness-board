"use client";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            currentPage === i + 1
              ? "bg-purple-500 text-white"
              : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/80"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
