import { useCallback, useRef } from 'react';

// Simple sound generation using Web Audio API
const createBeepSound = (frequency: number, duration: number, volume: number = 0.3) => {
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

const createSpinSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

const createSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Play a cheerful ascending melody
  const notes = [262, 330, 392, 523]; // C, E, G, C (major chord)
  
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    const startTime = audioContext.currentTime + (index * 0.1);
    const duration = 0.3;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
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
      createSpinSound();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playSelectSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      createBeepSound(400, 0.1, 0.2);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playButtonSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      createBeepSound(300, 0.05, 0.15);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const playSuccessSound = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      createSuccessSound();
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

  const playWinChime = useCallback(() => {
    if (!isEnabledRef.current) return;
    try {
      // Extended celebration sound
      setTimeout(() => createBeepSound(523, 0.2, 0.3), 0);   // C
      setTimeout(() => createBeepSound(659, 0.2, 0.3), 100); // E
      setTimeout(() => createBeepSound(784, 0.2, 0.3), 200); // G
      setTimeout(() => createBeepSound(1046, 0.4, 0.4), 300); // C
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
    toggleAudio,
    isEnabled: isEnabledRef.current
  };
};