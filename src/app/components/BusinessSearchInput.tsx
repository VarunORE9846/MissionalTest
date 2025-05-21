import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAppDispatch } from '../../redux/store';
import { setBusinessProfile } from '../../redux/slices/businessSlice';

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
  const dispatch = useAppDispatch();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const apiKey = process.env.GOOGLE_API_KEY;

  const fetchSuggestions = async (input: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/google-business-search?q=${encodeURIComponent(input)}`);
      if (res.status === 200) {
        setSuggestions(res?.data?.predictions || []);
      } else {
        setError('Failed to fetch suggestions');
      }
    } catch (err) {
      setError('Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSuggestions([]);
    if (debounceRef?.current) clearTimeout(debounceRef?.current);
    if (value.trim().length === 0) return;
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 400);
  };

  const handleSelect = (suggestion: Suggestion) => {
    dispatch(setBusinessProfile({
      place_id: suggestion?.place_id,
      name: suggestion?.name,
      address: suggestion?.formatted_address,
      icon: suggestion?.icon,
    }));
    setQuery(suggestion?.name || '');
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type business name"
        value={query}
        onChange={handleInputChange}
        autoComplete="off"
      />
      {loading && <div className="absolute right-3 top-3 text-xs text-gray-400">Loading...</div>}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s?.place_id}
              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              <div className="flex items-center gap-2">
                {s?.icon && <img src={s.icon} alt="icon" className="w-5 h-5" />}
                <span className="font-medium">{s?.name}</span>
              </div>
              <div className="text-xs text-gray-500">{s?.formatted_address}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BusinessSearchInput; 