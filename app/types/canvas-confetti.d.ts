declare module 'canvas-confetti' {
  export interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    gravity?: number;
    scalar?: number;
    drift?: number;
    ticks?: number;
    zIndex?: number;
  }

  export interface Confetti {
    (options?: ConfettiOptions): void;
    create: (
      canvas: HTMLElement,
      options?: { resize?: boolean; useWorker?: boolean },
    ) => Confetti;
  }

  const confetti: Confetti;
  export default confetti;
}
