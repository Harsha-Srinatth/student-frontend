import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../../contexts/ToastContext';

export default function CollegeSearchSelect({ value, onChange, error, className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    setSelectedCollege(value);
    if (value) setQuery(`${value.collegeName}`);
    else setQuery('');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!selectedCollege) setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCollege]);

  const searchColleges = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/colleges/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (err) {
      addToast('Failed to fetch colleges', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== (selectedCollege ? `${selectedCollege.collegeName}` : '')) {
        searchColleges(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (college) => {
    setSelectedCollege(college);
    setQuery(`${college.collegeName}`);
    setIsOpen(false);
    onChange(college);
    inputRef.current?.blur();
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setSelectedCollege(null);
    setQuery('');
    setResults([]);
    onChange(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
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
      const activeElement = listRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`} ref={wrapperRef}>
      <label className="text-[13.5px] font-semibold text-slate-700">
        College / Institution
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedCollege) {
              setSelectedCollege(null);
              onChange(null);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 2 && !selectedCollege) searchColleges(query);
          }}
          placeholder="Search by college name or ID..."
          autoComplete="off"
          className={`w-full pl-9 pr-9 py-2.5 bg-white border rounded-lg text-[14.5px] text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-emerald-500 hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/10'
            }
          `}
        />
        
        <div className="absolute left-3 top-[10px] text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        {selectedCollege ? (
          <button 
            type="button"
            onClick={clearSelection}
            className="absolute right-2.5 top-[10px] text-emerald-600 hover:bg-emerald-50 rounded-full p-0.5 transition-colors"
          >
            <CheckCircle2 className="w-[18px] h-[18px]" />
          </button>
        ) : loading ? (
          <div className="absolute right-3 top-[10px] text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : query && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 top-[10px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div 
          ref={listRef}
          className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 max-h-64 overflow-y-auto py-2"
        >
          {results.map((college, index) => (
            <button
              key={college._id}
              type="button"
              onClick={() => handleSelect(college)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 flex flex-col gap-1 transition-colors
                ${activeIndex === index ? 'bg-emerald-50/80' : 'hover:bg-slate-50'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[14.5px] font-medium ${activeIndex === index ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {college.collegeName}
                </span>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {college.collegeId}
                </span>
              </div>
              <div className="text-[12.5px] text-slate-500 flex items-center gap-1.5 line-clamp-1">
                {college.location}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 p-6 text-center">
          <p className="text-[14.5px] text-slate-600 font-medium">No colleges found</p>
          <p className="text-[13px] text-slate-400 mt-1">Try searching with a different name</p>
        </div>
      )}
    </div>
  );
}
