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