<script>
	export let pixelMatrix;
	export let toolColor;
	export let toolSize;
	export let toolType;
	export let canvasWidth;
	export let canvasHeight;
	let currentX;
	let currentY;
	let isDraggingMouse = false;
	
	let matrixCopy = null; // For crating temp "ghost" shapes
	let lineStart = null;	// For line tool
	let boxStart = null; // For box tool
	
	// ========== FILL FUNCTIONS (start) ==========
	// Recursive function called within floodFillPixels
	function floodFillUtil(x, y, prevColor, newColor){
		// Base cases
		if (x < 0 || x >= pixelMatrix[0].length || y < 0 || y >= pixelMatrix.length) return;
		if (pixelMatrix[y][x].color != prevColor) return;

		// Replace the color at (x, y)
		pixelMatrix[y][x].color = newColor;

		floodFillUtil(x + 1, y, prevColor, newColor); // Recur for right
		floodFillUtil(x - 1, y, prevColor, newColor);	// Recur for left
		floodFillUtil(x, y + 1, prevColor, newColor); // Recur for below
		floodFillUtil(x, y - 1, prevColor, newColor); // Recur for above
	}
 
	function floodFillPixels(x, y, newColor) {
		let prevColor = pixelMatrix[y][x].color;
		if (prevColor == newColor) return;
		floodFillUtil(x, y, prevColor, newColor);
	}
		
	// ========== LINE FUNCTION (start) ==========
	function generateBresenhamLine(startX, startY, endX, endY) { 
    const deltaCol = Math.abs(endX - startX) // zero or positive number
    const deltaRow = Math.abs(endY - startY) // zero or positive number
 
    let pointX = startX
    let pointY = startY
    
    const horizontalStep = (startX < endX) ? 1 : -1 
    const verticalStep = (startY < endY) ? 1 : -1
    const points = [ ]
    
    let difference = deltaCol - deltaRow
    
    while (true) {
        const doubleDifference = 2 * difference // necessary to store this value
        
        if (doubleDifference > -deltaRow) { 
					difference -= deltaRow; 
					pointX += horizontalStep 
				}
        if (doubleDifference <  deltaCol) { 
					difference += deltaCol; 
					pointY += verticalStep 
				}
    
        if ((pointX == endX) && (pointY == endY)) { break } // doesn't include the end point
        
        points.push([pointX, pointY])
    }    
		// Add pixels based on size
		points.forEach(point => generatePixelsBySize(point[0], point[1]).forEach(pixel => points.push(pixel)))
		
		// Remove duplicates before sending to print
    return new Set([...points])
}
		
	// ========== SIZE FUNCTION (start) ==========
	function generatePixelsBySize(x, y){
		const pixelArr = []
		for(let a = 0; a <= toolSize; a++){
			for(let b = 0; b <= toolSize; b++){
      	if(a === 0 && b === 0){
        	pixelArr.push([x, y])
        }
        else if (a === 0){
        	pixelArr.push([x, y+b], [x, y-b])
        }
        else if(b === 0){
        	pixelArr.push([x+a, y], [x-a, y])
        }
        else{
        	pixelArr.push([x+a, y+b], [x+a, y-b], [x-a, y+b], [x-a, y-b])
        }
			}
		}
		return pixelArr;
	}
	
	// ========== BOX FUNCTION (start) ==========
	function generateBox(endX, endY){
		let boxArr = []
		if(boxStart[0] === endX && boxStart[1] === endY) {
			boxArr.push(boxStart)
		}
		else{
			let boxEnd = [endX, endY]
			let xDif = boxEnd[0] - boxStart[0]
			let yDif = boxEnd[1] - boxStart[1]

			const xCheck = xDif >= 0 
				? (currentX) => currentX < boxEnd[0] 
				: (currentX) => currentX > boxEnd[0];

			const yCheck = yDif >= 0 
				? (currentY) => currentY < boxEnd[1]
				: (currentY) => currentY > boxEnd[1];

			let [xS, yS] = boxStart;
			let [xE, yE] = boxEnd;

			// Get top and bottom coordinates
			while(xCheck(xS)){
				boxArr.push([xS, yS], [xE, yE])
				if(xDif >= 0){
					xS++;
					xE--;
				}
				else{
					xS--;
					xE++;
				}
			}
			// Get left and right coordinates
			while(yCheck(yS)){
				boxArr.push([xS, yS], [xE, yE])
				if(yDif >= 0){
					yS++;
					yE--;
				}
				else{
					yS--;
					yE++;
				}
			}
		}
				
		// Add pixels based on size
		boxArr.forEach(point => generatePixelsBySize(point[0], point[1]).forEach(pixel => boxArr.push(pixel)))
		
		// Remove duplicates before sending to print
    return new Set([...boxArr])
	}
	
	// ========== BOX FUNCTIONS (end) ==========
	
	function paintPixels(pixelArr){
		pixelArr.forEach(pixel => {
			// Check that pixel is within the canvas borders
			if(pixel[0] >= 0 && pixel[0] < canvasWidth && pixel[1] >= 0 && pixel[1] < canvasHeight){
				colorPixel(pixel[0], pixel[1])
			}
		})
	}
	
	function mouseHandler(e, x, y){
		currentX = x;
		currentY = y;
		// Special case #1 -> line: cannot utilize drag
		if (toolType === "line"){
			if(e.type === 'mousedown' && x !== undefined && y !== undefined){
				// 1st Click: Set start of line
				if(lineStart === null){
					lineStart = [x, y];
					paintPixels(generatePixelsBySize(x, y))
					matrixCopy = JSON.stringify(pixelMatrix)	// Deep copy matrix to temp variable (used to aid ghost line gen)
				}
				// 2nd Click: Set end of line (and points between)
				else {
					paintPixels(generateBresenhamLine(lineStart[0], lineStart[1], x, y))	// Color between line ends
 					colorPixel(x, y);	// Paint line end
					lineStart = null;
					matrixCopy = null;
				}
			}
			else if(lineStart !== null && x !== undefined && y !== undefined){
					pixelMatrix = JSON.parse(matrixCopy)																 	// 1. Wipe out prior changes
					paintPixels(generateBresenhamLine(lineStart[0], lineStart[1], x, y))	// 2. Regenerate temp ghost line
					colorPixel(x, y) 																											// 3. Paint temp line end
				}
		}
		// Special case #2 -> line: cannot utilize drag
		else if (toolType === "box"){
			if(e.type === 'mousedown' && x !== undefined && y !== undefined){
				// 1st Click: Set 1st corner of box
				if(boxStart === null){
					boxStart = [x, y];
					//paintPixels(generatePixelsBySize(x, y))
					matrixCopy = JSON.stringify(pixelMatrix)	// Deep copy matrix to temp variable (used to aid ghost line gen)
				}
				// 2nd Click: Set 2nd corner of box (and points between)
				else {
					paintPixels(generateBox(x, y))	// Color between line ends
					boxStart = null;
					matrixCopy = null;
				}
			}
			else if(boxStart !== null && x !== undefined && y !== undefined){
					pixelMatrix = JSON.parse(matrixCopy)	// 1. Wipe out prior changes
					paintPixels(generateBox(x, y))				// 2. Regenerate temp ghost box
				}
		}
		else if (isDraggingMouse || e.type === 'mousedown' && x !== undefined && y !== undefined) {
			switch(toolType){
				case "paint": return paintPixels(generatePixelsBySize(x,y))
				case "fill": return floodFillPixels(x,y, toolColor)
				default: paintPixels(generatePixelsBySize(x,y))
			}
		}
	}
	
	function colorPixel(x, y){
		pixelMatrix[y][x].color = toolColor;
	}
</script>

<!-- 	Display current position of user's mouse within canvas -->
<span>Current Mouse Position: {`[${currentX}, ${currentY}]`}</span>

<!-- Start "drag" if mouse clicks while inside canvas area. Stop "drag" if mouse releases or exits the canvas area  -->
<div id="canvasContainer" 
	on:mousedown="{() => isDraggingMouse = true}" 
	on:mouseup="{() => isDraggingMouse = false}"
	on:mouseleave="{() => isDraggingMouse = false}">
	{#each pixelMatrix as pixelRow}
	<div class="pixelRow">				
		{#each pixelRow as {x, y, color}}
		<div class="pixel" style="background-color: {color};" on:mousedown|preventDefault={(e) => mouseHandler(e, x, y)} on:mouseenter={(e) => mouseHandler(e, x, y)}></div>
		{/each}
	</div>
	{/each}
</div>

<style>
	#canvasContainer{
		border: solid black 3px;
		margin-top: 10px;
	}
	
	.pixelRow{
		display: flex;
		margin: 0;
	}
	
	.pixel{
		margin:0;
		outline: none;
		width: 5px;
		height: 5px;
	}
</style>