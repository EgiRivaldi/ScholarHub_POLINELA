import { useState, useEffect } from 'react';
import { getPublicSettings } from '@/services/api';
import CinematicFooter from '@/components/ui/motion-footer';

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((data) => {
        if (isMounted) setSettings(data || {});
      })
      .catch((e) => console.error('Failed to load settings in footer:', e));
    return () => {
      isMounted = false;
    };
  }, []);

  return <CinematicFooter settings={settings} />;
}
