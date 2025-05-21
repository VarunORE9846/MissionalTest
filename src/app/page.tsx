'use client';
import BusinessSearchInput from './components/BusinessSearchInput';
import BusinessProfileCard from './components/BusinessProfileCard';
import { useAppSelector } from '../redux/store';
import { useState } from 'react';

export default function Home() {
  const selected = useAppSelector((state) => state.business.selected);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center w-full max-w-lg gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-indigo-100 rounded-full p-4 mb-2">
            {/* You can replace this with a Google/Map icon in public */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#6366F1" />
              <path d="M20 10a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="#fff" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center">Find your Google Church Name</h1>
        </div>
        {!selected && (
          <>
            <BusinessSearchInput />
            <div className="w-full flex flex-col items-center mt-4">
              <div className="flex items-center w-full gap-2 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button className="w-full border border-gray-300 rounded px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <span className="text-indigo-700 font-semibold">Use my website instead</span>
              </button>
            </div>
          </>
        )}
        {selected && !confirmed && (
          <BusinessProfileCard onConfirm={() => setConfirmed(true)} />
        )}
        {confirmed && (
          <div className="text-center text-green-600 font-semibold mt-8">Business profile confirmed! (Continue your flow here...)</div>
        )}
      </div>
    </div>
  );
}
