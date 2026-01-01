import { useCallback, useRef, useEffect } from 'react';

// Sound URLs - Using free sound effects
const COUNTDOWN_BEEP = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
const COUNTDOWN_FINAL = 'https://assets.mixkit.co/active_storage/sfx/1005/1005-preview.mp3';
const FIREWORK_LAUNCH = 'https://assets.mixkit.co/active_storage/sfx/2937/2937-preview.mp3';
const FIREWORK_EXPLOSION = 'https://assets.mixkit.co/active_storage/sfx/2930/2930-preview.mp3';
const CELEBRATION = 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3';

export const useSoundEffects = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const audioCache = useRef<Map<string, AudioBuffer>>(new Map());
  const celebrationAudio = useRef<HTMLAudioElement | null>(null);

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  // Preload audio files
  const preloadSound = useCallback(async (url: string) => {
    if (audioCache.current.has(url)) return;
    
    try {
      const ctx = initAudioContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioCache.current.set(url, audioBuffer);
    } catch (error) {
      console.log('Audio preload skipped:', url);
    }
  }, [initAudioContext]);

  // Play a cached sound
  const playSound = useCallback((url: string, volume: number = 0.5) => {
    try {
      const ctx = audioContext.current;
      const buffer = audioCache.current.get(url);
      
      if (!ctx || !buffer) {
        // Fallback to HTML Audio
        const audio = new Audio(url);
        audio.volume = volume;
        audio.play().catch(() => {});
        return;
      }

      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
    } catch (error) {
      // Silent fail - audio is optional
    }
  }, []);

  // Preload all sounds
  useEffect(() => {
    const sounds = [COUNTDOWN_BEEP, COUNTDOWN_FINAL, FIREWORK_LAUNCH, FIREWORK_EXPLOSION, CELEBRATION];
    sounds.forEach(preloadSound);
  }, [preloadSound]);

  // Countdown sound
  const playCountdownTick = useCallback((count: number) => {
    initAudioContext();
    if (count <= 3 && count > 0) {
      playSound(COUNTDOWN_FINAL, 0.6);
    } else if (count > 0) {
      playSound(COUNTDOWN_BEEP, 0.4);
    }
  }, [playSound, initAudioContext]);

  // Firework launch sound
  const playFireworkLaunch = useCallback(() => {
    playSound(FIREWORK_LAUNCH, 0.3);
  }, [playSound]);

  // Firework explosion sound
  const playFireworkExplosion = useCallback(() => {
    playSound(FIREWORK_EXPLOSION, 0.4);
  }, [playSound]);

  // Start celebration music
  const playCelebration = useCallback(() => {
    initAudioContext();
    if (!celebrationAudio.current) {
      celebrationAudio.current = new Audio(CELEBRATION);
      celebrationAudio.current.loop = true;
      celebrationAudio.current.volume = 0.3;
    }
    celebrationAudio.current.play().catch(() => {});
  }, [initAudioContext]);

  // Stop celebration music
  const stopCelebration = useCallback(() => {
    if (celebrationAudio.current) {
      celebrationAudio.current.pause();
      celebrationAudio.current.currentTime = 0;
    }
  }, []);

  return {
    initAudioContext,
    playCountdownTick,
    playFireworkLaunch,
    playFireworkExplosion,
    playCelebration,
    stopCelebration,
  };
};
