<!-- A titled block on a page: wrap a table, chart, form etc. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		actions?: Snippet;
		children: Snippet;
	}

	let { title, description, actions, children }: Props = $props();
</script>

<section class="mb-8">
	{#if title || actions}
		<div class="mb-3 flex flex-wrap items-end justify-between gap-3">
			<div>
				{#if title}<h2 class="text-xl font-semibold">{title}</h2>{/if}
				{#if description}<p class="text-sm opacity-80">{description}</p>{/if}
			</div>
			{@render actions?.()}
		</div>
	{/if}
	{@render children()}
</section>
