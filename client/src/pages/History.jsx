import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Calendar, Award, Download, ChevronLeft, ChevronRight, Inbox, FileText } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useCarbon from '../hooks/useCarbon';
import { formatCarbonValue, formatDate } from '../utils/formatters';
import { getGradeMeta } from '../utils/grading';
import { generateCarbonReport } from '../utils/generatePDF';
import SkeletonLoader from '../components/SkeletonLoader';

export const History = () => {
  const { user } = useAuth();
  const { entries, loading, pagination, fetchHistory, deleteRecord } = useCarbon();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const preferredUnit = user?.settings?.units || 'kg';

  useEffect(() => {
    fetchHistory(currentPage, 8);
  }, [fetchHistory, currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this calculation record?')) {
      setDeletingId(id);
      const res = await deleteRecord(id);
      if (res.success) {
        if (entries.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchHistory(currentPage, 8);
        }
      }
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = (entry) => {
    generateCarbonReport(entry, user?.name || 'You');
  };

  // Helper to get scope values, gracefully handling legacy records
  const getScopeValue = (entry, scopeKey) => {
    if (entry.breakdown && entry.breakdown[scopeKey] !== undefined) {
      return entry.breakdown[scopeKey];
    }
    return null; // Legacy record
  };

  const hasRecords = entries && entries.length > 0;

  if (loading && !hasRecords) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SkeletonLoader type="history" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 space-y-8 animate-[slideIn_0.3s_ease-out]">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pl-1">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="text-emerald-500" size={26} /> Calculation History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Review past carbon footprint calculations. Download PDF reports or remove outdated entries.
          </p>
        </div>
        {hasRecords && (
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500">
            {pagination.totalRecords || entries.length} total record{(pagination.totalRecords || entries.length) !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Main Records section */}
      {hasRecords ? (
        <div className="space-y-6">
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Report Title</th>
                  <th className="px-5 py-4 text-center">Scope 1</th>
                  <th className="px-5 py-4 text-center">Scope 2</th>
                  <th className="px-5 py-4 text-center">Scope 3</th>
                  <th className="px-5 py-4 text-right">Total</th>
                  <th className="px-5 py-4 text-center">Grade</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {entries.map((entry) => {
                  const meta = getGradeMeta(entry.grade);
                  const s1 = getScopeValue(entry, 'scope1');
                  const s2 = getScopeValue(entry, 'scope2');
                  const s3 = getScopeValue(entry, 'scope3');

                  return (
                    <tr key={entry._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300">
                          <Calendar size={13} className="opacity-50" />
                          {formatDate(entry.date)}
                        </div>
                      </td>
                      {/* Report Title */}
                      <td className="px-5 py-4 text-slate-800 dark:text-slate-200 font-bold max-w-[160px] truncate">
                        {entry.reportTitle || 'Untitled Report'}
                      </td>
                      {/* Scope 1 */}
                      <td className="px-5 py-4 text-center">
                        {s1 !== null ? (
                          <span className="text-[11px] bg-[#1e3a5f]/10 text-[#1e3a5f] dark:bg-blue-900/20 dark:text-blue-400 px-2 py-0.5 rounded-md font-bold">
                            {s1.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">N/A</span>
                        )}
                      </td>
                      {/* Scope 2 */}
                      <td className="px-5 py-4 text-center">
                        {s2 !== null ? (
                          <span className="text-[11px] bg-[#0d9488]/10 text-[#0d9488] dark:bg-teal-900/20 dark:text-teal-400 px-2 py-0.5 rounded-md font-bold">
                            {s2.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">N/A</span>
                        )}
                      </td>
                      {/* Scope 3 */}
                      <td className="px-5 py-4 text-center">
                        {s3 !== null ? (
                          <span className="text-[11px] bg-[#d97706]/10 text-[#d97706] dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold">
                            {s3.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">N/A</span>
                        )}
                      </td>
                      {/* Total */}
                      <td className="px-5 py-4 text-right font-black text-slate-900 dark:text-white">
                        {formatCarbonValue(entry.totalKg, preferredUnit, true)}
                      </td>
                      {/* Grade */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${meta.bgColor} ${meta.borderColor} ${meta.color}`}>
                          {entry.grade}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDownloadPDF(entry)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            disabled={deletingId === entry._id}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                            title="Delete entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Shown on mobile) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {entries.map((entry) => {
              const meta = getGradeMeta(entry.grade);
              const s1 = getScopeValue(entry, 'scope1');
              const s2 = getScopeValue(entry, 'scope2');
              const s3 = getScopeValue(entry, 'scope3');

              return (
                <div key={entry._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  {/* Top row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {entry.reportTitle || 'Untitled Report'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                        <Calendar size={12} />
                        {formatDate(entry.date)}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleDownloadPDF(entry)}
                        className="p-1.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-lg"
                      >
                        <Download size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        disabled={deletingId === entry._id}
                        className="p-1.5 bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 rounded-lg"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Grade + Total */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${meta.bgColor} ${meta.borderColor} ${meta.color}`}>
                      {entry.grade} • {meta.label}
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {formatCarbonValue(entry.totalKg, preferredUnit, true)}
                    </span>
                  </div>

                  {/* Scope Breakdown */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#1e3a5f]/5 dark:bg-blue-900/10 rounded-lg py-2 px-1">
                      <div className="text-[9px] font-bold text-[#1e3a5f] dark:text-blue-400 uppercase">Scope 1</div>
                      <div className="text-xs font-black text-slate-800 dark:text-white mt-0.5">
                        {s1 !== null ? `${s1.toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                    <div className="bg-[#0d9488]/5 dark:bg-teal-900/10 rounded-lg py-2 px-1">
                      <div className="text-[9px] font-bold text-[#0d9488] dark:text-teal-400 uppercase">Scope 2</div>
                      <div className="text-xs font-black text-slate-800 dark:text-white mt-0.5">
                        {s2 !== null ? `${s2.toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                    <div className="bg-[#d97706]/5 dark:bg-amber-900/10 rounded-lg py-2 px-1">
                      <div className="text-[9px] font-bold text-[#d97706] dark:text-amber-400 uppercase">Scope 3</div>
                      <div className="text-xs font-black text-slate-800 dark:text-white mt-0.5">
                        {s3 !== null ? `${s3.toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Page <span className="text-slate-900 dark:text-white font-extrabold">{currentPage}</span> of {pagination.totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages || loading}
                className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Empty History state */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-5 shadow-sm">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <Inbox size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              No History Logs Yet
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs mx-auto font-semibold">
              You haven't saved any calculations yet. Run the calculator and save your results to start tracking your carbon footprint over time.
            </p>
          </div>
          <Link
            to="/calculate"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shadow-emerald-500/10"
          >
            Run Calculation
          </Link>
        </div>
      )}

    </div>
  );
};

export default History;
