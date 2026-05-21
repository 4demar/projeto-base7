import { useMemo } from 'react';
import {
  getBrowserName,
  getPlatformName,
  isAndroid,
  isIOS,
  isMobile,
  isSafari,
  isStandalone
} from '@/utils/platform';

export function usePlatform() {
  return useMemo(
    () => ({
      platform: getPlatformName(),
      browser: getBrowserName(),
      isMobile: isMobile(),
      isAndroid: isAndroid(),
      isIOS: isIOS(),
      isSafari: isSafari(),
      isStandalone: isStandalone()
    }),
    []
  );
}
