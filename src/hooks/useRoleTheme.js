import { useEffect } from 'react';

export default function useRoleTheme(role = 'user') {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.role;
    root.dataset.role = role;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', role === 'driver' ? '#ca8a04' : '#16a34a');

    return () => {
      if (previous) root.dataset.role = previous;
      else delete root.dataset.role;
    };
  }, [role]);
}
