<template>
	<div :class="{'shape-item-selected' : this.activeShape == shape.id, 'shape-item-not-selected' : this.activeShape != shape.id}"  @click="updateActiveShape">
		<!-- <div v-if="this.activeShape == shape.id"> Selected </div> -->
    
    <p>
      <!-- {{shape.id}}. -->
			Layer Name: {{shape.title}}
			<button @click="$emit('del-shape', shape.id)" class="del">delete</button>

		</p>
	</div>
</template>

<script>
export default {
	name: "ShapeItem",
	props: ["shape", "activeShape"],
	methods: {
		markComplete() {
			this.shape.completed = !this.shape.completed;
		},
    updateActiveShape() {
      this.$emit('onUpdateShape', this.shape.id)

      // console.log(this.activeShape)
      // console.log(this.shape.id)
    }
	}
}
</script>

<style scoped>
 .shape-item-not-selected {
    text-align: left;
    width: 370px;
    height: 40px;
    background: #f0f0f0;
    padding: 10px;
    border-bottom: 4px #ccc dotted;
  }

  .shape-item-selected {
    text-align: left;
    font-weight: bold;
    width: 370px;
    height: 40px;
    background: #abd5ed;
    padding: 10px;
    border-bottom: 4px #ccc dotted;
  }
 
  .del {
    background: #f7a8a8;
    color: #ffffff;
    border: none;
    padding: 5px 9px;
    border-radius: 5%;
    cursor: pointer;
    float: right;
  }
</style>