<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		/** Buttons or other controls shown under the title. */
		actions?: Snippet;
	}

	let { title, description, actions }: Props = $props();
</script>

<div class="mb-8">
	<h1 class="mb-2 text-3xl font-bold">{title}</h1>
	{#if description}
		<p class="mb-6">{description}</p>
	{/if}
	{#if actions}
		<div class="flex flex-wrap gap-3 md:flex-nowrap">
			{@render actions()}
		</div>
	{/if}
</div>
