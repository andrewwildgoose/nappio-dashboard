<!--
	Generic searchable / filterable / sortable table.

	Usage:
		<DataTable
			rows={customers}
			columns={columns}
			rowKey={(row) => row.id}
			itemLabel="customers"
			searchPlaceholder="Search customers..."
			filters={[statusFilter]}
		/>

	See `./types.ts` for the column and filter definitions.
-->
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { ALL_FILTER_VALUE, type Column, type SortState, type TableFilter } from './types';
	import { filterRows, getCellText, isSortable, sortRows } from './table-utils';

	interface Props {
		rows: T[];
		columns: Column<T>[];
		rowKey: (row: T) => string | number;
		filters?: TableFilter<T>[];
		/** Set to false to hide the search box. */
		searchable?: boolean;
		searchPlaceholder?: string;
		/** Plural noun used in the "Showing X of Y ..." counter. */
		itemLabel?: string;
		emptyMessage?: string;
		noMatchesMessage?: string;
		initialSort?: SortState;
		rowClass?: (row: T) => string;
		/** Extra controls rendered on the right of the toolbar (e.g. export buttons). */
		toolbar?: Snippet;
	}

	let {
		rows = [],
		columns,
		rowKey,
		filters = [],
		searchable = true,
		searchPlaceholder = 'Search...',
		itemLabel = 'items',
		emptyMessage = `No ${itemLabel} available.`,
		noMatchesMessage = `No ${itemLabel} match your filters.`,
		initialSort = { columnId: null, direction: 'asc' },
		rowClass,
		toolbar
	}: Props = $props();

	let query = $state('');
	let filterValues = $state<Record<string, string>>({});
	let sort = $state<SortState>({ ...initialSort });

	const isFiltered = $derived(
		query.trim() !== '' ||
			Object.values(filterValues).some((value) => value && value !== ALL_FILTER_VALUE)
	);

	const visibleRows = $derived.by(() => {
		const filtered = filterRows(rows, { query, columns, filters, filterValues });
		const sortColumn = columns.find((column) => column.id === sort.columnId);
		return sortRows(filtered, sortColumn, sort.direction);
	});

	function toggleSort(column: Column<T>) {
		if (!isSortable(column)) return;
		if (sort.columnId === column.id) {
			sort.direction = sort.direction === 'asc' ? 'desc' : 'asc';
		} else {
			sort = { columnId: column.id, direction: 'asc' };
		}
	}

	function sortIcon(column: Column<T>) {
		if (sort.columnId !== column.id) return '⇅';
		return sort.direction === 'asc' ? '↑' : '↓';
	}

	function ariaSort(column: Column<T>) {
		if (sort.columnId !== column.id) return 'none';
		return sort.direction === 'asc' ? 'ascending' : 'descending';
	}

	const inputClass =
		'rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary';
</script>

<div class="data-table">
	<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
			{#if searchable}
				<input
					type="search"
					placeholder={searchPlaceholder}
					aria-label={searchPlaceholder}
					bind:value={query}
					class="{inputClass} sm:min-w-80"
				/>
			{/if}
			{#each filters as filter (filter.id)}
				<select
					aria-label={filter.label}
					value={filterValues[filter.id] ?? ALL_FILTER_VALUE}
					onchange={(e) => (filterValues[filter.id] = e.currentTarget.value)}
					class={inputClass}
				>
					<option value={ALL_FILTER_VALUE}>{filter.allLabel ?? 'All'}</option>
					{#each filter.options as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{/each}
		</div>
		<div class="flex items-center gap-4">
			<div class="text-sm">
				Showing {visibleRows.length} of {rows.length}
				{itemLabel}
			</div>
			{@render toolbar?.()}
		</div>
	</div>

	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-border">
			<thead>
				<tr>
					{#each columns as column (column.id)}
						{@const sortable = isSortable(column)}
						<th
							scope="col"
							aria-sort={sortable ? ariaSort(column) : undefined}
							class="text-s px-4 py-3 text-left font-bold tracking-wider whitespace-nowrap uppercase {column.headerClass ??
								''}"
							class:sortable
						>
							{#if sortable}
								<button
									type="button"
									class="flex w-full items-center justify-between gap-2 text-left uppercase"
									onclick={() => toggleSort(column)}
								>
									<span>
										{column.header}
										{#if column.subheader}
											<span class="block text-xs normal-case">{column.subheader}</span>
										{/if}
									</span>
									<span class="ml-2 text-gray-400" aria-hidden="true">{sortIcon(column)}</span>
								</button>
							{:else}
								{column.header}
								{#if column.subheader}
									<span class="block text-xs normal-case">{column.subheader}</span>
								{/if}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				{#each visibleRows as row (rowKey(row))}
					<tr class="hover:bg-lightgrey {rowClass?.(row) ?? ''}">
						{#each columns as column (column.id)}
							<td class="px-4 py-4 text-sm whitespace-nowrap {column.class ?? ''}">
								{#if column.cell}
									{@render column.cell(row)}
								{:else}
									{getCellText(row, column)}
								{/if}
							</td>
						{/each}
					</tr>
				{:else}
					<tr>
						<td colspan={columns.length} class="px-4 py-4 text-center">
							{isFiltered ? noMatchesMessage : emptyMessage}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.data-table {
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
		padding: 1rem;
	}

	th.sortable {
		cursor: pointer;
		user-select: none;
	}

	th.sortable:hover {
		background-color: var(--color-lightgrey);
	}

	th button {
		cursor: pointer;
		font: inherit;
		letter-spacing: inherit;
		background: none;
		border: none;
		padding: 0;
		color: inherit;
	}
</style>
