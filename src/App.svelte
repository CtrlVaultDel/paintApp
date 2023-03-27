<script>
	// Components
	import CanvasGenerator from "./CanvasGenerator.svelte";
	import ColorPalette from "./ColorPalette.svelte";
	import ToolSizeSelector from "./ToolSizeSelector.svelte";
	import ToolTypeSelector from "./ToolTypeSelector.svelte";
	import PixelCanvas from "./PixelCanvas.svelte";
	import Copier from "./Copier.svelte";

	// Variables
	let pixelMatrix = [];
	let toolColor = "black";
	let toolSize = 0;
	let toolType = "paint";
	let canvasHeight = 50;
	let canvasWidth = 50;
	let importedJSON = ""
	
	function copyCanvas() {
		const canvasObj = {
				pixelMatrix,
				canvasHeight,
				canvasWidth
		}
		const app = new Copier({
			target: document.getElementById('clipboard'),
			props: {canvasObj}
		});
		app.$destroy();
		alert("Canvas properties copied to clipboard")
	}
	
	async function onImportJSON(e) {
		const file = e.target.files[0];
		if (file == null) {
			json = null;
			return;
		}

		let canvasObj = await readJsonFile(file);
		try{
			if(canvasObj.pixelMatrix.length === canvasObj.canvasHeight && canvasObj.pixelMatrix[0].length === canvasObj.canvasWidth){
				pixelMatrix = canvasObj.pixelMatrix;
				canvasWidth = canvasObj.canvasWidth;
				canvasHeight = canvasObj.canvasHeight;
			}
			else{
				alert("Improperly formatted JSON")
			}
		}
		catch(error){
			alert(`${e}: Improperly formatted JSON`)
		}
	}

	function readJsonFile(file) {
		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onload = () => resolve(JSON.parse(reader.result));
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}
</script>

<main>
	<CanvasGenerator bind:pixelMatrix={pixelMatrix} bind:canvasHeight={canvasHeight} bind:canvasWidth={canvasWidth}/>
	
	{#if pixelMatrix.length > 0}
		<div class="container">
			<ColorPalette bind:toolColor={toolColor} />
			<div id="canvasTools">
					<ToolSizeSelector bind:toolSize={toolSize}/>
					<ToolTypeSelector bind:toolType={toolType}/>
			</div>
		</div>
		<PixelCanvas 
			pixelMatrix={pixelMatrix} 
			toolColor={toolColor} 
			toolSize={toolSize}
			toolType={toolType}
			canvasWidth={canvasWidth} 
			canvasHeight={canvasHeight}/>
	
		<div id="shareSection">
			<button id="copyBtn" on:click={copyCanvas}>Copy Canvas</button>
			<div>
				<label for="jsonInput">Import Canvas (JSON):</label>
				<input id="jsonInput" type=file on:change={onImportJSON} accept=".json"/>
			</div>
			<div id="clipboard"></div>
		</div>
	{/if}
	
</main>

<style>
	main{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	
	.container{
		display: flex;
		align-items: center;
	}
	
	#canvasTools{
		display: flex;
		align-items: center;
		margin-left: 10px;
		display: flex;
		padding: 5px;
		border-radius: 5px
	}
	
	#copyBtn{
		padding: 8px;
    margin-right: 20px;
	}
	
	#shareSection{
		display: flex;
		justify-content: space-between;
		align-items: end;
		margin-top: 15px;
	}
</style>