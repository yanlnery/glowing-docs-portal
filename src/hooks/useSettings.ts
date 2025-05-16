
import { useState, useEffect, useCallback } from 'react';

export interface Settings {
  isAcademyVisible: boolean;
  // Add other settings here as needed
}

const SETTINGS_KEY = 'appSettings';

const defaultSettings: Settings = {
  isAcademyVisible: true, // Default to true or as per initial project setup
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
    }
    return defaultSettings;
  });

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving settings to localStorage:', error);
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SETTINGS_KEY && event.newValue) {
        try {
          console.log("Settings changed in another tab, updating...");
          setSettings(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Error parsing updated settings from storage event:', error);
        }
      } else if (event.key === SETTINGS_KEY && !event.newValue) {
        // Settings were cleared in another tab
        console.log("Settings cleared in another tab, reverting to default...");
        setSettings(defaultSettings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      }
    };

    // Initialize if not already set
    if (!localStorage.getItem(SETTINGS_KEY)) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    }


    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    settings,
    updateSettings,
    isAcademyVisible: settings.isAcademyVisible, // Keep this for convenience if used directly
  };
};

// Function to get settings directly for admin panel or initial setup
export const getSettings = (): Settings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
  }
  return defaultSettings;
};

// Function to save settings directly for admin panel
export const saveSettings = (newSettings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    // Manually dispatch a storage event so that other tabs using the hook will update
    // This is useful if the saveSettings is called from a context where the hook isn't re-rendering immediately
    // (e.g. admin panel saving directly to localStorage)
    window.dispatchEvent(new StorageEvent('storage', {
        key: SETTINGS_KEY,
        newValue: JSON.stringify(newSettings),
        oldValue: localStorage.getItem(SETTINGS_KEY), // Send current value as old
        storageArea: localStorage,
    }));

  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

