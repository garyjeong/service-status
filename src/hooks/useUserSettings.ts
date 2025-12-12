import { useState, useEffect, useCallback } from 'react';
import type { Favorites, ServiceExpansion, SortType, Language, ComponentFilter, Theme } from '../types/ui';

interface UserSettings {
  favorites: Favorites;
  expansion: ServiceExpansion;
  sortType: SortType;
  language: Language;
  filters: ComponentFilter;
  theme: Theme;
  notificationsEnabled: boolean;
}

interface UseUserSettingsOptions {
  syncEnabled?: boolean; // 클라우드 동기화 활성화 여부
  syncUrl?: string; // 동기화 API URL
}

export const useUserSettings = (options: UseUserSettingsOptions = {}) => {
  const { syncEnabled = false, syncUrl } = options;
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // localStorage에서 설정 로드
  const loadSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('user-settings');
      if (saved) {
        const parsed = JSON.parse(saved) as UserSettings;
        setSettings(parsed);
      } else {
        // 기본 설정
        setSettings({
          favorites: {},
          expansion: {},
          sortType: 'default',
          language: 'ko',
          filters: {},
          theme: 'auto',
          notificationsEnabled: false
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading user settings:', error);
      }
      // 기본 설정으로 폴백
      setSettings({
        favorites: {},
        expansion: {},
        sortType: 'default',
        language: 'ko',
        filters: {},
        theme: 'auto',
        notificationsEnabled: false
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 설정 저장
  const saveSettings = useCallback((newSettings: Partial<UserSettings>) => {
    if (!settings) return;

    const updated = { ...settings, ...newSettings };
    try {
      localStorage.setItem('user-settings', JSON.stringify(updated));
      setSettings(updated);

      // 클라우드 동기화 (옵션)
      if (syncEnabled && syncUrl) {
        syncToCloud(updated);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving user settings:', error);
      }
    }
  }, [settings, syncEnabled, syncUrl]);

  // 클라우드 동기화
  const syncToCloud = useCallback(async (settingsToSync: UserSettings) => {
    if (!syncUrl) return;

    setIsSyncing(true);
    try {
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSync)
      });

      if (!response.ok) {
        throw new Error('Failed to sync settings');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error syncing settings to cloud:', error);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [syncUrl]);

  // 클라우드에서 설정 로드
  const loadFromCloud = useCallback(async () => {
    if (!syncUrl) return;

    setIsLoading(true);
    try {
      const response = await fetch(syncUrl);
      if (!response.ok) {
        throw new Error('Failed to load settings from cloud');
      }

      const cloudSettings = await response.json() as UserSettings;
      localStorage.setItem('user-settings', JSON.stringify(cloudSettings));
      setSettings(cloudSettings);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading settings from cloud:', error);
      }
      // 로컬 설정으로 폴백
      loadSettings();
    } finally {
      setIsLoading(false);
    }
  }, [syncUrl, loadSettings]);

  // 초기 로드
  useEffect(() => {
    if (syncEnabled && syncUrl) {
      loadFromCloud();
    } else {
      loadSettings();
    }
  }, [syncEnabled, syncUrl, loadFromCloud, loadSettings]);

  return {
    settings,
    isLoading,
    isSyncing,
    saveSettings,
    loadFromCloud,
    syncToCloud
  };
};

