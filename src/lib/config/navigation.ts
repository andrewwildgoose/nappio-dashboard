import type { Pathname } from '$app/types';
import type { IconName } from '$lib/components/ui/icons';

/**
 * The dashboard menu.
 *
 * To add a page:
 *   1. Create `src/routes/(app)/<your-page>/+page.svelte`
 *   2. Add an item below with `href: '/<your-page>'`
 *
 * Pages inside `src/routes/(app)/` automatically get the sidebar menu and
 * require a signed-in team member.
 */
export interface NavItem {
	label: string;
	/** Typed against the real routes, so a typo or missing page fails `npm run check`. */
	href: Pathname;
	icon: IconName;
	description?: string;
}

export interface NavSection {
	title: string;
	items: NavItem[];
}

export const navigation: NavSection[] = [
	{
		title: 'Customers',
		items: [
			{
				label: 'Subscriptions',
				href: '/subscriptions',
				icon: 'subscriptions',
				description: 'Track subscription progress and schedule customer meetings'
			}
		]
	}
];

/** Where `/` (and successful sign-in) lands. */
export const defaultRoute: Pathname = navigation[0].items[0].href;

export function isActive(item: NavItem, pathname: string): boolean {
	return pathname === item.href || pathname.startsWith(item.href + '/');
}
