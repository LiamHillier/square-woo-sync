import { useState } from '@wordpress/element';
import { Dialog, Switch } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/20/solid';
import {
	BellIcon,
	Cog8ToothIcon,
	CreditCardIcon,
	CubeIcon,
	FingerPrintIcon,
	UserCircleIcon,
	UsersIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '../../utils/classHelper';
import { Link } from 'react-router-dom';
import AccessToken from '../../components/features/settings/general/AccessToken';
import Webhook from '../../components/features/settings/general/Webhook';

const navigation = [
	{ name: 'Home', href: '#' },
	{ name: 'Invoices', href: '#' },
	{ name: 'Clients', href: '#' },
	{ name: 'Expenses', href: '#' },
];
const secondaryNavigation = [
	{
		name: 'General',
		href: '/settings/general',
		icon: Cog8ToothIcon,
		current: true,
	},
	//   { name: "Security", href: "#", icon: FingerPrintIcon, current: false },
	//   { name: "Notifications", href: "#", icon: BellIcon, current: false },
	//   { name: "Plan", href: "#", icon: CubeIcon, current: false },
	//   { name: "Billing", href: "#", icon: CreditCardIcon, current: false },
	//   { name: "Team members", href: "#", icon: UsersIcon, current: false },
];

export default function Settings() {
	const [ mobileMenuOpen, setMobileMenuOpen ] = useState( false );
	const [ automaticTimezoneEnabled, setAutomaticTimezoneEnabled ] =
		useState( true );

	return (
		<>
			<div className="lg:flex lg:gap-x-16 bg-white rounded-2xl shadow-lg p-6">
				<aside className="flex border-b border-gray-900/5 lg:block lg:w-64 lg:flex-none lg:border-0 ">
					<nav className="flex-none px-4 sm:px-6 lg:px-0">
						<ul
							role="list"
							className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
						>
							{ secondaryNavigation.map( ( item ) => (
								<li key={ item.name }>
									<Link
										to={ item.href }
										className={ classNames(
											item.current
												? 'bg-gray-50 text-indigo-600'
												: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
											'group flex gap-x-3 rounded-lg py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
										) }
									>
										<item.icon
											className={ classNames(
												item.current
													? 'text-indigo-600'
													: 'text-gray-400 group-hover:text-indigo-600',
												'h-6 w-6 shrink-0'
											) }
											aria-hidden="true"
										/>
										{ item.name }
									</Link>
								</li>
							) ) }
						</ul>
					</nav>
				</aside>

				<main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
					<AccessToken />
					<Webhook />
				</main>
			</div>
		</>
	);
}
