import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

interface Visitor {
  id: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  location: string;
  visitedAt: string;
  pageViews: number;
}

interface VisitorsTableProps {
  visitors: Visitor[];
  selectedVisitors: Set<string>;
  onSelectVisitor: (id: string) => void;
  onSelectAll: () => void;
  onDeleteVisitors: (ids: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const VisitorsTable: React.FC<VisitorsTableProps> = React.memo(({
  visitors,
  selectedVisitors,
  onSelectVisitor,
  onSelectAll,
  onDeleteVisitors,
  searchQuery,
  onSearchChange,
  currentPage,
  itemsPerPage,
  onPageChange
}) => {
  const filteredVisitors = useMemo(() => {
    if (!searchQuery) return visitors;
    
    const query = searchQuery.toLowerCase();
    return visitors.filter(visitor =>
      visitor.ipAddress.toLowerCase().includes(query) ||
      visitor.location.toLowerCase().includes(query) ||
      visitor.referrer.toLowerCase().includes(query)
    );
  }, [visitors, searchQuery]);

  const paginatedVisitors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVisitors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVisitors, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  const handleBulkDelete = useCallback(() => {
    if (selectedVisitors.size > 0) {
      onDeleteVisitors(Array.from(selectedVisitors));
    }
  }, [selectedVisitors, onDeleteVisitors]);

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Visitors</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search visitors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {selectedVisitors.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
                Delete ({selectedVisitors.size})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedVisitors.size === visitors.length && visitors.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visited At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedVisitors.map((visitor, index) => (
              <motion.tr
                key={visitor.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedVisitors.has(visitor.id)}
                    onChange={() => onSelectVisitor(visitor.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {visitor.ipAddress}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {visitor.location}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {visitor.referrer || 'Direct'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {visitor.pageViews}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(visitor.visitedAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredVisitors.length)} of{' '}
              {filteredVisitors.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VisitorsTable;