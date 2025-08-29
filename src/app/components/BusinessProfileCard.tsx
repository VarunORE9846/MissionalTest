import React from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { clearBusinessProfile } from '../../redux/slices/businessSlice';
import { setGeneratedPrompt } from '../../redux/slices/vapiSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const BusinessProfileCard: React.FC = () => {
  const business = useAppSelector((state) => state.business.selected);
  const dispatch = useAppDispatch();
  const router = useRouter();
  if (!business) return null;

  const handleGuideMe = async () => {
    try {
      // Generate prompt
      const response = await axios.post('/api/generate-prompt', {
        businessData: business,
        guideMarryData: {}, // Add guideMarryData if needed
      });
      dispatch(setGeneratedPrompt(response.data.prompt));

      // Generate and download knowledge base PDF
      const pdfResponse = await axios.post(
        '/api/generate-knowledge-base',
        {
          businessData: business,
          guideMarryData: {}, // Add guideMarryData if needed
        },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([pdfResponse.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'knowledge-base.pdf');
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);

      // Navigate to assistant-create
      router.push('/assistant-create');
    } catch (error) {
      console.error('Failed to generate prompt or download PDF:', error);
      console.log('Error:', error);
      alert('Failed to generate prompt or download PDF. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mt-6">
      {business.icon && (
        <div className="relative w-16 h-16 mx-auto mb-4">
          <Image
            src={business.icon}
            alt="Business icon"
            fill
            className="rounded-full shadow"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <h2 className="text-xl font-semibold text-center text-gray-800">{business.name}</h2>

      {business.address && (
        <p className="text-center text-sm text-gray-500 mt-1">{business.address}</p>
      )}

      {business.website && (
        <p className="text-center text-sm text-blue-600 mt-2 break-words">
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {business.website}
          </a>
        </p>
      )}  

      {business.phone && (
        <p className="text-center text-sm text-gray-700 mt-1">📞 {business.phone}</p>
      )}

      {business.overview && (
        <p className="text-center text-sm text-gray-600 italic mt-2">{business.overview}</p>
      )}

      {business.business_status && (
        <p className="text-center text-xs text-gray-400 mt-1">Status: {business.business_status}</p>
      )}

      {business.types && business.types.length > 0 && (
        <p className="text-center text-xs text-gray-500 mt-1">
          <span className="font-medium text-gray-600">Types:</span> {business.types.join(', ')}
        </p>
      )}

      {business.url && (
        <p className="text-center text-sm mt-2">
          <a
            href={business.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline text-xs"
          >
            🌍 View on Google Maps
          </a>
        </p>
      )}

      {business.service_times && business.service_times.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-indigo-700 mb-1">🕒 Service Times:</h3>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {business.service_times.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          className="flex-1 bg-indigo-600 text-white font-medium rounded-lg py-2 hover:bg-indigo-700 transition-all duration-200"
          onClick={handleGuideMe}
        >
          ✅ Yes, guide me
        </button>
        <button
          className="flex-1 bg-gray-100 text-gray-700 font-medium rounded-lg py-2 hover:bg-gray-200 transition-all duration-200"
          onClick={() => dispatch(clearBusinessProfile())}
        >
          🔍 Search again
        </button>
      </div>
    </div>
  );
};

export default BusinessProfileCard; 