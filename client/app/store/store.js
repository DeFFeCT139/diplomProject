import { create } from "zustand";

export const useTour = create(set => ({
    tour: null,
    setTour: (newTour) => set({ tour: newTour })
}))