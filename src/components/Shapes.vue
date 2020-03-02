<template>
	<div>
		<div v-bind:key="shape.id" v-for="shape in shapes">
			<ShapeItem v-bind:shape="shape" v-on:del-shape="$emit('del-shape', shape.id)" :activeShape="activeShape" @onUpdateShape="$emit('onUpdateShape', shape.id)"/>
		</div>
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