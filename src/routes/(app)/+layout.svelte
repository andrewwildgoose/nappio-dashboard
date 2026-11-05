<!--
	Shell for every signed-in page: sidebar menu + page content.
	Add new pages as folders inside `src/routes/(app)/` and register them in
	`$lib/config/navigation.ts`.
-->
<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { children } = $props();
	let menuOpen = $state(false);
</script>

<div class="app-shell">
	<div class="px-4 pt-2 md:hidden">
		<button
			type="button"
			class="flex items-center gap-2 rounded-md border-1 border-tertiary px-4 py-2 font-semibold hover:cursor-pointer hover:bg-lightgrey"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<Icon name={menuOpen ? 'close' : 'menu'} />
			Menu
		</button>
	</div>

	<Sidebar open={menuOpen} onNavigate={() => (menuOpen = false)} />

	<div class="page-content">
		{@render children()}
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.page-content {
		flex: 1;
		min-width: 0;
		padding: 1rem;
	}

	@media (min-width: 768px) {
		.app-shell {
			flex-direction: row;
		}

		.page-content {
			padding: 2rem;
		}
	}
</style>
