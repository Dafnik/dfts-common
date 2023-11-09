import { st_isAvailable } from './storage/common';

export type BrowserInfo = ReturnType<typeof i_complete>;

export const i_screenSize = `${screen.width ?? ''} x ${screen.height ?? ''}`;

export const i_cookieEnabled = () => {
  let cookieEnabled = navigator.cookieEnabled;

  if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = document.cookie.indexOf('testcookie') != -1;
  }
  return cookieEnabled;
};

export const i_mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion);

/**
 * @return {screenSize: string, name: string, version: string, majorVersion: number, mobile: boolean, os: string, osVersion: string, cookies: boolean, localStorage: boolean}
 */
export const i_complete = (): {
  screenSize: string;
  name: string;
  version: string;
  majorVersion: number;
  mobile: boolean;
  os: string;
  osVersion: string;
  cookies: boolean;
  localStorage: boolean;
} => {
  const unknown = '-';

  // browser
  const nAgt = navigator.userAgent;
  let browser = 'Netscape';
  let version = '4.0';
  let majorVersion = 4;
  let nameOffset, verOffset, ix;

  // Opera
  if ((verOffset = nAgt.indexOf('Opera')) != -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) != -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Opera Next
  if ((verOffset = nAgt.indexOf('OPR')) != -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 4);
  }
  // Legacy Edge
  else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
    browser = 'Microsoft Legacy Edge';
    version = nAgt.substring(verOffset + 5);
  }
  // Edge (Chromium)
  else if ((verOffset = nAgt.indexOf('Edg')) != -1) {
    browser = 'Microsoft Edge';
    version = nAgt.substring(verOffset + 4);
  }
  // MSIE
  else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
    browser = 'Microsoft Internet Explorer';
    version = nAgt.substring(verOffset + 5);
  }
  // Chrome
  else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
    browser = 'Chrome';
    version = nAgt.substring(verOffset + 7);
  }
  // Safari
  else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
    browser = 'Safari';
    version = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) != -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Firefox
  else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
    browser = 'Firefox';
    version = nAgt.substring(verOffset + 8);
  }
  // MSIE 11+
  else if (nAgt.indexOf('Trident/') != -1) {
    browser = 'Microsoft Internet Explorer';
    version = nAgt.substring(nAgt.indexOf('rv:') + 3);
  }
  // Other browsersVer
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
    browser = nAgt.substring(nameOffset, verOffset);
    version = nAgt.substring(verOffset + 1);
    if (browser.toLowerCase() == browser.toUpperCase()) {
      browser = navigator.appName;
    }
  }
  // trim the version string
  if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

  majorVersion = parseInt('' + version, 10);
  if (isNaN(majorVersion)) {
    version = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  // system
  let os = unknown;
  const clientStrings = [
    { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
    { s: 'Windows Vista', r: /Windows NT 6.0/ },
    { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
    { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
    { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
    { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
    { s: 'Windows 98', r: /(Windows 98|Win98)/ },
    { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
    { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
    { s: 'Windows CE', r: /Windows CE/ },
    { s: 'Windows 3.11', r: /Win16/ },
    { s: 'Android', r: /Android/ },
    { s: 'Open BSD', r: /OpenBSD/ },
    { s: 'Sun OS', r: /SunOS/ },
    { s: 'Chrome OS', r: /CrOS/ },
    { s: 'Linux', r: /(Linux|X11(?!.*CrOS))/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Mac OS X', r: /Mac OS X/ },
    { s: 'Mac OS', r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: 'QNX', r: /QNX/ },
    { s: 'UNIX', r: /UNIX/ },
    { s: 'BeOS', r: /BeOS/ },
    { s: 'OS/2', r: /OS\/2/ },
    { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ },
  ];
  for (const cs of clientStrings) {
    if (cs.r.test(nAgt)) {
      os = cs.s;
      break;
    }
  }

  let osVersion = unknown;

  if (/Windows/.test(os)) {
    const result = /Windows (.*)/.exec(os);
    if (result != null) {
      osVersion = result[1] ?? '';
    }
    os = 'Windows';
  } else {
    switch (os) {
      case 'Mac OS':
      case 'Mac OS X':
      case 'Android': {
        const result = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([._\d]+)/.exec(nAgt);
        if (result != null) {
          osVersion = result[1] ?? '';
        }
        break;
      }
      case 'iOS': {
        const result = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion);
        if (result != null) {
          osVersion = result[1] + '.' + result[2] + '.' + (result[3] ?? '0');
        }
        break;
      }
    }
  }

  return {
    screenSize: i_screenSize,
    name: browser,
    version: version,
    majorVersion: majorVersion,
    mobile: i_mobile,
    os: os,
    osVersion: osVersion,
    cookies: i_cookieEnabled(),
    localStorage: st_isAvailable(),
  };
};
