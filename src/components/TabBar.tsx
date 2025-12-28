/**
 * TabBar Component
 * 
 * Bottom navigation with three tabs: Dashboard, Log, Overview.
 * 
 * TypeScript Concepts:
 * - Array of tab configurations
 * - NavLink isActive callback for dynamic styling
 */

import { NavLink } from 'react-router-dom';
import { LayoutGrid, PlusCircle, BarChart3 } from 'lucide-react';

// Tab configuration following the spec
const tabs = [
  { id: 'dashboard', label: 'Dashboard', path: '/', Icon: LayoutGrid },
  { id: 'log', label: 'Log', path: '/log', Icon: PlusCircle },
  { id: 'overview', label: 'Overview', path: '/overview', Icon: BarChart3 },
] as const;

/**
 * TabBar - Fixed bottom navigation
 * 
 * Uses NavLink from React Router for automatic active state detection.
 */
function TabBar() {
  return (
    <nav className="tab-bar">
      {tabs.map(({ id, label, path, Icon }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
          end={path === '/'}
        >
          <span className="tab-icon">
            <Icon />
          </span>
          <span className="tab-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default TabBar;
