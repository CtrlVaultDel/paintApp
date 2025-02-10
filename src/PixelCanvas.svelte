<script>
	import { canvasObj } from "./stores.js"
	let currentX;
	let currentY;
	let isDraggingMouse = false;
	
	let matrixCopy = null; // For crating temp "ghost" shapes
	let lineStart = null;	// For line tool
	let boxStart = null; // For box tool
	
	// ========== FILL FUNCTIONS (start) ==========
	// Recursive function called within floodFillPixels
	function recursiveFillUtil(x, y, prevColor, coordinatesToFill, tempMatrix){
		// Base cases
		if (x >= 0 && x < ($canvasObj.width) && y >= 0 && y < ($canvasObj.height) && tempMatrix[y][x].color === prevColor){
			coordinatesToFill.push([x,y])	// Push current coordinates to array for printing
			tempMatrix[y][x].color = $canvasObj.toolColor
			recursiveFillUtil(x + 1, y, prevColor, coordinatesToFill, tempMatrix);	// Recur for right
			recursiveFillUtil(x - 1, y, prevColor, coordinatesToFill, tempMatrix);	// Recur for left
			recursiveFillUtil(x, y + 1, prevColor, coordinatesToFill, tempMatrix);	// Recur for below
			recursiveFillUtil(x, y - 1, prevColor, coordinatesToFill, tempMatrix);	// Recur for above
		}
	}
 
	function generateFillCoords(x, y) {
		let prevColor = $canvasObj.matrix[y][x].color;
		if (prevColor == $canvasObj.toolColor) return;
		const coordinatesToFill = []
		const tempMatrix = JSON.parse(JSON.stringify($canvasObj.matrix))
		recursiveFillUtil(x, y, prevColor, coordinatesToFill, tempMatrix);
		return coordinatesToFill;
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
		points.push([endX, endY]) // Push end of line
		
		// Add pixels based on size
		points.forEach(point => generatePixelsBySize(point[0], point[1]).forEach(pixel => points.push(pixel)))
		
		// Remove duplicates before sending to print
    return new Set([...points])
}
		
	// ========== SIZE FUNCTION (start) ==========
	function generatePixelsBySize(x, y){
		const pixelArr = []
		for(let a = 0; a <= $canvasObj.toolSize; a++){
			for(let b = 0; b <= $canvasObj.toolSize; b++){
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
	
	function mouseHandler(e, x, y){
		currentX = x;
		currentY = y;
		// Special case #1 -> line: cannot utilize drag
		if ($canvasObj.toolType === "line"){
			if(e.type === 'mousedown' && x !== undefined && y !== undefined){
				// 1st Click: Set start of line
				if(lineStart === null){
					lineStart = [x, y];
					const coordinates = generatePixelsBySize(x, y); // Coordinates for line start (plus any pixels for size)
					canvasObj.paintCoordinates(coordinates)					// Paint line start
					matrixCopy = JSON.stringify($canvasObj.matrix)	// Deep copy matrix to temp variable (used to aid ghost line gen)
				}
				// 2nd Click: Set end of line (and points between)
				else {
					const coordinates = generateBresenhamLine(lineStart[0], lineStart[1], x, y)
					lineStart = null;
					matrixCopy = null;
					canvasObj.paintCoordinates(coordinates);
				}
			}
			// Ghost line (after 1st click but before finishing click)
			else if(lineStart !== null && x !== undefined && y !== undefined){
					// 1. Get original matrix to add ghost line to
					const tempMatrix = JSON.parse(matrixCopy);
				
					// 2. Generate ghost line	
					const coordinates = generateBresenhamLine(lineStart[0], lineStart[1], x, y);

					// 3. Apply ghost line to tempMatrix
					coordinates.forEach((pixel) => {
						const [x, y] = pixel;
						if(x >= 0 && x < $canvasObj.width && y >= 0 && y < $canvasObj.height){
							tempMatrix[pixel[1]][pixel[0]].color = $canvasObj.toolColor
						}
					})

					// 4. Replace store matrix
					$canvasObj.matrix = tempMatrix;
				}
		}
		// Special case #2 -> box: cannot utilize drag
		else if ($canvasObj.toolType === "box"){
			if(e.type === 'mousedown' && x !== undefined && y !== undefined){
				// 1st Click: Set 1st corner of box
				if(boxStart === null){
					boxStart = [x, y];
					const coordinates = generatePixelsBySize(x, y); // Coordinates for box start (plus any pixels for size)
					canvasObj.paintCoordinates(coordinates)		// Paint box start
					matrixCopy = JSON.stringify($canvasObj.matrix)	// Deep copy matrix to temp variable (used to aid ghost line gen)
				}
				// 2nd Click: Set 2nd corner of box (and points between)
				else {					
					const coordinates = generateBox(x, y)
					boxStart = null;
					matrixCopy = null;
					canvasObj.paintCoordinates(coordinates);
				}
			}
			else if(boxStart !== null && x !== undefined && y !== undefined){				
					// 1. Get original matrix to add ghost line to
					const tempMatrix = JSON.parse(matrixCopy);
				
					// 2. Generate ghost box	
					const coordinates = generateBox(x, y);

					// 3. Apply ghost box to tempMatrix
					coordinates.forEach((pixel) => {
						const [x, y] = pixel;
						if(x >= 0 && x < $canvasObj.width && y >= 0 && y < $canvasObj.height){
							tempMatrix[pixel[1]][pixel[0]].color = $canvasObj.toolColor
						}
					})

					// 4. Replace store matrix
					$canvasObj.matrix = tempMatrix;
				}
		}
		// Special case #3 -> fill: do not utilize drag
		else if ($canvasObj.toolType === "fill" && e.type === 'mousedown' && x !== undefined && y !== undefined){
			const coords = generateFillCoords(x,y)
			canvasObj.paintCoordinates(coords)
		}

		// Base case: normal paint
		else if($canvasObj.toolType === "paint" && x !== undefined && y !== undefined && isDraggingMouse || e.type === 'mousedown' ){
			canvasObj.paintCoordinates(generatePixelsBySize(x,y))
		}
	}
</script>

<!-- Display current position of user's mouse within canvas -->
<span>Current Mouse Position: {`[${currentX}, ${currentY}]`}</span>

<!-- Start "drag" if mouse clicks while inside canvas area. Stop "drag" if mouse releases or exits the canvas area  -->
<div id="canvasContainer" 
	on:mousedown="{() => isDraggingMouse = true}" 
	on:mouseup="{() => isDraggingMouse = false}"
	on:mouseleave="{() => isDraggingMouse = false}">
	{#each $canvasObj.matrix as pixelRow}
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