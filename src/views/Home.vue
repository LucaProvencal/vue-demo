<template>
  <div id="app">

    <GMap v-bind:number-of-shapes="5" v-bind:selected="activeShape" v-bind:shown="[1]" />
    <AddShape style="position: absolute; top: 225px; left:1030px" v-on:add-shape="addShape"/>
    <Shapes style="position: absolute; top: 275px; left:1030px" v-bind:shapes="shapes" v-bind:activeShape="activeShape" v-on:del-shape="deleteShape" v-on:onUpdateShape="updateActiveShape"/>

  </div>
</template>

<script>
// import api from '@/api'
import Shapes from "../components/Shapes";
import AddShape from "../components/AddShape";
// import axios from "axios";
import GMap from "../components/GMap";

export default {
  name: 'App',
  components: {
    Shapes,
    GMap,
    AddShape
  },
  methods: {
    addShape(newShape) {
  
      if (!this.shapes.length){
        newShape.id = 1
      } else {
        newShape.id = this.shapes.slice(-1)[0].id + 1
      }

      this.shapes = [...this.shapes, newShape];

    },

    updateActiveShape(id) {
     this.activeShape = id
    },

    deleteShape (id) {
      if (confirm('Are you sure you want to delete this shape?')) {
        // if we are editing a shape we deleted, remove it from the form
        this.activeShape = -1 // removes lines and markers upon deletion of shape layer
        // remove it from the ui
        this.shapes = this.shapes.filter(shape => shape.id !== id);
      }
    }
  },

  //componentDidMount analog. fires when component is created
  async created() { 
    this.refreshShapes()
    // return this.shapes = DefaultShapes
  },

  data() {
    return {
      activeShape: 1,
      shapes: [{title: 'Shape 1', id: 1}],
      loading: false,
      model: {}
    }
  }
}
</script>

<style>
  .btn {
    display: inline-block;
    border: none;
    background: #555;
    color: #fff;
    padding: 7px 20px;
    cursor: pointer;
  }
  .btn:hover {
    background: #666;
  }
</style>
