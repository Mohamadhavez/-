import React from 'react';

interface RecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  onToggle: () => void;
  onFinish: () => void;
  disabled?: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({ 
  isRecording, 
  isPaused, 
  onToggle, 
  onFinish,
  disabled 
}) => {
  const showFinishButton = isRecording || isPaused;

  return (
    <div className="flex flex-col items-center justify-center py-6 gap-6">
      <div className="relative">
        <button
          onClick={onToggle}
          disabled={disabled}
          className={`
            relative z-10 group flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 shadow-xl border-4
            ${disabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : 
              isRecording && !isPaused
                ? 'bg-white border-red-500 hover:scale-105' 
                : isPaused
                  ? 'bg-emerald-500 border-emerald-600 hover:bg-emerald-600 hover:scale-105'
                  : 'bg-emerald-600 border-emerald-700 hover:bg-emerald-700 hover:scale-105 shadow-emerald-600/30'
            }
          `}
        >
          {/* Icon Logic */}
          <div className={`transition-colors duration-300 ${isRecording && !isPaused ? 'text-red-500' : 'text-white'}`}>
            {isRecording && !isPaused ? (
              // Pause Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
            ) : (
              // Mic Icon (Start or Resume)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            )}
          </div>
        </button>

        {/* Pulse Effects */}
        {isRecording && !isPaused && (
           <>
            <span className="absolute top-0 left-0 w-full h-full rounded-full bg-red-400 opacity-20 animate-[ping_1.5s_ease-in-out_infinite]"></span>
            <span className="absolute -inset-2 rounded-full border border-red-200 opacity-40 animate-pulse"></span>
           </>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <p className={`text-lg font-bold transition-colors ${isRecording && !isPaused ? 'text-red-600 animate-pulse' : isPaused ? 'text-emerald-600' : 'text-gray-600'}`}>
          {isRecording && !isPaused ? 'جاري الاستماع... (اضغط للإيقاف المؤقت)' : isPaused ? 'متوقف مؤقتاً (اضغط للاستئناف)' : 'اضغط للبدء'}
        </p>

        {/* Finish Button */}
        {showFinishButton && (
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-fade-in-up"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-400">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
            إنهاء ومراجعة
          </button>
        )}
      </div>
    </div>
  );
};

export default RecordButton;