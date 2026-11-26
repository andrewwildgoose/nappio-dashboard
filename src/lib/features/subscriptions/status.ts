import { PUBLIC_ACTION_STATUSES } from '$env/static/public';
import type { SubscriptionStatus } from '$lib/types/api';
import { formatEnumLabel } from '$lib/utils/format';

/** All statuses, in the order a subscription moves through them. */
export const statusOptions: SubscriptionStatus[] = [
	'pending',
	'setup_paid',
	'meeting_scheduled',
	'checkout_sent',
	'active',
	'canceled'
];

export const statusLabel = formatEnumLabel;

export function statusSortValue(status: SubscriptionStatus): number {
	return statusOptions.indexOf(status);
}

export function statusBadgeClass(status: SubscriptionStatus): string {
	switch (status) {
		case 'active':
			return 'bg-green-100 text-green-800';
		case 'pending':
			return 'bg-yellow-100 text-yellow-800';
		case 'setup_paid':
			return 'bg-blue-100 text-blue-800';
		case 'meeting_scheduled':
			return 'bg-purple-100 text-purple-800';
		case 'checkout_sent':
			return 'bg-orange-100 text-orange-800';
		case 'canceled':
			return 'bg-red-100 text-red-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}

/** Statuses the team is allowed to action (configured via PUBLIC_ACTION_STATUSES). */
const actionStatuses = (PUBLIC_ACTION_STATUSES ?? '')
	.split(',')
	.map((status) => status.trim())
	.filter(Boolean);

export function canAction(status: SubscriptionStatus): boolean {
	return actionStatuses.includes(status);
}
