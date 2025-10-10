<script lang="ts">
	import { page } from '$app/state';
	import { user } from '$lib/stores/auth';
	import { enhance } from '$app/forms';
</script>

<header class="border-b border-gray-200 px-6 py-4">
	<div class="mx-auto flex max-w-7xl items-center justify-between">
		<div class="flex items-center">
			<h1 class="text-2xl font-bold">Nappio</h1>
			<span class="ml-2 text-sm">Admin Dashboard</span>
		</div>

		<nav class="flex space-x-8">
			{#if user}
				<a href="/" class="nav-link {page.url.pathname === '/' ? 'active' : ''}"> Dashboard </a>
			{:else}
				<a href="/auth" class="nav-link {page.url.pathname === '/auth' ? 'active' : ''}"> Sign In </a>
			{/if}
		</nav>

		<div class="flex items-center space-x-4">
			{#if user}
				<span class="text-sm">Welcome, {user.email}</span>
				<form method="POST" action="/auth?/signout" use:enhance>
					<button type="submit" class="text-sm text-accent border-1 border-accent px-3 py-1 rounded-md hover:bg-lightgrey transition-colors hover:cursor-pointer">
						Sign Out
					</button>
				</form>
			{:else}
				<div class="text-sm text-gray-500">Team Portal</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.nav-link {
		color: #6b7280;
		font-weight: 500;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.nav-link:hover {
		color: #7cc4a7;
		border: 1px solid #7cc4a7;
		background-color: #333132;
	}

	.nav-link.active {
		color: #7cc4a7;
		border: 1px solid #7cc4a7;
		/* background-color: #dbeafe; */
		font-weight: 600;
	}
</style>
