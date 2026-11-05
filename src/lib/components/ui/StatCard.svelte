<script module lang="ts">
	export type StatTone = 'secondary' | 'tertiary' | 'accent' | 'accent2' | 'primary';
</script>

<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		tone?: StatTone;
	}

	let { label, value, tone = 'secondary' }: Props = $props();

	// Full class names so Tailwind can see them.
	const tones: Record<StatTone, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		tertiary: 'text-tertiary',
		accent: 'text-accent',
		accent2: 'text-accent2'
	};
</script>

<div class="stat-card">
	<h3 class="text-lg font-semibold">{label}</h3>
	<p class="text-3xl font-bold {tones[tone]}">{value}</p>
</div>

<style>
	.stat-card {
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		text-align: center;
	}
</style>
