import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAssistant, setLoading, setError, setKnowledgeBaseId } from '../../redux/slices/vapiSlice';
import { vapiService } from '../../services/vapi';
import type { RootState } from '../../redux/store';

export default function VapiAssistantForm() {
  const [name, setName] = useState('');
  const generatedPrompt = useSelector((state: RootState) => state.vapi.generatedPrompt);
  const [systemPrompt, setSystemPrompt] = useState(generatedPrompt || '');
  const dispatch = useDispatch();
  const knowledgeBaseId = useSelector((state: RootState) => state.vapi.knowledgeBaseId);

  // Update systemPrompt if generatedPrompt changes (e.g., on navigation)
  useEffect(() => {
    if (generatedPrompt) setSystemPrompt(generatedPrompt);
  }, [generatedPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !systemPrompt) {
      dispatch(setError('Please fill in all fields'));
      return;
    }

    try {
      dispatch(setLoading(true));

      const payload = {
        name,
        model: {
          provider: 'openai',
          model: 'gpt-4o',

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
          ],
          maxTokens: 500,
          temperature: 0.5,
          knowledgeBase: {
            topK: 5,
            fileIds: [knowledgeBaseId],
            provider: "canonical"
          },
          emotionRecognitionEnabled: true
        },
        firstMessage: "Hi, there ! How can I help you today ?",

        voice: {
          voiceId: "Neha",
          provider: "vapi"
        },
        endCallFunctionEnabled: true,
        endCallMessage: "Thank you. Have a great day!",
        transcriber: {
          model: "nova-3",
          language: "en",
          provider: "deepgram"
        },
        maxDurationSeconds: 480,
        silenceTimeoutSeconds: 25,
        clientMessages: [
          "transcript",
          "hang",
          "function-call",
          "speech-update",
          "metadata",
          "conversation-update"
        ],
        serverMessages: [
          "end-of-call-report",
          "status-update",
          "hang",
          "function-call"
        ],
        endCallPhrases: [
          "bye"
        ],
        backgroundDenoisingEnabled: true,
        artifactPlan: {
          videoRecordingEnabled: false
        },
        startSpeakingPlan: {
          waitSeconds: 2,
          transcriptionEndpointingPlan: {
            onPunctuationSeconds: 0.8,
            onNoPunctuationSeconds: 2,
            onNumberSeconds: 1.1
          },
          smartEndpointingEnabled: false
        },
        stopSpeakingPlan: {
          numWords: 3,
          voiceSeconds: 0.5,
          backoffSeconds: 1.1
        },
        server: {
          timeoutSeconds: 5
        }
      };

      const assistant = await vapiService.createAssistant(payload);
      console.log("assistant details------->", assistant);
      dispatch(setAssistant({
        id: assistant.id,
        name: assistant.name,
        prompt: systemPrompt
      }));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create assistant'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Vapi Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Assistant Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter assistant name"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Knowledge Base ID
          </label>
          <input
            type="text"
            id="name"
            value={knowledgeBaseId || ''}
            onChange={(e) => setKnowledgeBaseId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter assistant name"
          />
        </div>

        <div>
          <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">
            System Prompt
          </label>
          <textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter system prompt"
          />
        </div>

        {knowledgeBaseId && (
          <div className="p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-700">
              Knowledge base is ready to be used
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Assistant
        </button>
      </form>
    </div>
  );
} 