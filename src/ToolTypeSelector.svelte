<script>
	import { canvasObj } from "./stores.js"
	
	let toolOptions = [
		{
			text: "paint",
			tool: "paint"
		},
		{
			text: "fill",
			tool: "fill"
		},
		{
			text: "line",
			tool: "line"
		}, 
		{
			text: "box",
			tool: "box"
		}
	]
</script>

<div id="toolContainer">
	<label id="toolSelectorLabel" for="toolSelector">Tool: </label>
	<select id="toolSelector" bind:value={$canvasObj.toolType}>
		{#each toolOptions as {tool, text}}
			<option value={tool}>{text}</option>
		{/each}
	</select>
</div>

<style>
	#toolContainer{
		border-top: solid black 1px;
		border-right: solid black 1px;
		border-bottom: solid black 1px;
		padding: 5px;
	}
	
	#toolSelectorLabel{
		font-size: 12px
	}
	
	#toolSelector{
		padding: 0;
		margin: 0;
	}
</style>