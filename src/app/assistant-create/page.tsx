"use client"
import React, { useEffect } from 'react';
import { useAppSelector } from '@/redux/store';
import KnowledgeBaseUpload from '../components/KnowledgeBaseUpload';
import VapiAssistantForm from '../components/VapiAssistantForm';
import VapiWebCall from '../components/VapiWebCall';

const AssistantCreate = () => {
  const selectedBusiness = useAppSelector((state) => state.business.selected);
  const assistant = useAppSelector((state) => state.vapi.assistant);

  // Update form when business is selected
  useEffect(() => {
    if (selectedBusiness) {
      // 1. Generate overview if missing
      let overview = selectedBusiness.overview || '';
      if (!overview) {
        const types = selectedBusiness.types ? selectedBusiness.types.join(', ') : '';
        overview = `${selectedBusiness.name} is a${types ? ' ' : ''}${types} located at ${selectedBusiness.address}. Status: ${selectedBusiness.business_status || 'N/A'}.${selectedBusiness.website ? ' Website: ' + selectedBusiness.website + '.' : ''}`;
      }

      // 2. Normalize service times for all days
      const weekDays = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ];
      const googleServiceTimes: string[] = selectedBusiness.service_times || [];
      // Map: { Monday: '8:00 AM – 4:00 PM', ... }
      const serviceTimeMap: Record<string, string> = {};
      googleServiceTimes.forEach((entry) => {
        const [day, hours] = entry.split(': ');
        serviceTimeMap[day] = hours;
      });
      weekDays.forEach((day) => {
        const hours = serviceTimeMap[day];
        if (!hours || hours.toLowerCase().includes('closed')) {
          return;
        }
        // e.g. '8:00 AM – 4:00 PM' or '8:00 AM – 12:30 PM'
        const [startRaw, endRaw] = hours.split(' – ');
        // Convert to 24h format for input type="time"
        const to24h = (t: string) => {
          if (!t) return '';
          const match = t.match(/\d{1,2}:\d{2}/);
          const [h, m] = match ? match[0].split(':') : ['00', '00'];
          let hour = parseInt(h, 10);
          const min = parseInt(m, 10);
          if (/PM/i.test(t) && hour !== 12) hour += 12;
          if (/AM/i.test(t) && hour === 12) hour = 0;
          return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        };
        to24h(startRaw);
        to24h(endRaw);
      });
    }
  }, [selectedBusiness]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center w-full max-w-lg gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-indigo-100 rounded-full p-4 mb-2">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#6366F1" />
              <path d="M20 10a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="#fff" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center">Create Your Vapi Assistant</h1>
          <p className="text-sm text-gray-600 text-center">
            Upload your knowledge base and create an AI assistant
          </p>
        </div>

        {!assistant && (
          <div className="w-full space-y-6">
            <KnowledgeBaseUpload />
            <VapiAssistantForm />
          </div>
        )}

        {assistant && (
          <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assistant Created Successfully!</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {assistant.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Assistant ID:</span> {assistant.id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Prompt:</span> {assistant.prompt}
              </p>
            </div>
            <VapiWebCall assistantId={assistant.id} />
            <button
              onClick={() => {
                // Reset the assistant state and start over
                window.location.reload();
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-3"
            >
              Create Another Assistant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantCreate; 