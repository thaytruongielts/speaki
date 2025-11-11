
import React, { useState, useRef } from 'react';
import { MicIcon, StopCircleIcon, DownloadIcon } from './Icons';

type RecordingStatus = 'idle' | 'recording' | 'stopped';

const AudioRecorder: React.FC = () => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    setAudioUrl(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        setStatus('recording');
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Could not access microphone. Please check permissions.");
      }
    } else {
      setError("Audio recording is not supported in your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Release microphone
      setStatus('stopped');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg">
      <div className="flex items-center space-x-4">
        {status !== 'recording' ? (
          <button
            onClick={startRecording}
            className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-110"
            aria-label="Start recording"
          >
            <MicIcon className="w-8 h-8" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-16 h-16 bg-gray-700 text-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-transform transform hover:scale-110 animate-pulse"
            aria-label="Stop recording"
          >
            <StopCircleIcon className="w-8 h-8" />
          </button>
        )}
        {audioUrl && (
          <a
            href={audioUrl}
            download={`ielts-practice-answer.webm`}
            className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
            aria-label="Download recording"
          >
            <DownloadIcon className="w-5 h-5" />
            Download
          </a>
        )}
      </div>
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
    </div>
  );
};

export default AudioRecorder;
