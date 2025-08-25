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

// EPIC COUNTRY MUSIC MELODIES - FULL SONGS FOR KIDS!
const countryMelodies: { [key: string]: number[] } = {
  'Australia': [392, 440, 523, 587, 523, 440, 392, 330, 392, 440, 523, 587, 659, 587, 523], // Waltzing Matilda full
  'Brazil': [523, 587, 659, 698, 784, 698, 659, 587, 523, 587, 659, 698, 784, 880, 784], // Samba carnival
  'France': [523, 494, 440, 392, 440, 494, 523, 587, 659, 698, 659, 587, 523, 494, 440], // La Marseillaise epic
  'Germany': [523, 587, 659, 698, 784, 880, 784, 698, 659, 587, 523, 587, 659, 698, 784], // Ode to Joy full
  'India': [440, 494, 523, 587, 659, 698, 784, 880, 784, 698, 659, 587, 523, 494, 440], // Raga journey
  'Japan': [523, 440, 392, 349, 392, 440, 523, 587, 523, 440, 392, 349, 330, 349, 392], // Sakura complete
  'Mexico': [659, 784, 880, 784, 659, 587, 523, 659, 784, 880, 1047, 880, 784, 659, 587], // Mariachi fiesta
  'Russia': [392, 440, 523, 587, 659, 587, 523, 440, 392, 349, 392, 440, 523, 587, 659], // Kalinka dance
  'Canada': [523, 587, 659, 698, 784, 698, 659, 587, 523, 494, 440, 494, 523, 587, 659], // O Canada proud
  'Egypt': [440, 494, 523, 587, 659, 698, 659, 587, 523, 494, 440, 392, 440, 494, 523], // Pharaoh's melody
  'Thailand': [523, 587, 659, 698, 784, 880, 784, 698, 659, 587, 523, 494, 440, 494, 523], // Thai temple
  'South Africa': [392, 440, 523, 587, 659, 698, 784, 698, 659, 587, 523, 440, 392, 349, 392] // Ubuntu rhythm
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
  
  // Play beautiful country melodies with multiple instruments
  melody.forEach((frequency, index) => {
    // Main melody
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    oscillator1.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator1.type = 'sine';
    
    // Harmony (lower octave)
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    oscillator2.frequency.setValueAtTime(frequency * 0.5, audioContext.currentTime);
    oscillator2.type = 'triangle';
    
    const startTime = audioContext.currentTime + (index * 0.25);
    const duration = 0.3;
    const volume1 = 0.5;
    const volume2 = 0.2;
    
    // Main melody
    gainNode1.gain.setValueAtTime(0, startTime);
    gainNode1.gain.linearRampToValueAtTime(volume1, startTime + 0.02);
    gainNode1.gain.linearRampToValueAtTime(0, startTime + duration);
    
    // Harmony
    gainNode2.gain.setValueAtTime(0, startTime);
    gainNode2.gain.linearRampToValueAtTime(volume2, startTime + 0.02);
    gainNode2.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator1.start(startTime);
    oscillator1.stop(startTime + duration);
    oscillator2.start(startTime);
    oscillator2.stop(startTime + duration);
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
      
      // Then play full country melody after a delay
      if (country) {
        setTimeout(() => {
          playCountryMelody(country);
          // Play it again for emphasis
          setTimeout(() => playCountryMelody(country), 4000);
        }, 1200);
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