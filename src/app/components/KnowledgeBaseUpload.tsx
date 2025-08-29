import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setKnowledgeBaseId, setLoading, setError } from '../../redux/slices/vapiSlice';
import { vapiService } from '../../services/vapi';

export default function KnowledgeBaseUpload() {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      dispatch(setLoading(true));
      
      // Upload file
      const { id: fileId } = await vapiService.uploadFile(file);
      
      // Create knowledge base
      // const { id: knowledgeBaseId } = await vapiService.createKnowledgeBase(fileId);
      
      dispatch(setKnowledgeBaseId(fileId));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to upload file'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Knowledge Base</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF files only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {file && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 truncate">{file.name}</span>
            <button
              onClick={handleUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 