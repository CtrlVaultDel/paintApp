import { writable } from 'svelte/store';

function createCanvasStore() {
	const { subscribe, set, update } = writable({
		matrix: [[{x: 0, y:0, color: "white"}]],
		width: 50,
		height: 50,
		toolType: "paint",
		toolColor: "black",
		toolSize: 0
	});
	
	const methods = {
		setToolType: (newType) => update(canvas => ({...canvas, toolType: newType})),
		setToolColor: (newColor) => update(canvas => ({...canvas, toolColor: newColor})),
		setToolSize: (newSize) => update(canvas => ({...canvas, toolSize: newSize})),
		paintCoordinates: (coordinatesToPaint) => {
			update(canvas => {
				const newMatrix = JSON.parse(JSON.stringify(canvas.matrix))
				coordinatesToPaint.forEach(coordinate => {
					const [x, y] = coordinate;
					if(x >= 0 && x < canvas.width && y >= 0 && y < canvas.height){
						// If coordinate to paint is within the canvas boundaries, paint it with current color
						newMatrix[y][x].color = canvas.toolColor;
					}
				}) 
				return {...canvas, matrix: newMatrix}
			})
		},
		generateCanvas: () => {
			update(canvas => {
				const newMatrix = new Array(canvas.height);
				for(let y = 0; y < canvas.height; y++){
					newMatrix[y] = (new Array(canvas.width));
					for(let x = 0; x < canvas.width; x++){
						newMatrix[y][x] = {
							x: x, 
							y: y,
							color: "white"
						}
					}
				}
				return {...canvas, matrix: newMatrix}
			})	
		}
	}

	return {
		subscribe,
		set,
		...methods
	}
}

export const canvasObj = createCanvasStore();