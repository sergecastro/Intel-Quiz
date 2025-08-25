import { useCallback, useRef } from 'react';

// EPIC SOUND SYSTEM FOR KIDS!
const createBeepSound = (frequency: number, duration: number, volume: number = 0.4) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// COUNTRY MUSIC MELODIES
const countryMelodies: { [key: string]: number[] } = {
  'Australia': [392, 440, 523, 440, 392], // Waltzing Matilda vibes
  'Brazil': [523, 587, 659, 587, 523, 440], // Samba rhythm
  'France': [523, 494, 440, 392, 440, 494, 523], // La Marseillaise
  'Germany': [523, 587, 659, 698, 659, 587, 523], // Ode to Joy
  'India': [523, 587, 659, 698, 784, 698, 659], // Raga-inspired
  'Japan': [523, 440, 392, 440, 523, 587, 523], // Sakura melody
  'Mexico': [523, 659, 784, 659, 523, 440, 523], // Mariachi style
  'Russia': [392, 440, 523, 587, 523, 440, 392], // Kalinka vibes
  'Canada': [523, 587, 659, 587, 523, 494, 440], // O Canada
  'Egypt': [440, 494, 523, 587, 523, 494, 440], // Ancient scale
  'Thailand': [523, 587, 659, 784, 659, 587, 523], // Thai pentatonic
  'South Africa': [392, 440, 523, 587, 659, 523, 440] // African rhythm
};

const createEpicSpinSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create multiple oscillators for richer sound
  for (let i = 0; i < 3; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = i === 0 ? 'sawtooth' : i === 1 ? 'square' : 'sine';
    const baseFreq = 150 + (i * 50);
    oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 3, audioContext.currentTime + 0.8);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);
    
    oscillator.start(audioContext.currentTime + (i * 0.1));
    oscillator.stop(audioContext.currentTime + 0.8);
  }
};

const playCountryMelody = (country: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const melody = countryMelodies[country] || countryMelodies['Australia']; // Default melody
  
  melody.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    const startTime = audioContext.currentTime + (index * 0.15);
    const duration = 0.2;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
};

const createMegaSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Epic ascending victory fanfare!
  const victoryNotes = [
    262, 330, 392, 523, 659, 784, 1047, // C major scale up
    1047, 784, 659, 523, 659, 784, 1047 // Victory flourish
  ];
  
  victoryNotes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = index < 7 ? 'sine' : 'square'; // Change tone for flourish
    
    const startTime = audioContext.currentTime + (index * 0.08);
    const duration = index < 7 ? 0.15 : 0.25;
    const volume = index < 7 ? 0.4 : 0.5;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
};

const createErrorSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Play a gentle descending tone
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

export const useGameAudio = () => {
  const isEnabledRef = useRef(true);

  const playSpinSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      createEpicSpinSound();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playSelectSound = useCallback((country?: string) => {
    if (!isEnabledRef.current) return;
    try {
      if (country && countryMelodies[country]) {
        // Play a short country melody snippet
        const melody = countryMelodies[country].slice(0, 3);
        melody.forEach((freq, i) => {
          setTimeout(() => createBeepSound(freq, 0.1, 0.3), i * 100);
        });
      } else {
        createBeepSound(440, 0.1, 0.3);
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playButtonSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      // Fun button sound with multiple tones
      createBeepSound(400, 0.05, 0.2);
      setTimeout(() => createBeepSound(500, 0.05, 0.15), 50);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playSuccessSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      createMegaSuccessSound();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playCountryMusic = useCallback((country: string) => {
    if (!isEnabledRef.current) return;
    try {
      playCountryMelody(country);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playErrorSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      createErrorSound();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playWinChime = useCallback((country?: string) => {
    if (!isEnabledRef.current) return;
    try {
      // First play the mega success sound
      createMegaSuccessSound();
      
      // Then play country melody after a delay
      if (country) {
        setTimeout(() => playCountryMelody(country), 1000);
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playExcitementSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      // Quick ascending excitement beeps
      const exciteNotes = [330, 392, 440, 523, 659];
      exciteNotes.forEach((freq, i) => {
        setTimeout(() => createBeepSound(freq, 0.08, 0.3), i * 30);
      });
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  return {
    playSpinSound,
    playSelectSound,
    playButtonSound,
    playSuccessSound,
    playErrorSound,
    playWinChime,
    playCountryMusic,
    playExcitementSound,
    toggleAudio,
    isEnabled: isEnabledRef.current
  };
};