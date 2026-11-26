import type { Snippet } from 'svelte';

export type SortDirection = 'asc' | 'desc';
export type SortValue = string | number | boolean | Date | null | undefined;

/**
 * Describes one column of a <DataTable>.
 *
 * Only `id` and `header` are required. Everything else is opt-in:
 *  - `value`       what to show in the cell (and the default for sorting/searching)
 *  - `format`      turns the row into display text, if `value` alone isn't enough
 *  - `cell`        a snippet for fully custom cell content (badges, buttons, inputs...)
 *  - `sortValue`   makes the column sortable using this value
 *  - `searchValue` makes the column searchable by the table's search box
 */
export interface Column<T> {
	/** Unique id for the column (used for sorting state and keys). */
	id: string;
	/** Header text. */
	header: string;
	/** Optional smaller text shown under the header. */
	subheader?: string;
	/** Raw value for the cell. Used for display when no `format`/`cell` is given. */
	value?: (row: T) => unknown;
	/** Format the cell as text. Takes precedence over `value` for display. */
	format?: (row: T) => string;
	/** Custom cell renderer. Takes precedence over `format` and `value`. */
	cell?: Snippet<[T]>;
	/**
	 * Value used for sorting. If omitted but `sortable` is true, `value` is used.
	 * Return numbers for dates (e.g. `getTime()`) to get chronological ordering.
	 */
	sortValue?: (row: T) => SortValue;
	/** Explicitly enable/disable sorting. Defaults to true when `sortValue` is set. */
	sortable?: boolean;
	/**
	 * Text (or several pieces of text) the search box should match for this column.
	 * Use `true` to search the column's `value`/`format` output.
	 */
	searchValue?: ((row: T) => string | null | undefined | (string | null | undefined)[]) | true;
	/** Extra classes for the <td>. */
	class?: string;
	/** Extra classes for the <th>. */
	headerClass?: string;
}

export interface FilterOption {
	value: string;
	label: string;
}

/**
 * A dropdown filter shown next to the search box.
 * `match` decides whether a row is included for the selected option value.
 */
export interface TableFilter<T> {
	id: string;
	/** Accessible label for the select. */
	label: string;
	/** Label of the "no filter" option. Defaults to "All". */
	allLabel?: string;
	options: FilterOption[];
	match: (row: T, value: string) => boolean;
}

export interface SortState {
	columnId: string | null;
	direction: SortDirection;
}

/** Sentinel value used by filters for "show everything". */
export const ALL_FILTER_VALUE = '__all__';
