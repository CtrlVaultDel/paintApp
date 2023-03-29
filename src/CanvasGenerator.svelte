<script>
	// Store
	import { canvasObj } from "./stores.js";
			
	// Local variables
	let isDimensionsLocked = true;
	const MIN_INPUT = 1;
	const MAX_INPUT = 100;
	
	function toggleLock(){
		isDimensionsLocked = !isDimensionsLocked
	}
	
	function validateClear(){
		const isClearing = confirm("Clear the canvas?")
		if(isClearing){
			canvasObj.generateCanvas();
		}
	}
	
	$: canvasObj !== null ? canvasObj.generateCanvas() : null
</script>
{#if $canvasObj === undefined}
	<div>
		 Loading
	</div>
{:else}
	<div id="canvasGeneration">
	<div id="heightInputWrapper">
		<span>Height</span>
		<input 
			disabled={isDimensionsLocked} 
			bind:value={$canvasObj.height} 
			type=range 
			min={MIN_INPUT} 
			max={MAX_INPUT}
			on:change={() => canvasObj.generateCanvas()}>
		<span class="dimensionText">{$canvasObj.height}</span>
	</div>
	<div id="widthInputWrapper">
		<span>Width</span>
		<input 
			disabled={isDimensionsLocked} 
			bind:value={$canvasObj.width} 
			type=range 
			min={MIN_INPUT} 
			max={MAX_INPUT} 
			on:change={() => canvasObj.generateCanvas()}>
		<span class="dimensionText">{$canvasObj.width}</span>
	</div>
	<button id="lockBtn" on:click={toggleLock}>
		{isDimensionsLocked ? "Unlock" : "Lock"}
	</button>
	<button id="clearBtn" on:click={validateClear}>
		Clear
	</button>
</div>
{/if}

<style>
	#canvasGeneration{
		display: flex;
		align-items: center;
	}
	
	#heightInputWrapper, #widthInputWrapper{
		display: flex;
		align-items: center;
	}
	
	#heightInputWrapper, #widthInputWrapper, #lockBtn, #clearBtn{
		margin: 5px;
		padding: 5px;
		border-radius: 5px;
		border: solid black 1px;
	}
	
	#canvasGeneration input{
		margin: 0 5px;
		padding: 0;
	}
	
	.dimensionText{
		width: 28px;
	}
	
	#lockBtn, #clearBtn{
		width: 70px;
	}
</style>