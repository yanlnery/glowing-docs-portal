import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/services/settingsService';

export interface Settings {
  isAcademyVisible: boolean;
  isAcademyOpenForSubscription: boolean;
}

const defaultSettings: Settings = {
  isAcademyVisible: true,
  isAcademyOpenForSubscription: false, // Default to waitlist mode
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from Supabase
  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await settingsService.getSettings(['isAcademyVisible', 'isAcademyOpenForSubscription']);
      
      setSettings({
        isAcademyVisible: data?.isAcademyVisible ?? defaultSettings.isAcademyVisible,
        isAcademyOpenForSubscription: data?.isAcademyOpenForSubscription ?? defaultSettings.isAcademyOpenForSubscription,
      });
    } catch (error) {
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Save each setting to Supabase
    for (const [key, value] of Object.entries(newSettings)) {
      await settingsService.updateSetting(key, value);
    }
  }, [settings]);

  return {
    settings,
    updateSettings,
    isAcademyVisible: settings.isAcademyVisible,
    isAcademyOpenForSubscription: settings.isAcademyOpenForSubscription,
    isLoading,
    refetch: loadSettings,
  };
};

// Function to get settings directly (returns a promise now)
export const getSettings = async (): Promise<Settings> => {
  try {
    const { data } = await settingsService.getSettings(['isAcademyVisible', 'isAcademyOpenForSubscription']);
    return {
      isAcademyVisible: data?.isAcademyVisible ?? defaultSettings.isAcademyVisible,
      isAcademyOpenForSubscription: data?.isAcademyOpenForSubscription ?? defaultSettings.isAcademyOpenForSubscription,
    };
  } catch (error) {
    return defaultSettings;
  }
};

// Function to save settings directly
export const saveSettings = async (newSettings: Settings): Promise<void> => {
  for (const [key, value] of Object.entries(newSettings)) {
    await settingsService.updateSetting(key, value);
  }
};
