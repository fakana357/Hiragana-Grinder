
const synth = window.speechSynthesis;

const speakWithWebSpeechAPI = (text: string) => {
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.8;
        synth.speak(utterance);
    } catch (error) {
        console.error("Web Speech API failed:", error);
    }
};

export const speak = (text: string) => {
    try {
        const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ja&client=tw-ob`);
        audio.play().catch(() => {
            console.warn("Google TTS failed, falling back to Web Speech API.");
            speakWithWebSpeechAPI(text);
        });
    } catch (error) {
        console.error("Audio playback failed:", error);
        speakWithWebSpeechAPI(text);
    }
};
