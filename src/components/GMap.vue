<template>
  <div>
    <Home />
    <div class="lines" >
      <svg style="width: 1000px; height: 600px;">
        <line :key="m.key" :id="m" v-for="m in lines" :x1="m.x1" :y1="m.y1" :x2="m.x2" :y2="m.y2" style="stroke:rgb(255,0,0);stroke-width:2"/>
      </svg>
    </div>
    <div  style="position: absolute; z-index: -1; width: 1000px; height: 600px;">
      <GmapMap :options="{fullscreenControl: false}" ref="mapRef" style="width: 1000px; height: 600px;" :zoom="1" @zoom_changed="zoomed" :center="{lat: 0, lng: 0}" @center_changed="dragged"
           @click="clicked">
         <GmapMarker
            :key="m.key"
            v-for="m in points"
            :position="{lat: m.lat, lng: m.lng}"
            :clickable="true"
            :draggable="true"
            @drag="markerDragged($event, m.key)"
          />
      </GmapMap>
    </div>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import { Home } from "../views/Home.vue";
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

// this connects to google maps API. I initially had this in my main.js, causing problems initializing the map.
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAPS_KEY,
    libraries: 'places', 
  }
})

export default {
  name: "GMap",
  props: {  // I was initially using this as setState. need to put any initial vals in data(). accepted prop types defined here. React transition
    selected: Number,         // indicates which shape to edit
    shown: Array,             // indicates which shapes are shown
    numberOfShapes: Number    // total number of shapes
  },
  watch: {        // runs when props are changed.
    selected: function(newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)

      this.lines= this.allLines[newVal]
      this.points= this.allPoints[newVal]
    }
  },
   mounted() {    

    
  
  },
  data() {    // this is like setstate in constructor in React. gives initial values for this.zoom and this.center
    return { 
      zoom: 1,
      center: { 
        lat: () => 0, 
        lng: () => 0 
      },
      lat: 0,
      lng: 0,
      points: [],
      allPoints: [],
      lines: [],
      allLines: []
    }
  },
  components: {
    //GmapMap, // couldnt get this to register. receiving warning
    Home
  },
  computed: {
    google: gmapApi
  }, 
  methods: {
    clicked (e) {

        this.lat = e.latLng.lat() // pulls latitude from click
        this.lng = e.latLng.lng() // pulls longitude from click

        if(!this.points) {
          this.points = [{"lat": this.lat, "lng": this.lng, "key": 0}]
        } else {
          this.points = [...this.points, {"lat": this.lat, "lng": this.lng, "key": this.points.length}]
        }

        this.lines = [] // removes leftover lines. without it, would create a new polygon for every point added.
        this.allPoints[this.selected] = this.points

        this.createLines(this.allPoints[this.selected], this.zoom, this.center, this.selected) // When adding new points, read current zoom and current center. create lines with current point and current center. 

        
        this.allLines[this.selected] = this.lines

    },
    dragged (e) {  // it jumps at the end due to google maps "momentum" rendering. i.e. map keeps moving after you let go of drag, despite calculating the endpoints right as you let go. 

      this.center = {
        lat: e.lat,
        lng: e.lng
      }
      this.lines = []
      this.createLines(this.points, this.zoom, this.center) // When dragged (center changed), read current zoom and current center. create lines with current point and current center. 

      this.allLines[this.selected] = this.lines // only updates current lines. need to update all lines
    },
    zoomed (e) {
      this.zoom = e
      this.lines = []
      this.createLines(this.points, this.zoom, this.center)

      this.allLines[this.selected] = this.lines
    },
    
    markerDragged(e, key) {   // if user drags marker, need to update this.points and re-draw lines. 

      this.points[key] = {"lat": e.latLng.lat(), "lng": e.latLng.lng(), "key": key}
      this.lines = []
      this.createLines(this.points, this.zoom, this.center)

      this.allLines[this.selected] = this.lines
    },

    createLines(points, zoom = 1, center = { lat: () => 0, lng: () => 0 }, selected) { // passing default zoom and center in. center vars are functions. needed to pass in default funcs within object

      console.log(selected)
      
      // References:
      // https://developers.google.com/maps/documentation/javascript/coordinates
      // https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
     
      let zoomFactor = Math.pow(2, zoom - 1)          // used to incorporate scaling and offset due to user zooming/dragging
      let offsetRadians = (center.lat())*Math.PI/180;
      let offsetmercN = Math.log(Math.tan((Math.PI/4)+(offsetRadians/2)));


      if (points.length == 1) {
        this.lines = []
        return this.lines
      } else if (points.length == 2) {    // if a line between two points needs to be drawn. 

        let latRadians1 = (points[0].lat)*Math.PI/180;                 // converting lat/lng to mercator projection xy. 
        let mercN1 = Math.log(Math.tan((Math.PI/4)+(latRadians1/2)));  
        let summercN1 = mercN1 - offsetmercN;                          // this line accounts for the XY offset due to dragging 

        let latRadians2 = (points[1].lat)*Math.PI/180;
        let mercN2 = Math.log(Math.tan((Math.PI/4)+(latRadians2/2)));
        let summercN2 = mercN2 - offsetmercN;

        this.lines = [
            { 
              "x1": (512*(180+(points[0].lng - center.lng()) * zoomFactor)/360) + 244,   
              "y1": (512/2)-(512*summercN1/(2*Math.PI) * zoomFactor) + 43,     // last terms are XY height offset in absolute position
              "x2": (512*(180+(points[1].lng - center.lng()) * zoomFactor)/360) + 244,  // zoomfactor accounts for zooming the map. applied to all coords.
              "y2": (512/2)-(512*summercN2/(2*Math.PI) * zoomFactor) + 43,
              "key": 0
            }
        ]
        return this.lines
      } else {
        for(let i=0; i<points.length; i++) {    // if a polygon needs to be made. this will connect 3 or more lines in the order they were created
          let point1 = i%points.length;   
          let point2 = (i+1)%points.length; // if point1 is the last point picked, make point2 the first point that was picked

          /*  lat and lng are received from Maps API in degrees. Here, they are converted to XY outputs associated with 
              corresponding overlay location on top of a Mercator projection. I initially tried to just convert lat/lng
              to XY, quickly realized there was a nonlinear relationship, and discovered google maps uses the Mercator 
              projection. Then equations of the projection are used to convert to XY coordinates in order to plot the lines.
          */

          let latRadians1 = points[point1].lat*Math.PI/180;
          let mercN1 = Math.log(Math.tan((Math.PI/4)+(latRadians1/2)));
          let summercN1 = (mercN1 - offsetmercN) * zoomFactor;
          let y1 = (512/2)-(512*summercN1/(2*Math.PI)) + 43;
          let x1 = 512*(180+(points[point1].lng - center.lng()%360) * zoomFactor)/360 + 244;  
          
          let latRadians2 = points[point2].lat*Math.PI/180;
          let mercN2 = Math.log(Math.tan((Math.PI/4)+(latRadians2/2)));
          let summercN2 = (mercN2 - offsetmercN) * zoomFactor;
          let y2 = (512/2)-(512*summercN2/(2*Math.PI)) + 43;
          let x2 = 512*(180+(points[point2].lng - center.lng()%360) * zoomFactor)/360 + 244;

          // add newly created line to shape array
          this.lines = [...this.lines,
            { 
              "x1": x1,   
              "y1": y1,
              "x2": x2,
              "y2": y2,
              "key": i
            }
          ]
        }

        return this.lines
      }
    },
    clear() {
      this.lines = []
      this.points = []
    }
  }
};
</script>

<style lang="css">

.lines {
  position: absolute;
  top:157px;
  width:1000;
  height:600;
  z-index: 10000;
  pointer-events: none;
}

</style>