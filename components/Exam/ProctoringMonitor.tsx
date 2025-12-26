import React, { useEffect, useRef, useState } from 'react';
import { useExam } from '../../context/ExamContext.tsx';
import { Camera, AlertTriangle } from 'lucide-react';

const ProctoringMonitor: React.FC = () => {
  const { state, dispatch } = useExam();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    if (!state.isActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setPermissionError(false);
      } catch (err) {
        console.error("Camera access denied:", err);
        setPermissionError(true);
        dispatch({ type: 'FLAG_ACTIVITY', payload: 'Camera Access Denied' });
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [state.isActive, dispatch]);

  useEffect(() => {
    if (!state.isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addWarning("Tab switch detected!");
        dispatch({ type: 'FLAG_ACTIVITY', payload: 'Tab Switch' });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        addWarning("Exited full-screen mode!");
        dispatch({ type: 'FLAG_ACTIVITY', payload: 'Fullscreen Exit' });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [state.isActive, dispatch]);

  const addWarning = (msg: string) => {
    setWarnings(prev => [...prev.slice(-2), `${msg} at ${new Date().toLocaleTimeString()}`]);
    setTimeout(() => {
       setWarnings(prev => prev.slice(1));
    }, 5000);
  };

  if (!state.isActive) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      <div className="flex flex-col gap-1 mb-2">
        {warnings.map((w, i) => (
          <div key={i} className="bg-red-600 text-white text-xs px-3 py-1 rounded shadow-lg animate-bounce flex items-center gap-2">
            <AlertTriangle size={12} /> {w}
          </div>
        ))}
      </div>

      <div className="relative w-32 h-24 bg-black rounded overflow-hidden shadow-2xl border-2 border-gray-700">
        {!permissionError ? (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover transform scale-x-[-1]" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-xs text-center p-1 bg-red-900">
            Cam Blocked
          </div>
        )}
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-0 w-full bg-black/50 text-[10px] text-white text-center py-0.5">
            AI Proctoring
        </div>
      </div>
    </div>
  );
};

export default ProctoringMonitor;