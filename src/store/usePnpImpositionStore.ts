import { create } from 'zustand';

export interface PageSettings {
  pageSize: 'A4' | 'A3' | '33x48';
  orientation: 'portrait' | 'landscape';
  cardWidth: number;
  cardHeight: number;
  gapX: number;
  gapY: number;
  printType: 'single' | 'double';
}

export interface ImpositionLayout {
  cols: number;
  rows: number;
  marginX: number;
  marginY: number;
  paperWidthMm: number;
  paperHeightMm: number;
}

export interface CropMarks {
  enabled: boolean;
  side: 'front' | 'back' | 'both';
  style: 'corners' | 'continuous' | 'cross';
  color: string;
  thickness: number;
}


export interface PnpCard {
  id: string;
  frontFile: File;
  backFile: File | null;
  count: number;
  frontPreview: string;
  backPreview?: string;
}

interface PnpImpositionState {
  currentStep: number;
  setCurrentStep: (step: number) => void;

  pageSettings: PageSettings;
  setPageSettings: (settings: Partial<PageSettings>) => void;

  layout: ImpositionLayout;
  setLayout: (layout: ImpositionLayout) => void;

  cropMarks: CropMarks;
  setCropMarks: (marks: Partial<CropMarks>) => void;

  cards: PnpCard[];
  addCard: (card: PnpCard) => void;
  updateCardCount: (id: string, count: number) => void;
  updateCardBack: (id: string, backFile: File | null, backPreview?: string) => void;
  removeCard: (id: string) => void;
  setCards: (cards: PnpCard[]) => void;

  globalBackMode: boolean;
  setGlobalBackMode: (mode: boolean) => void;
  globalBackFile: File | null;
  globalBackPreview: string | null;
  setGlobalBackFile: (file: File | null, preview?: string) => void;

  resetStore: () => void;
}

const DEFAULT_SETTINGS: PageSettings = {
  pageSize: 'A4',
  orientation: 'portrait',
  cardWidth: 63,
  cardHeight: 88,
  gapX: 2,
  gapY: 2,
  printType: 'single',
};

const DEFAULT_LAYOUT: ImpositionLayout = {
  cols: 0,
  rows: 0,
  marginX: 0,
  marginY: 0,
  paperWidthMm: 210,
  paperHeightMm: 297,
};

const DEFAULT_CROPMARKS: CropMarks = {
  enabled: false,
  side: 'both',
  style: 'corners',
  color: '#000000',
  thickness: 1.0,
};


export const usePnpImpositionStore = create<PnpImpositionState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),

  pageSettings: DEFAULT_SETTINGS,
  setPageSettings: (settings) => set((state) => ({ 
    pageSettings: { ...state.pageSettings, ...settings } 
  })),

  layout: DEFAULT_LAYOUT,
  setLayout: (layout) => set({ layout }),

  cropMarks: DEFAULT_CROPMARKS,
  setCropMarks: (marks) => set((state) => ({
    cropMarks: { ...state.cropMarks, ...marks }
  })),

  cards: [],
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  updateCardCount: (id, count) => set((state) => ({
    cards: state.cards.map(c => c.id === id ? { ...c, count: Math.max(1, count) } : c)
  })),
  updateCardBack: (id, backFile, backPreview) => set((state) => ({
    cards: state.cards.map(c => c.id === id ? { ...c, backFile, backPreview } : c)
  })),
  removeCard: (id) => set((state) => ({
    cards: state.cards.filter(c => c.id !== id)
  })),
  setCards: (cards) => set({ cards }),

  globalBackMode: true,
  setGlobalBackMode: (mode) => set({ globalBackMode: mode }),
  globalBackFile: null,
  globalBackPreview: null,
  setGlobalBackFile: (file, preview) => set({ globalBackFile: file, globalBackPreview: preview || null }),

  resetStore: () => set({
    currentStep: 1,
    pageSettings: DEFAULT_SETTINGS,
    layout: DEFAULT_LAYOUT,
    cropMarks: DEFAULT_CROPMARKS,
    cards: [],
    globalBackFile: null,
    globalBackPreview: null,
    globalBackMode: true,
  }),
}));
