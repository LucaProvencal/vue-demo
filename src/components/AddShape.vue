<template>
	<div>
		<h1 style="position: absolute; top: -67px; left:0px; width: 400px">Polygon Overlay</h1>
		<form @submit="addShape" style="position: absolute; top: 5px; left:0px;">
			<input type="text" v-model="title" name= "title" placeholder="Add a Shape...">
			<input type="submit" value="Submit" class="btn">
		</form>
	</div>
</template>

<script>
export default{
	name: "AddShape",
	data() {
		return {
			title: ''
		}
	},

	methods: {
		addShape(e) {
			e.preventDefault();
			const newShape = {
				title: this.title
			}
			//send up to parent

			this.$emit('add-shape', newShape);

			this.title = '';
		}
	}
}
</script>

<style scoped> 
  form {
    display: flex;
  }
  input[type="text"] {
    flex: 10;
    padding: 5px;
    width: 300px;
  }
  input[type="submit"] {
    flex: 2;
  }
</style>