<template>
	<div class="about">
	<h1>Demo Vue App for Aerospacelab</h1>
	<h4>Author: Luca Provencal</h4>	
	<p>repo: <a href="https://github.com/LucaProvencal/vue_aerospacelab_demo " >https://github.com/LucaProvencal/vue_aerospacelab_demo</a><br/></p>	

	<h4>References:</h4>
    <p>
		Applying Zoom Factor to Coordinates: <a href="https://developers.google.com/maps/documentation/javascript/coordinates" >https://developers.google.com/maps/documentation/javascript/coordinates</a><br/>
		Calculating Mercator Projection Coordinates: <a href="https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
		" >https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
		</a><br/>


		VueJS Intro (Traversy Media): <a href="https://www.youtube.com/watch?v=Wy9q22isx3U" >https://www.youtube.com/watch?v=Wy9q22isx3U
		</a><br/>
		
	</p>

	<h4>Known Issues:</h4>

    <p>
		- When switching between layers, the layer being switched to does not update until it is zoomed or dragged. <br/>
		This can be fixed by looping through all layers and redrawing each of their lines when the map is zoomed or dragged.<br/><br/>
		- When dragging the map, The Google Maps API uses a form of "momentum" to slow the map down after the user releases a <br/>click. The latitude and longitude are calculated as soon as the user lets go of a click, which triggers the overlayed shape <br/> to snap to position. In this case, the rendered SVG does not follow the map's momentum.<br/><br/>
		- Map does not load initially. Requires switching between About and Home tabs.
		<br/>
	</p>

  </div>
</template>
