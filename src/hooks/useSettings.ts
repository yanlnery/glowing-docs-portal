
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isAcademyVisible: boolean;
  setAcademyVisible: (visible: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      isAcademyVisible: true,
      setAcademyVisible: (visible) => set({ isAcademyVisible: visible }),
    }),
    {
      name: 'site-settings',
    }
  )
);
