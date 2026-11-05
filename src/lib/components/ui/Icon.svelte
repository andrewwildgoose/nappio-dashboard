<script lang="ts">
	import { icons, type IconName } from './icons';

	let { name, class: className = 'h-5 w-5' }: { name: IconName; class?: string } = $props();
</script>

<svg
	class={className}
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
	stroke-width="2"
	aria-hidden="true"
>
	<path stroke-linecap="round" stroke-linejoin="round" d={icons[name]} />
</svg>
