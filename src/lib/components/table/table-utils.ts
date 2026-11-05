import {
	ALL_FILTER_VALUE,
	type Column,
	type SortDirection,
	type SortValue,
	type TableFilter
} from './types';

export function isSortable<T>(column: Column<T>): boolean {
	return column.sortable ?? column.sortValue !== undefined;
}

function normalise(value: SortValue): string | number | null {
	if (value === null || value === undefined) return null;
	if (value instanceof Date) return value.getTime();
	if (typeof value === 'boolean') return value ? 1 : 0;
	return value;
}

/** Compare two sort values. Nulls sort before everything else in ascending order. */
export function compareValues(a: SortValue, b: SortValue): number {
	const left = normalise(a);
	const right = normalise(b);
	if (left === right) return 0;
	if (left === null) return -1;
	if (right === null) return 1;
	if (typeof left === 'string' && typeof right === 'string') {
		return left.localeCompare(right, undefined, { sensitivity: 'base', numeric: true });
	}
	return left < right ? -1 : left > right ? 1 : 0;
}

/** Returns a new array sorted by the given column (stable, does not mutate). */
export function sortRows<T>(
	rows: T[],
	column: Column<T> | undefined,
	direction: SortDirection
): T[] {
	if (!column || !isSortable(column)) return rows;
	const getValue = column.sortValue ?? ((row: T) => column.value?.(row) as SortValue);
	const factor = direction === 'asc' ? 1 : -1;
	return rows
		.map((row, index) => ({ row, index, value: getValue(row) }))
		.sort((a, b) => compareValues(a.value, b.value) * factor || a.index - b.index)
		.map(({ row }) => row);
}

/** Collect the searchable text for a row from all searchable columns. */
export function getSearchText<T>(row: T, columns: Column<T>[]): string[] {
	const parts: string[] = [];
	for (const column of columns) {
		if (!column.searchValue) continue;
		const raw =
			column.searchValue === true
				? (column.format?.(row) ?? column.value?.(row))
				: column.searchValue(row);
		const values = Array.isArray(raw) ? raw : [raw];
		for (const value of values) {
			if (value !== null && value !== undefined && value !== '') parts.push(String(value));
		}
	}
	return parts;
}

export interface FilterRowsOptions<T> {
	query: string;
	columns: Column<T>[];
	filters?: TableFilter<T>[];
	filterValues?: Record<string, string>;
}

/** Apply the search query and every active dropdown filter. */
export function filterRows<T>(
	rows: T[],
	{ query, columns, filters = [], filterValues = {} }: FilterRowsOptions<T>
): T[] {
	const needle = query.trim().toLowerCase();
	const activeFilters = filters.filter((filter) => {
		const value = filterValues[filter.id];
		return value !== undefined && value !== ALL_FILTER_VALUE;
	});

	if (!needle && activeFilters.length === 0) return rows;

	return rows.filter((row) => {
		const matchesQuery =
			!needle || getSearchText(row, columns).some((text) => text.toLowerCase().includes(needle));
		if (!matchesQuery) return false;
		return activeFilters.every((filter) => filter.match(row, filterValues[filter.id]));
	});
}

/** Default text for a cell when no custom snippet is supplied. */
export function getCellText<T>(row: T, column: Column<T>): string {
	if (column.format) return column.format(row);
	const value = column.value?.(row);
	if (value === null || value === undefined || value === '') return '—';
	return String(value);
}
