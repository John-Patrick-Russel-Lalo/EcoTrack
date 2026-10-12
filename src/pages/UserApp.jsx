import AppShell from '../components/AppShell';
import StatusSheet from '../components/StatusSheet';
import AboutPanel from '../components/panels/AboutPanel';
import BinsPanel from '../components/panels/BinsPanel';
import UserToolsPanel from '../components/panels/UserToolsPanel';
import { InfoIcon, ListIcon, MapIcon, SlidersIcon } from '../components/icons';
import useRoleTheme from '../hooks/useRoleTheme';

const tabs = [
  { key: 'map', label: 'Map', icon: MapIcon },
  {
    key: 'bins',
    label: 'Bins',
    icon: ListIcon,
    title: 'Bins around you',
    render: (goToTab) => <BinsPanel onNavigate={goToTab} />,
  },
  {
    key: 'tools',
    label: 'Tools',
    icon: SlidersIcon,
    title: 'Resident tools',
    render: (goToTab) => <UserToolsPanel onNavigate={goToTab} />,
  },
  {
    key: 'about',
    label: 'About',
    icon: InfoIcon,
    title: 'About EcoTrack',
    render: () => <AboutPanel role="user" />,
  },
];

export default function UserApp() {
  useRoleTheme('user');
  return <AppShell role="user" tabs={tabs} overlays={<StatusSheet role="user" />} />;
}
