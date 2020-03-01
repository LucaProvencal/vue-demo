<template>
  <div>

    <div class="lines">
      <svg style="width: 1000px; height: 600px;">
        <line :key="m.key" :id="m" v-for="m in lineArray" :x1="m.x1" :y1="m.y1" :x2="m.x2" :y2="m.y2" style="stroke:rgb(255,0,0);stroke-width:2"/>
      </svg>
    </div>

  <h1 style="position: absolute;"> Polygon </h1>

    <div  style="position: absolute; z-index: -1">
      <GmapMap style="width: 1000px; height: 600px;" :zoom="1" @zoom_changed="zoomed" :center="{lat: 0, lng: 0}" @center_changed="dragged"
          ref="map" @click="clicked">
         <GmapMarker
            :key="m.key"
            v-for="m in points"
            :position="{lat: m.lat, lng: m.lng}"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
            @drag="markerDragged($event, m.key)"
          />
      </GmapMap>
    </div>
    
  <button @click="clear" class="del">Clear Points</button>


  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
// import {range} from 'lodash';

export default {
  name: "GMap",
  props: {  // I was initially using this as setState. need to put any initial vals in data(). accepted prop types defined here
  },
  data() {    // this is like setstate in constructor in React. gives initial values for this.zoom and this.center
    return{ 
      zoom: 1,
      center: { 
        lat: () => 0, 
        lng: () => 0 
      },
      lat: 0,
      lng: 0,
      points: [],
      lineArray: []
    }
  },
  components: {
    //GmapMap // couldnt get this to register. receiving warning
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


        this.lineArray = [] // removes leftover lines. without it, would create a new polygon for every point added.
        this.createLines(this.points, this.zoom, this.center) // When adding new points, read current zoom and current center. create lines with current point and current center. 

    },
    dragged (e) {  // it jumps at the end due to google maps "momentum" rendering. i.e. map keeps moving after you let go of drag, despite calculating the endpoints right as you let go. 
      // console.log(e)
      // console.log(e.lat())
      // console.log(e.lng())
      this.center = {
        lat: e.lat,
        lng: e.lng
      }
      this.lineArray = []
      this.createLines(this.points, this.zoom, this.center) // When dragged (center changed), read current zoom and current center. create lines with current point and current center. 
    },
    zoomed (e) {
      this.zoom = e
      this.lineArray = []
      this.createLines(this.points, this.zoom, this.center)
    },
    
    markerDragged(e, key) {   // if user drags marker, need to update this.points and re-draw lines. 
      // console.log(e)
      // console.log(key)
      // console.log(e.latLng)
      // console.log(this.points[key])


      this.points[key] = {"lat": e.latLng.lat(), "lng": e.latLng.lng(), "key": key}
      this.lineArray = []
      this.createLines(this.points, this.zoom, this.center)

    },

    createLines(points, zoom = 1, center = { lat: () => 0, lng: () => 0 }) { // passing default zoom and center in. center vars are functions. needed to pass in default funcs within object

      // console.log(center)
      
      // References:
      // https://developers.google.com/maps/documentation/javascript/coordinates
      // https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
     
      let zoomFactor = Math.pow(2, zoom - 1)
      let offsetRadians = (center.lat())*Math.PI/180;
      let offsetmercN = Math.log(Math.tan((Math.PI/4)+(offsetRadians/2)));


      if (points.length == 1) {
        this.lineArray = []
        return this.lineArray
      } else if (points.length == 2) {

        let latRadians1 = (points[0].lat)*Math.PI/180;
        let mercN1 = Math.log(Math.tan((Math.PI/4)+(latRadians1/2)));
        let summercN1 = mercN1 - offsetmercN;

        let latRadians2 = (points[1].lat)*Math.PI/180;
        let mercN2 = Math.log(Math.tan((Math.PI/4)+(latRadians2/2)));
        let summercN2 = mercN2 - offsetmercN;

        this.lineArray = [
            { 
              "x1": (512*(180+(points[0].lng - center.lng()) * zoomFactor)/360) + 244,   
              "y1": (512/2)-(512*summercN1/(2*Math.PI) * zoomFactor) + 44,
              "x2": (512*(180+(points[1].lng - center.lng()) * zoomFactor)/360) + 244,
              "y2": (512/2)-(512*summercN2/(2*Math.PI) * zoomFactor) + 44,
              "key": 0
            }
        ]
        return this.lineArray
      } else {
        for(let i=0; i<points.length; i++) {
          let point1 = i%points.length;
          let point2 = (i+1)%points.length;

          let latRadians1 = points[point1].lat*Math.PI/180;
          let mercN1 = Math.log(Math.tan((Math.PI/4)+(latRadians1/2)));
          let summercN1 = (mercN1 - offsetmercN) * zoomFactor;
          let y1 = (512/2)-(512*summercN1/(2*Math.PI)) + 44;
          let x1 = 512*(180+(points[point1].lng - center.lng()%360) * zoomFactor)/360 + 244;  
          
          let latRadians2 = points[point2].lat*Math.PI/180;
          let mercN2 = Math.log(Math.tan((Math.PI/4)+(latRadians2/2)));
          let summercN2 = (mercN2 - offsetmercN) * zoomFactor;
          let y2 = (512/2)-(512*summercN2/(2*Math.PI)) + 44;
          let x2 = 512*(180+(points[point2].lng - center.lng()%360) * zoomFactor)/360 + 244;

          this.lineArray = [...this.lineArray,
            { 
              "x1": x1,   
              "y1": y1,
              "x2": x2,
              "y2": y2,
              "key": i
            }
          ]
        }

        return this.lineArray
      }
    },
    clear() {
      this.lineArray = []
      this.points = []
    }
  }
};
</script>

<style lang="css">

.lines {
  position: absolute;
  top:146px;
  width:1000;
  height:600;
  z-index: 10000;
  pointer-events: none;
}

</style>