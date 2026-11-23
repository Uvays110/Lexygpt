/** Иконки внешних сервисов (в lucide их нет). */

export function TelegramIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#2AABEE" />
      <path
        d="M7.2 15.6 23.4 9.4c.75-.27 1.4.18 1.16 1.33l-2.76 13c-.2.92-.75 1.15-1.52.71l-4.2-3.1-2.03 1.95c-.22.22-.41.41-.84.41l.3-4.27 7.77-7.02c.34-.3-.07-.47-.52-.17l-9.6 6.05-4.14-1.29c-.9-.28-.92-.9.18-1.33Z"
        fill="#fff"
      />
    </svg>
  );
}

export function VkIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill="#0077FF" />
      <path
        d="M17.03 22.6c-6.03 0-9.47-4.13-9.61-11.01h3.02c.1 5.05 2.33 7.18 4.09 7.62v-7.62h2.85v4.36c1.74-.19 3.57-2.17 4.19-4.36h2.84c-.47 2.69-2.46 4.67-3.87 5.49 1.41.66 3.68 2.4 4.54 5.52h-3.13c-.67-2.09-2.35-3.71-4.57-3.93v3.93h-.35Z"
        fill="#fff"
      />
    </svg>
  );
}
