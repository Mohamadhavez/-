import React from 'react';

interface ReviewAreaProps {
  transcript: string;
  setTranscript: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const ReviewArea: React.FC<ReviewAreaProps> = ({ 
  transcript, 
  setTranscript, 
  onConfirm, 
  onCancel,
  isProcessing 
}) => {
  return (
    <div className="w-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            مراجعة النص
          </h2>
        </div>

        <div className="p-6 bg-gray-50">
          <p className="text-gray-500 text-sm mb-3">
            يمكنك تعديل النص أدناه للتأكد من صحة المعلومات قبل إنشاء التقرير.
          </p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={isProcessing}
            placeholder="النص المسجل سيظهر هنا..."
            className="w-full h-64 p-4 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-800 text-lg leading-relaxed shadow-inner"
          />
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
             <button
              onClick={onConfirm}
              disabled={isProcessing || !transcript.trim()}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-lg shadow-md transition-all transform active:scale-95 text-white
                ${isProcessing || !transcript.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
                }`}
            >
              {isProcessing ? 'جاري الإنشاء...' : '✨ إنشاء التقرير'}
            </button>
            
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-lg bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              إلغاء وإعادة التسجيل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewArea;