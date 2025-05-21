import React from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { clearBusinessProfile } from '../../redux/slices/businessSlice';

const BusinessProfileCard: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
  const business = useAppSelector((state) => state.business.selected);
  const dispatch = useAppDispatch();

  if (!business) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center gap-2 mt-4">
      {business.icon && (
        <img src={business.icon} alt="icon" className="w-12 h-12 rounded-full mb-2" />
      )}
      <div className="font-bold text-lg text-center">{business.name}</div>
      <div className="text-gray-600 text-center text-sm">{business.address}</div>
      <div className="flex gap-2 mt-4 w-full">
        <button
          className="flex-1 bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition"
          onClick={onConfirm}
        >
          Yes, let's guide
        </button>
        <button
          className="flex-1 bg-gray-200 text-gray-700 rounded px-4 py-2 hover:bg-gray-300 transition"
          onClick={() => dispatch(clearBusinessProfile())}
        >
          Search again
        </button>
      </div>
    </div>
  );
};

export default BusinessProfileCard; 