"use client"
import React, { useState } from 'react';
import BusinessSearchInput from '../components/BusinessSearchInput';

const defaultServiceHours = [
  { day: 'Friday', start: '', end: '' },
  { day: 'Saturday', start: '', end: '' },
  { day: 'Sunday', start: '', end: '' },
];

type ServiceHour = {
  day: string;
  start: string;
  end: string;
};

const AssistantCreatePage = () => {
  // Church Info State
  const [churchProfile, setChurchProfile] = useState<{
    name: string;
    address: string;
    website: string;
    overview: string;
    phone: string;
    serviceHours: ServiceHour[];
    timezone: string;
  }>({
    name: '',
    address: '',
    website: '',
    overview: '',
    phone: '',
    serviceHours: defaultServiceHours,
    timezone: '',
  });

  // Guide Marry State
  const [guideMarry, setGuideMarry] = useState({
    phoneGreeting: '',
    callerName: true,
    callerPhone: true,
    additionalQuestions: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleServiceHourChange = (idx: number, field: keyof ServiceHour, value: string) => {
    setChurchProfile((prev) => {
      const updated = [...prev.serviceHours];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, serviceHours: updated };
    });
  };

  const handleGeneratePrompt = () => {
    // Simple prompt generation for demo
    const prompt = `Church: ${churchProfile.name}\nAddress: ${churchProfile.address}\nWebsite: ${churchProfile.website}\nOverview: ${churchProfile.overview}\nPhone: ${churchProfile.phone}\nService Hours: ${churchProfile.serviceHours.map(s => `${s.day}: ${s.start} - ${s.end}`).join(', ')}\nTimezone: ${churchProfile.timezone}\n\nPhone Greeting: ${guideMarry.phoneGreeting}\nCaller Name: ${guideMarry.callerName ? 'Requested' : 'Not requested'}\nCaller Phone: ${guideMarry.callerPhone ? 'Captured' : 'Not captured'}\nAdditional Questions: ${guideMarry.additionalQuestions}`;
    setGeneratedPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-2">
      <div className="max-w-3xl mx-auto shadow-2xl rounded-2xl bg-white/90 p-8 md:p-12 border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-8 text-center tracking-tight">Assistant Setup</h1>
        {/* Church Info Section */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-indigo-400 rounded-full mr-2"></span>
            Church Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Church Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" value={churchProfile.name} onChange={e => setChurchProfile({ ...churchProfile, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Church Address</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" value={churchProfile.address} onChange={e => setChurchProfile({ ...churchProfile, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Church Website</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" value={churchProfile.website} onChange={e => setChurchProfile({ ...churchProfile, website: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Church Phone Number</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" value={churchProfile.phone} onChange={e => setChurchProfile({ ...churchProfile, phone: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Church Overview</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition min-h-[60px]" value={churchProfile.overview} onChange={e => setChurchProfile({ ...churchProfile, overview: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Timezone</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" value={churchProfile.timezone} onChange={e => setChurchProfile({ ...churchProfile, timezone: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Hours</label>
              <div className="md:flex-row gap-3">
                {churchProfile.serviceHours.map((s, idx) => (
                  <div key={s.day} className="flex gap-2 items-center bg-indigo-50 rounded-lg px-3 py-2 mb-3 shadow-sm border border-indigo-100">
                    <span className="w-20 font-medium text-indigo-700">{s.day}</span>
                    <input type="time" className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-300" value={s.start} onChange={e => handleServiceHourChange(idx, 'start', e.target.value)} />
                    <span className="text-gray-500">-</span>
                    <input type="time" className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-300" value={s.end} onChange={e => handleServiceHourChange(idx, 'end', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="my-10 border-t border-dashed border-indigo-200"></div>
        {/* Guide Marry Section */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-indigo-400 rounded-full mr-2"></span>
            Guide Marry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Greeting</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition min-h-[60px]" value={guideMarry.phoneGreeting} onChange={e => setGuideMarry({ ...guideMarry, phoneGreeting: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="callerName" checked={guideMarry.callerName} onChange={e => setGuideMarry({ ...guideMarry, callerName: e.target.checked })} className="accent-indigo-600 w-5 h-5" />
              <label htmlFor="callerName" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">Always Request Caller Name</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="callerPhone" checked={guideMarry.callerPhone} onChange={e => setGuideMarry({ ...guideMarry, callerPhone: e.target.checked })} className="accent-indigo-600 w-5 h-5" />
              <label htmlFor="callerPhone" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">Automatically Capture Caller Phone</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Questions</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition min-h-[60px]" value={guideMarry.additionalQuestions} onChange={e => setGuideMarry({ ...guideMarry, additionalQuestions: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            onClick={handleGeneratePrompt}
          >
            Generate Prompt
          </button>
        </div>
        {generatedPrompt && (
          <div className="mt-10 bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-inner">
            <h3 className="font-bold text-indigo-700 mb-3 text-lg">Generated Prompt:</h3>
            <pre className="whitespace-pre-wrap text-gray-800 text-base">{generatedPrompt}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantCreatePage; 