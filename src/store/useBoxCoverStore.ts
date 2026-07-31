import { create } from 'zustand';

export interface BoxDimensions {
  width: number; // En (W)
  length: number; // Boy (L)
  height: number; // Derinlik (H)
}

export interface BoxImages {
  center: string | null;
  top: string | null;
  bottom: string | null;
  left: string | null;
  right: string | null;
}

export interface BoxCoverState {
  currentStep: number;
  setCurrentStep: (step: number) => void;

  dimensions: BoxDimensions;
  setDimensions: (dims: Partial<BoxDimensions>) => void;

  baseImages: BoxImages;
  lidImages: BoxImages;
  setImage: (type: 'base' | 'lid', position: keyof BoxImages, src: string | null) => void;
  
  // Auto-generation logic parameters
  mirrorEdges: boolean;
  setMirrorEdges: (mirror: boolean) => void;
}

const defaultImages: BoxImages = {
  center: null,
  top: null,
  bottom: null,
  left: null,
  right: null,
};

export const useBoxCoverStore = create<BoxCoverState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),

  dimensions: {
    width: 200,
    length: 200,
    height: 50,
  },
  setDimensions: (dims) => set((state) => ({ dimensions: { ...state.dimensions, ...dims } })),

  baseImages: { ...defaultImages },
  lidImages: { ...defaultImages },
  setImage: (type, position, src) => set((state) => ({ 
    [type === 'base' ? 'baseImages' : 'lidImages']: { 
      ...(type === 'base' ? state.baseImages : state.lidImages), 
      [position]: src 
    } 
  })),
  
  mirrorEdges: true,
  setMirrorEdges: (mirror) => set({ mirrorEdges: mirror }),
}));
