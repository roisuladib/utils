export interface CookieOptions {
   expires?: number | Date;
   path?: string;
   domain?: string;
   secure?: boolean;
}

interface Cookie {
   get: (name: string) => string | null;
   set: (name: string, value: string, options?: CookieOptions) => void;
   delete: (name: string, options?: Pick<CookieOptions, 'path' | 'domain'>) => void;
}

export const cookie: Cookie = {
   get: (name: string): string | null => {
      const decodedName = encodeURIComponent(name);
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
         const [cookieName, cookieValue] = cookie.trim().split('=');
         if (cookieName === decodedName) {
            return decodeURIComponent(cookieValue);
         }
      }

      return null;
   },
   set: (name: string, value: string, options: CookieOptions = {}): void => {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (options.expires) {
         if (options.expires instanceof Date) {
            cookieString += `;expires=${options.expires.toUTCString()}`;
         } else {
            const expires = new Date(Date.now() + options.expires * 1000); // Convert seconds to milliseconds
            cookieString += `;expires=${expires.toUTCString()}`;
         }
      }

      if (options.path) {
         cookieString += `;path=${options.path}`;
      }

      if (options.domain) {
         cookieString += `;domain=${options.domain}`;
      }

      if (options.secure) {
         cookieString += ';secure';
      }

      document.cookie = cookieString;
   },
   delete: (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
      const encodedName = encodeURIComponent(name);

      let cookieString = `${encodedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;

      if (options.path) {
         cookieString += `;path=${options.path}`;
      }

      if (options.domain) {
         cookieString += `;domain=${options.domain}`;
      }

      document.cookie = cookieString;
   },
};
