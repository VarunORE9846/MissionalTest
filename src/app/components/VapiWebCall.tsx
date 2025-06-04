import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { useAppSelector } from "@/redux/store";



interface VapiWebCallProps {
  assistantId: string;
}

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY as string);

const VapiWebCall: React.FC<VapiWebCallProps> = ({ assistantId }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const assistant = useAppSelector((state) => state.vapi.assistant);
  console.log("assistant details------->", assistant);

  
  useEffect(() => {
    const onStart = () => setIsCallActive(true);
    const onEnd = () => setIsCallActive(false);
    vapi.on("call-start", onStart);
    vapi.on("call-end", onEnd);
    return () => {
      vapi.off("call-start", onStart);
      vapi.off("call-end", onEnd);
    };
  }, []);

  const handleCall = () => {
    if (isCallActive) {
      vapi.stop();
    } else {
      vapi.start(assistantId);  
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <button
        onClick={handleCall}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
          isCallActive
            ? "text-white bg-red-600 hover:bg-red-700"
            : "text-white bg-indigo-600 hover:bg-indigo-700"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {isCallActive ? "End Call" : "Start Voice Call"}
      </button>
      {isCallActive && (
        <div className="text-green-600 font-semibold">Call in progress...</div>
      )}
    </div>
  );
};

export default VapiWebCall; 