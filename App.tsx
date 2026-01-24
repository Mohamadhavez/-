import React, { useState, useRef, useEffect, useCallback } from 'react';
import DateHeader from './components/DateHeader';
import RecordButton from './components/RecordButton';
import ReportCard from './components/ReportCard';
import ReviewArea from './components/ReviewArea';
import { generateSessionReport } from './services/geminiService';

type AppStep = 'idle' | 'recording' | 'review' | 'report';

function App() {
  const [step, setStep] = useState<AppStep>('idle');
  const [isPaused, setIsPaused] = useState(false);
  
  // accumulatedTranscript stores text from previous segments (before pause)
  const [accumulatedTranscript, setAccumulatedTranscript] = useState('');
  // currentTranscript stores text from the active session
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // fullTranscript is what we show in the review area (accumulated + current)
  const fullTranscript = accumulatedTranscript + currentTranscript;

  const [report, setReport] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA'; // Focus on Arabic

      recognition.onresult = (event: any) => {
        let interimText = '';
        for (let i = 0; i < event.results.length; i++) {
          interimText += event.results[i][0].transcript;
        }
        setCurrentTranscript(interimText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setError('يرجى السماح باستخدام الميكروفون لاستخدام هذه الميزة.');
        } else if (event.error === 'aborted') {
            // Ignore aborted error which happens on manual stop
            return;
        } else {
          setError('حدث خطأ أثناء الاستماع. حاول مرة أخرى.');
        }
        stopRecordingLogic();
      };

      recognitionRef.current = recognition;
    } else {
      setError('المتصفح الخاص بك لا يدعم تحويل الصوت إلى نص.');
    }
  }, []);

  const stopRecordingLogic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore if already stopped
      }
    }
    setStep('idle');
    setIsPaused(false);
  };

  const handleToggleRecord = useCallback(() => {
    if (step === 'idle') {
      // START Recording
      setError(null);
      setReport('');
      setAccumulatedTranscript('');
      setCurrentTranscript('');
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setStep('recording');
          setIsPaused(false);
        } catch (e) {
          console.error("Start error:", e);
        }
      }
    } else if (step === 'recording') {
      if (isPaused) {
        // RESUME Recording
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsPaused(false);
          } catch (e) {
            console.error("Resume error:", e);
          }
        }
      } else {
        // PAUSE Recording
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        // Move current to accumulated and clear current
        setAccumulatedTranscript(prev => prev + ' ' + currentTranscript);
        setCurrentTranscript('');
        setIsPaused(true);
      }
    }
  }, [step, isPaused, currentTranscript]);

  const handleFinishRecording = () => {
    // Stop the engine
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Commit any final text
    const finalText = (accumulatedTranscript + ' ' + currentTranscript).trim();
    setAccumulatedTranscript(finalText);
    setCurrentTranscript('');
    
    setIsPaused(false);
    setStep('review');
  };

  const handleGenerateReport = async () => {
    if (!accumulatedTranscript.trim()) {
      setError("لم يتم اكتشاف أي صوت.");
      return;
    }

    // Limit transcript length
    const MAX_LENGTH = 15000;
    if (accumulatedTranscript.length > MAX_LENGTH) {
      setError("عذراً، التسجيل طويل جداً. يرجى المحاولة في تسجيلات أقصر.");
      return;
    }

    setIsProcessing(true);
    try {
      const generatedReport = await generateSessionReport(accumulatedTranscript);
      setReport(generatedReport);
      setStep('report');
    } catch (err) {
      setError("فشل في إنشاء التقرير. تأكد من الاتصال بالإنترنت.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setReport('');
    setAccumulatedTranscript('');
    setCurrentTranscript('');
    setError(null);
    setStep('idle');
    setIsPaused(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar/Header */}
      <header className="bg-emerald-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">مُعَلِّم</h1>
          </div>
          <div className="text-xs bg-emerald-700/50 px-3 py-1 rounded-full border border-emerald-400/30">
            مساعد المعلم الذكي
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        {/* Date Display */}
        <DateHeader />

        {/* Main Interface */}
        <div className="flex flex-col gap-6">
          
          {/* Instructions (only show if idle) */}
          {step === 'idle' && (
            <div className="text-center text-gray-500 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
              <p className="mb-2 font-medium text-emerald-800">كيف يعمل؟</p>
              1. اضغط الميكروفون للتسجيل 🎙️ <br/>
              2. يمكنك الإيقاف المؤقت والاستئناف ⏯️ <br/>
              3. راجع النص، ثم احصل على التقرير ✨
            </div>
          )}

          {/* Recorder Section */}
          {(step === 'idle' || step === 'recording') && (
            <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 p-8 relative overflow-hidden transition-all duration-500">
               {/* Background decoration */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
               
               <RecordButton 
                  isRecording={step === 'recording'} 
                  isPaused={isPaused}
                  onToggle={handleToggleRecord} 
                  onFinish={handleFinishRecording}
                  disabled={!!error && !recognitionRef.current}
                />

                {/* Live Transcript Preview */}
                {fullTranscript && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-right text-gray-600 text-sm max-h-32 overflow-y-auto shadow-inner">
                    <span className="font-bold text-gray-400 block mb-1 text-xs">النص الحالي:</span>
                    {accumulatedTranscript} <span className="text-emerald-600 font-medium">{currentTranscript}</span>
                  </div>
                )}
            </div>
          )}

          {/* Review Section */}
          {step === 'review' && (
            <ReviewArea 
              transcript={accumulatedTranscript}
              setTranscript={setAccumulatedTranscript}
              onConfirm={handleGenerateReport}
              onCancel={handleReset}
              isProcessing={isProcessing}
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              {error}
              {error.includes("ميكروفون") && <button onClick={() => window.location.reload()} className="mr-auto text-xs underline">تحديث الصفحة</button>}
            </div>
          )}

          {/* Output Section */}
          {step === 'report' && (
            <ReportCard 
              report={report} 
              isProcessing={isProcessing} 
              onReset={handleReset} 
            />
          )}
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 text-xs pb-6">
        <p> طورناه لأجلكم فلا تنسونا من صالح دعائكم 🤍   </p>
      </footer>
    </div>
  );
}

export default App;