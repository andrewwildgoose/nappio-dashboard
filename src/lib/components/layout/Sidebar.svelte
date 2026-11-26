<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { navigation, isActive, type NavSection } from '$lib/config/navigation';
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		sections?: NavSection[];
		/** Mobile only: whether the menu drawer is open. */
		open?: boolean;
		onNavigate?: () => void;
	}

	let { sections = navigation, open = false, onNavigate }: Props = $props();
</script>

<nav class="sidebar" class:open aria-label="Dashboard menu">
	{#each sections as section (section.title)}
		<div class="mb-6">
			<h2 class="mb-2 px-3 text-xs font-bold tracking-wider text-secondary uppercase">
				{section.title}
			</h2>
			<ul class="flex flex-col gap-1">
				{#each section.items as item (item.href)}
					{@const active = isActive(item, page.url.pathname)}
					<li>
						<a
							href={resolve(item.href)}
							title={item.description}
							aria-current={active ? 'page' : undefined}
							class="nav-item"
							class:active
							onclick={onNavigate}
						>
							<Icon name={item.icon} />
							<span>{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>

<style>
	.sidebar {
		display: none;
		padding: 1rem 0.75rem;
	}

	.sidebar.open {
		display: block;
		border-bottom: 1px solid var(--color-border);
	}

	@media (min-width: 768px) {
		.sidebar,
		.sidebar.open {
			display: block;
			flex: 0 0 14rem;
			width: 14rem;
			border-bottom: none;
			border-right: 1px solid var(--color-border);
		}
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid transparent;
		color: var(--color-text);
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.nav-item:hover {
		color: var(--color-tertiary);
		background-color: var(--color-lightgrey);
		text-decoration: none;
	}

	.nav-item.active {
		color: var(--color-tertiary);
		background-color: var(--color-lightgrey);
		border-color: var(--color-tertiary);
	}
</style>
