import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch } from '../../redux/store';
import { setBusinessProfile } from '../../redux/slices/businessSlice';
import { useDebounce } from '../../hooks/useDebounce';

interface Suggestion {
  place_id: string;
  name: string;
  formatted_address: string;
  icon?: string;
}

const BusinessSearchInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`/api/google-business-search?q=${encodeURIComponent(debouncedQuery)}`);
        setSuggestions(response.data.predictions || []);
      } catch (err) {
        setError('Failed to fetch suggestions. Please try again.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (suggestion: Suggestion) => {
    dispatch(setBusinessProfile({
      place_id: suggestion.place_id,
      name: suggestion.name,
      address: suggestion.formatted_address,
      icon: suggestion.icon,
    }));
    setQuery(suggestion.name);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          placeholder="Search for a business..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="Business search"
          aria-expanded={suggestions.length > 0}
          aria-controls="business-suggestions"
          role="combobox"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2" role="alert">
          {error}
        </div>
      )}

      {isFocused && suggestions.length > 0 && (
        <ul
          id="business-suggestions"
          className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleSelect(suggestion)}
              role="option"
              aria-selected="false"
            >
              <div className="flex items-center gap-3">
                {suggestion.icon && (
                  <img
                    src={suggestion.icon}
                    alt=""
                    className="w-5 h-5 object-contain"
                    aria-hidden="true"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{suggestion.name}</span>
                  <span className="text-sm text-gray-500">{suggestion.formatted_address}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BusinessSearchInput; 