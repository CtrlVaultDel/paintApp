<script>
	export let toolSize;
	
	let sizeOptions = [
		{
			text: "small",
			size: 0
		},
		{
			text: "medium",
			size: 1
		},
		{
			text: "large",
			size: 2
		}
	]
</script>

<div id="sizeContainer">
	<label id="sizeSelectorLabel" for="sizeSelector">Size: </label>
	<select id="sizeSelector" bind:value={toolSize}>
		{#each sizeOptions as {size, text}}
		<option value={size}>{text}</option>
		{/each}	
	</select>
</div>

<style>	
	#sizeContainer{
		border: solid black 1px;
		padding: 5px;
	}
	
	#sizeSelectorLabel{
		font-size: 12px
	}
	
	#sizeSelector{
		padding: 0;
		margin: 0;
	}
</style>