<template>
	<div>
		<div v-bind:key="shape.id" v-for="shape in shapes">
			<ShapeItem v-bind:shape="shape" v-on:del-shape="$emit('del-shape', shape.id)" :activeShape="activeShape" @onUpdateShape="$emit('onUpdateShape', shape.id)"/>
		</div>

		<h5>
			Click points on the map to create a polygon. You can swap between layers by clicking a shape name above. Markers are draggable. When switching between layers, drag or zoom to update. This is known, described in About tab.
		</h5>
		<br/>
		<br/>
		<h3>If map does not render, please switch to About tab and back. Working on this. </h3>
	</div>
</template>

<script>
import ShapeItem from "./ShapeItem"


export default {
	name: "Shapes",
	props: ["shapes", "activeShape"],
	components: {
		ShapeItem
	},
	methods: {
	}
}
</script>

<style scoped>

</style>