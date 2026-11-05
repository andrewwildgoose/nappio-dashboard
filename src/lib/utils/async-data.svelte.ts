/**
 * Small reactive wrapper for loading data on a page.
 *
 *   const subscriptions = createAsyncData(() => clientApi.getSubscriptions(), []);
 *   onMount(subscriptions.reload);
 *
 *   {#if subscriptions.isLoading} ... {subscriptions.data} ... {subscriptions.error}
 */
export function createAsyncData<T>(loader: () => Promise<T>, initialValue: T) {
	let data = $state<T>(initialValue);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	async function reload() {
		try {
			isLoading = true;
			error = null;
			data = await loader();
		} catch (err) {
			console.error('Error loading data:', err);
			error = err instanceof Error ? err.message : 'Unknown error occurred';
		} finally {
			isLoading = false;
		}
	}

	return {
		get data() {
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		reload
	};
}

export type AsyncData<T> = ReturnType<typeof createAsyncData<T>>;
