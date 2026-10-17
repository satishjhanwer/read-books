import { Monitor, Moon, Sun } from 'lucide-react';
import { useIntl } from 'react-intl';

import { THEMES, setTheme, useTheme, type Theme } from '../lib/theme';

const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

/** One button that cycles system → light → dark; compact enough for the phone header. */
export function ThemeSwitcher() {
  const intl = useIntl();
  const theme = useTheme();
  const next: Theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length] ?? 'system';
  const Icon = ICONS[theme];
  const label = intl.formatMessage(
    { id: 'theme.label' },
    { theme: intl.formatMessage({ id: `theme.${theme}` }), next: intl.formatMessage({ id: `theme.${next}` }) },
  );

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next);
      }}
      aria-label={label}
      title={label}
      className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white">
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
