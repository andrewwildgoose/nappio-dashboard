<!-- Label/value pairs, e.g. for confirmation dialogs or record detail panels. -->
<script module lang="ts">
	export interface DetailItem {
		label: string;
		value: string | number | null | undefined;
	}
</script>

<script lang="ts">
	let { items }: { items: DetailItem[] } = $props();
</script>

<dl class="detail-list">
	{#each items as item (item.label)}
		<div class="detail-group">
			<dt class="detail-label">{item.label}:</dt>
			<dd class="detail-value">{item.value ?? '—'}</dd>
		</div>
	{/each}
</dl>

<style>
	.detail-list {
		display: grid;
		gap: 1rem;
		margin: 0;
	}

	.detail-group {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.75rem;
		align-items: center;
	}

	.detail-label {
		font-weight: 600;
		color: #7cc4a7;
		font-size: 0.875rem;
		min-width: 120px;
	}

	.detail-value {
		color: #f4f3ed;
		font-size: 0.875rem;
		margin: 0;
	}
</style>
