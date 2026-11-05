/** Formatting helpers shared across pages and tables. */

/** Date + time, displayed in UTC to match database storage. */
export function formatDateTime(
	dateString: string | null | undefined,
	fallback = 'Not set'
): string {
	if (!dateString) return fallback;
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'UTC'
	});
}

/** Date only, displayed in UTC. */
export function formatDate(dateString: string | null | undefined, fallback = 'Not set'): string {
	if (!dateString) return fallback;
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

/** ISO string -> value for an <input type="datetime-local">, treating the stored time as UTC. */
export function toDateTimeInputValue(dateString: string | null | undefined): string {
	if (!dateString) return '';
	const date = new Date(dateString);
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(
		date.getUTCHours()
	)}:${pad(date.getUTCMinutes())}`;
}

/** <input type="datetime-local"> value -> ISO string, treating the input as UTC. */
export function fromDateTimeInputValue(inputValue: string): string | null {
	if (!inputValue) return null;
	return new Date(inputValue + 'Z').toISOString();
}

/** Date string -> timestamp for sorting (missing dates sort first). */
export function dateSortValue(dateString: string | null | undefined): number {
	return dateString ? new Date(dateString).getTime() : 0;
}

/** "meeting_scheduled" -> "MEETING SCHEDULED" */
export function formatEnumLabel(value: string): string {
	return value.replaceAll('_', ' ').toUpperCase();
}

export function formatCurrency(amount: number | null | undefined, currency = 'GBP'): string {
	if (amount === null || amount === undefined) return '—';
	return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
}
