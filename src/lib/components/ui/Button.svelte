<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'secondary' | 'primary' | 'tertiary' | 'accent';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		children: Snippet;
	}

	let {
		variant = 'secondary',
		type = 'button',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		secondary: 'text-white border-secondary hover:text-secondary',
		primary: 'text-primary border-primary',
		tertiary: 'text-tertiary border-tertiary',
		accent: 'text-white border-accent hover:text-accent'
	};
</script>

<button
	{type}
	class="rounded-md border-1 px-4 py-2 font-medium transition-colors hover:cursor-pointer hover:bg-lightgrey disabled:opacity-50 {variants[
		variant
	]} {className}"
	{...rest}
>
	{@render children()}
</button>
