<script>
	export let toolColor;
	let colors =["black", "white", "blue", "red", "green", "yellow"]
	function changeToolColorTo(color){
		toolColor = color;
	}
</script>

<div id="colorPalette">
	{#each colors as color}
		<div class={`colorBtnWrapper ${toolColor === color ? "selected" : "unselected"}`}>
			<button style="background-color: {color};" on:click={() => changeToolColorTo(color)}></button>
		</div>
	{/each}
</div>

<style>
	#colorPalette{
		display: flex;
		border: solid black 1px;
		padding: 5px;
		border-radius: 5px;
	}
	
	.colorBtnWrapper{
		margin-left: 5px;
    margin-right: 5px;
    border-width: 2px;
    padding: 0px 7px 7px 7px;
    border-radius: 5px;
    border-style: solid;
	}
	
	.colorBtnWrapper button{
		border: solid black px;
		margin: 0;
	}
	
	.selected{
		border-color: black;
	}
	
	.unselected{
		border-color: transparent;
	}
</style>