import { useSyncExternalStore } from 'react';

// Colour theme: follows the OS by default, or a stored light/dark override.
// index.html applies the same logic inline before first paint so there is no flash of the wrong theme;
// keep the storage key and class name in sync with that script.

export const THEMES = ['system', 'light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];
export const THEME_STORAGE_KEY = 'read-books:theme';

const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStored(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

let current: Theme = readStored();
const listeners = new Set<() => void>();

/** Mirrors the theme onto <html>: the `dark` class drives Tailwind's `dark:` variant. */
function apply(): void {
  const dark = current === 'dark' || (current === 'system' && darkQuery().matches);
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
}

function update(next: Theme): void {
  current = next;
  apply();
  for (const listener of listeners) listener();
}

export function setTheme(next: Theme): void {
  try {
    if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Preference just won't persist.
  }
  update(next);
}

/** Applies the theme and keeps it in sync with OS changes and other tabs. Call once at startup. */
export function initTheme(): () => void {
  apply();
  const query = darkQuery();
  const onSystemChange = () => {
    if (current === 'system') apply();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) update(readStored());
  };
  query.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);
  return () => {
    query.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorage);
  };
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getSnapshot = () => current;

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Test helper: forget the in-memory theme after localStorage has been cleared. */
export function resetForTests(): void {
  current = readStored();
  document.documentElement.classList.remove('dark');
  document.documentElement.style.colorScheme = '';
}
