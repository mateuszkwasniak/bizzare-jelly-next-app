import { create } from "zustand";

const productImagesCount = 3;

interface SliderState {
  currentImage: number;
  setCurrentImage: (id: number) => void;
  nextImage: () => void;
  previousImage: () => void;
}

export const useSliderState = create<SliderState>((set, get) => ({
  currentImage: 0,
  setCurrentImage: (id: number) => set(() => ({ currentImage: id })),
  nextImage: () => {
    if (get().currentImage === productImagesCount - 1) {
      get().setCurrentImage(0);
    } else set((state) => ({ currentImage: state.currentImage + 1 }));
  },
  previousImage: () => {
    if (get().currentImage === 0) {
      get().setCurrentImage(productImagesCount - 1);
    } else set((state) => ({ currentImage: state.currentImage - 1 }));
  },
}));
