<script>
	// Store
	import { canvasObj } from "./stores.js"
	
	// Components
	import CanvasGenerator from "./CanvasGenerator.svelte";
	import ColorPalette from "./ColorPalette.svelte";
	import ToolSizeSelector from "./ToolSizeSelector.svelte";
	import ToolTypeSelector from "./ToolTypeSelector.svelte";
	import PixelCanvas from "./PixelCanvas.svelte";
	import Copier from "./Copier.svelte";
	
	function copyCanvas() {
		const copier = new Copier({
			target: document.getElementById('clipboard'),
			props: {matrix: $canvasObj.matrix, width: $canvasObj.width, height: $canvasObj.height}
		});
		copier.$destroy();
		alert("Canvas properties copied to clipboard")
	}
	
	async function onImportJSON(e) {
		const file = e.target.files[0];
		if (file == null) {
			json = null;
			return;
		}

		let canvasFromJSON = await readJsonFile(file);
		try{
			if(canvasFromJSON.matrix.length === canvasFromJSON.height && canvasFromJSON.matrix[0].length === canvasFromJSON.width){
				$canvasObj.matrix = canvasFromJSON.matrix;
				$canvasObj.width = canvasFromJSON.width;
				$canvasObj.height = canvasFromJSON.height;
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
	<CanvasGenerator/>
	
	{#if $canvasObj.matrix.length > 0}
		<div class="container">
			<ColorPalette/>
			<div id="canvasTools">
                <ToolSizeSelector/>
                <ToolTypeSelector/>
			</div>
		</div>
		<PixelCanvas/>
	
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