/**
 * Detectores de plataforma / navegador / standalone.
 * Mantidos como funções puras e sem efeito colateral.
 */

const ua = (): string =>
  typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';

export function isAndroid(): boolean {
  return /android/i.test(ua());
}

export function isIOS(): boolean {
  const u = ua();
  // iPad em iOS 13+ pode reportar como Mac, então checamos touch também
  const iPadOS =
    /Mac/i.test(u) &&
    typeof navigator !== 'undefined' &&
    (navigator as unknown as { maxTouchPoints?: number }).maxTouchPoints! > 1;
  return /iPad|iPhone|iPod/.test(u) || iPadOS;
}

export function isMobile(): boolean {
  return isAndroid() || isIOS() || /Mobi|Mobile/i.test(ua());
}

export function isSafari(): boolean {
  const u = ua();
  // Safari real (não Chrome/Edge/Firefox/Opera no iOS)
  const isSafariUA = /^((?!chrome|crios|fxios|edgios|opios|android).)*safari/i.test(u);
  return isSafariUA;
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const navStandalone = (window.navigator as unknown as { standalone?: boolean })
    .standalone;
  const mq = window.matchMedia?.('(display-mode: standalone)').matches;
  return Boolean(navStandalone) || Boolean(mq);
}

export function getPlatformName(): string {
  if (isIOS()) return 'iOS';
  if (isAndroid()) return 'Android';
  if (typeof navigator !== 'undefined' && /Windows/i.test(navigator.userAgent))
    return 'Windows';
  if (typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent))
    return 'macOS';
  return 'Desktop';
}

export function getBrowserName(): string {
  const u = ua();
  if (/CriOS/i.test(u)) return 'Chrome iOS';
  if (/FxiOS/i.test(u)) return 'Firefox iOS';
  if (/EdgiOS/i.test(u)) return 'Edge iOS';
  if (/Edg\//i.test(u)) return 'Edge';
  if (/OPR\//i.test(u)) return 'Opera';
  if (/Firefox/i.test(u)) return 'Firefox';
  if (/Chrome/i.test(u)) return 'Chrome';
  if (isSafari()) return 'Safari';
  return 'Desconhecido';
}
