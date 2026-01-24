import React, { useState } from 'react';

interface ReportCardProps {
  report: string;
  isProcessing: boolean;
  onReset: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, isProcessing, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Helper function to render text with WhatsApp-style formatting
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        return <div key={index} className="h-3" />;
      }

      // Check if line is a list item (starts with - or •)
      const isListItem = trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ');
      const contentToProcess = isListItem ? trimmedLine.substring(1).trim() : trimmedLine;

      // Parse bold syntax (*text*)
      // The regex captures the delimiter * so we can find it in the split parts
      const parts = contentToProcess.split(/(\*[^*]+\*)/g);
      
      const processedContent = parts.map((part, partIndex) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          // Remove asterisks and render bold
          return <strong key={partIndex} className="font-bold text-emerald-800">{part.slice(1, -1)}</strong>;
        }
        return <span key={partIndex}>{part}</span>;
      });

      if (isListItem) {
         return (
           <div key={index} className="flex items-start gap-2 mr-4 mb-1">
             <span className="text-emerald-500 font-bold mt-1.5 text-xs">●</span>
             <div className="text-gray-800 leading-relaxed">{processedContent}</div>
           </div>
         );
      }

      return (
        <div key={index} className="min-h-[1.5rem] text-gray-800 leading-relaxed mb-1">
          {processedContent}
        </div>
      );
    });
  };

  if (isProcessing) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg p-8 border border-emerald-100 flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-800 font-medium text-lg">جاري صياغة التقرير الاحترافي...</p>
        <p className="text-emerald-600/70 text-sm mt-2">الذكاء الاصطناعي يعمل الآن 🧠✨</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="w-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            التقرير الجاهز
          </h2>
          <div className="flex gap-2">
            <button 
               onClick={onReset}
               className="text-emerald-100 hover:text-white p-2 rounded-full hover:bg-emerald-500/20 transition-colors"
               title="إنشاء تقرير جديد"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50/50">
          <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-6 md:p-8">
            {renderFormattedText(report)}
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
             <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-lg shadow-md transition-all transform active:scale-95 ${
                copied 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
              }`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                  تم النسخ بنجاح!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                  نسخ للواتساب
                </>
              )}
            </button>
            
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(report)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-lg bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                 <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 1.83.504 3.535 1.378 5.013a9.75 9.75 0 0 0 14.887-1.517.75.75 0 0 1 1.258.835 11.25 11.25 0 0 1-17.18 1.748A11.25 11.25 0 0 1 12 .75a11.25 11.25 0 0 1 11.25 11.25c0 1.76-.408 3.433-1.13 4.938a.75.75 0 0 1-1.353-.655A9.75 9.75 0 0 0 12 2.25ZM16.34 9.57a.75.75 0 0 0-1.06 0l-3.236 3.237-1.177-1.177a.75.75 0 0 0-1.06 1.06l1.707 1.708a.75.75 0 0 0 1.06 0l3.768-3.768a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
              </svg>
              فتح واتساب مباشرة
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;