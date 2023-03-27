<script>
	import { onMount } from 'svelte';

	export let canvasObj;
	let textarea;
	
	let canvasJSON = JSON.stringify(canvasObj);
	
	onMount(() => {
		textarea.select();
		document.execCommand('copy');
	});
</script>

<textarea bind:value={canvasJSON} bind:this={textarea}></textarea>