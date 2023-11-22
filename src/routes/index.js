/**
 * Internal dependencies
 */
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import Settings from '../pages/Settings';
import General from '../pages/settings/General';

const routes = [
	{
		path: '/',
		element: Dashboard,
	},
	{
		path: '/inventory',
		element: Inventory,
	},
	{
		path: '/settings/general',
		element: Settings,
	},
	{
		path: '/settings/general',
		element: General,
	},
];

export default routes;
