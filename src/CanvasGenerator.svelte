<script>
	export let pixelMatrix;
	export let canvasHeight;
	export let canvasWidth;
	let isDimensionsLocked = true;
	const MIN_INPUT = 1;
	const MAX_INPUT = 100;
	
	function toggleLock(){
		isDimensionsLocked = !isDimensionsLocked
	}
	
	function validateClear(){
		const isClearing = confirm("Clear the canvas?")
		if(isClearing){
			generatePixelMatrix();
		}
	}
	
	function generatePixelMatrix(){
			const newPixelMatrix = new Array(canvasHeight);
			for(let h = 0; h < canvasHeight; h++){
				newPixelMatrix[h] = (new Array(canvasWidth));
				for(let w = 0; w < canvasWidth; w++){
					newPixelMatrix[h][w] = {
						x: w, 
						y: h,
						color: "white"
					}
				} 
			}
			pixelMatrix = newPixelMatrix
	}
	generatePixelMatrix()
</script>

<div id="canvasGeneration">
	<div id="heightInputWrapper">
		<span>Height</span>
		<input 
			disabled={isDimensionsLocked} 
			bind:value={canvasHeight} 
			type=range 
			min={MIN_INPUT} 
			max={MAX_INPUT} 
			on:change={generatePixelMatrix}>
		<span class="dimensionText">{canvasHeight}</span>
	</div>
	<div id="widthInputWrapper">
		<span>Width</span>
		<input 
			disabled={isDimensionsLocked} 
			bind:value={canvasWidth} 
			type=range 
			min={MIN_INPUT} 
			max={MAX_INPUT} 
			on:change={generatePixelMatrix}>
		<span class="dimensionText">{canvasWidth}</span>
	</div>
	<button id="lockBtn" on:click={toggleLock}>
		{isDimensionsLocked ? "Unlock" : "Lock"}
	</button>
	<button id="clearBtn" on:click={validateClear}>
		Clear
	</button>
</div>

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