<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Tailwind colour classes, e.g. "bg-green-100 text-green-800". */
		class?: string;
		children: Snippet;
	}

	let { class: className = 'bg-gray-100 text-gray-800', children }: Props = $props();
</script>

<span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {className}">
	{@render children()}
</span>
