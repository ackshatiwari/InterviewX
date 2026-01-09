// Web Speech API Service

export const synthesizeSpeech = async (text) => {
  // Return command for client-side speech
  return {
    command: 'speak',
    text: text,
    voice: 'en-US'
  };
};

export const synthesizeSpeechStream = async (text) => {
  // Return instructions for client-side TTS
  return JSON.stringify({
    type: 'web-speech',
    text: text,
    instructions: 'Use browser speechSynthesis API'
  });
};

// Client-side speech function
export const browserSpeak = (text, voice = 'en-US') => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Select voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang === 'en-US' && v.name.includes('Google')
    ) || voices.find(v => v.lang === 'en-US');
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
    
    return new Promise((resolve) => {
      utterance.onend = resolve;
      utterance.onerror = resolve;
    });
  } else {
    console.warn('Speech synthesis not supported');
    return Promise.resolve();
  }
};