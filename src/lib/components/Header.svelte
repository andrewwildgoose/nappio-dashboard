<script lang="ts">
	import { page } from '$app/state';
	import { user } from '$lib/stores/auth';
	import { enhance } from '$app/forms';
</script>

<header class="px-3 py-3">
	<div class="mx-auto flex max-w-7xl items-center justify-between rounded-lg border-primary border-1">
		<div class="flex flex-1 items-center bg-primary px-3 py-1 rounded-l-md justify-center">
			<span class="self-center whitespace-nowrap flex items-center gap-1">
				<img 
					src="/images/logos/Nappio-v3-Clear.png" 
					alt="Nappio clear logo" 
					class="h-auto w-24 object-contain">
			</span>
			<span class="ml-2 text-lg font-bold text-darkgrey">Admin Dashboard</span>
		</div>

		<nav class="flex flex-1 space-x-8 justify-center text-colour-text">
			{#if user}
				<a href="/" class="nav-link px-6 py-3 {page.url.pathname === '/' ? 'active' : ''}"> Dashboard </a>
			{:else}
				<a href="/auth" class="nav-link px-6 py-3{page.url.pathname === '/auth' ? 'active' : ''}"> Sign In </a>
			{/if}
		</nav>

		<div class="flex flex-1 items-center space-x-4 justify-center">
			{#if user}
				<span class="text-sm">Welcome, {user.email}</span>
				<form method="POST" action="/auth?/signout" use:enhance>
					<button type="submit" class="text-sm font-bold hover:text-accent border-1 border-accent px-6 py-3 rounded-md hover:bg-lightgrey transition-colors hover:cursor-pointer">
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
		color: #f4f3ed;
		font-weight: 600;
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		border: 1px solid #7cc4a7;
	}

	.nav-link:hover {
		color: #7cc4a7;
		background-color: #333132;
	}

	.nav-link.active {
		color: #7cc4a7;
	}
</style>
