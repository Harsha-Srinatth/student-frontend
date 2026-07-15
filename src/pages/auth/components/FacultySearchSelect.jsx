import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, CheckCircle2, X } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import api from '../../../services/api';

/**
 * Search faculty by name or ID within a college (public /faculty/search).
 * value: { facultyid, fullname, dept? } | null
 */
export default function FacultySearchSelect({
  collegeId,
  disabled = false,
  value,
  onChange,
  className = '',
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    setSelected(value);
    if (value) setQuery(`${value.fullname}`);
    else setQuery('');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!selected) setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selected]);

  const searchFaculty = async (searchQuery) => {
    if (searchQuery.length < 2 || !collegeId) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/faculty/search', {
        params: { query: searchQuery, collegeId },
      });
      const list = response.data?.data;
      setResults(Array.isArray(list) ? list : []);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to search faculty', 'error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (disabled || !collegeId) return;
    const timer = setTimeout(() => {
      const selectedLabel = value ? `${value.fullname}` : '';
      if (query !== selectedLabel) {
        searchFaculty(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, collegeId, disabled, value]);

  const handleSelect = (faculty) => {
    setSelected(faculty);
    setQuery(`${faculty.fullname}`);
    setIsOpen(false);
    onChange(faculty);
    inputRef.current?.blur();
  };

  const clearSelection = (e) => {
    e?.stopPropagation();
    setSelected(null);
    setQuery('');
    setResults([]);
    onChange(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const blocked = disabled || !collegeId;

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`} ref={wrapperRef}>
      <label className="text-[13.5px] font-semibold text-slate-700">
        Faculty mentor <span className="font-normal text-slate-400">(optional)</span>
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selected) {
              setSelected(null);
              onChange(null);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (!blocked && query.length >= 2 && !selected) searchFaculty(query);
          }}
          placeholder={
            blocked
              ? !collegeId
                ? 'Select a college first'
                : 'Unavailable'
              : 'Search by faculty name or ID…'
          }
          autoComplete="off"
          disabled={blocked}
          className={`w-full pl-9 pr-9 py-2.5 bg-white border rounded-lg text-[14.5px] text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
            ${blocked ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'border-slate-200 focus:border-emerald-500 hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/10'}
          `}
        />

        <div className="absolute left-3 top-[10px] text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        {selected ? (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-2.5 top-[10px] text-emerald-600 hover:bg-emerald-50 rounded-full p-0.5 transition-colors"
            aria-label="Clear mentor"
          >
            <CheckCircle2 className="w-[18px] h-[18px]" />
          </button>
        ) : loading ? (
          <div className="absolute right-3 top-[10px] text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          query &&
          !blocked && (
            <button
              type="button"
              onClick={clearSelection}
              className="absolute right-3 top-[10px] text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {isOpen && !blocked && results.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 max-h-64 overflow-y-auto py-2"
        >
          {results.map((f, index) => (
            <button
              key={f.facultyid || f._id}
              type="button"
              onClick={() => handleSelect(f)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 flex flex-col gap-1 transition-colors
                ${activeIndex === index ? 'bg-emerald-50/80' : 'hover:bg-slate-50'}
              `}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[14.5px] font-medium ${activeIndex === index ? 'text-emerald-700' : 'text-slate-900'}`}
                >
                  {f.fullname}
                </span>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                  {f.facultyid}
                </span>
              </div>
              <div className="text-[12.5px] text-slate-500 line-clamp-1">
                {[f.dept, f.designation].filter(Boolean).join(' · ') || '\u00A0'}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && !blocked && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 p-6 text-center">
          <p className="text-[14.5px] text-slate-600 font-medium">No faculty found</p>
          <p className="text-[13px] text-slate-400 mt-1">Try another name or ID in this college</p>
        </div>
      )}
    </div>
  );
}
