import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SystemSetting } from '@/types/database';

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      setSettings(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting ? setting.setting_value : defaultValue;
  };

  const isModuleEnabled = (moduleKey: string) => {
    const setting = getSetting(moduleKey);
    return setting && setting.enabled === true;
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      setSettings(prev => 
        prev.map(setting => 
          setting.setting_key === key 
            ? { ...setting, setting_value: value }
            : setting
        )
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    settings,
    loading,
    error,
    getSetting,
    isModuleEnabled,
    updateSetting,
    reload: loadSettings
  };
};