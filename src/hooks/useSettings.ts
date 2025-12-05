import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/services/settingsService';

export interface Settings {
  isAcademyVisible: boolean;
}

const defaultSettings: Settings = {
  isAcademyVisible: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from Supabase
  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await settingsService.getSettings(['isAcademyVisible']);
      
      setSettings({
        isAcademyVisible: data?.isAcademyVisible ?? defaultSettings.isAcademyVisible,
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
    isLoading,
    refetch: loadSettings,
  };
};

// Function to get settings directly (returns a promise now)
export const getSettings = async (): Promise<Settings> => {
  try {
    const { data } = await settingsService.getSettings(['isAcademyVisible']);
    return {
      isAcademyVisible: data?.isAcademyVisible ?? defaultSettings.isAcademyVisible,
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
