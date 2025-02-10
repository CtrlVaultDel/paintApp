<script>
	import { onMount } from 'svelte';

	export let matrix;
    export let width;
    export let height; 
	let textarea;
	
	let canvasJSON = JSON.stringify({matrix, width, height});
	
	onMount(() => {
		textarea.select();
		document.execCommand('copy');
	});
</script>

<textarea bind:value={canvasJSON} bind:this={textarea}></textarea>