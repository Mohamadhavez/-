export interface DateInfo {
  gregorian: string;
  hijri: string;
}

export interface ReportState {
  transcript: string;
  generatedReport: string;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

// Augment the window object for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}