<template>
    <div id="app" class="small-container">
        <div id="eka" style="height: 640px; width: 100%">
            <!--        <div id="toka" style="height: 200px; overflow: auto;">-->
            <!--            <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>-->
            <!--            <button @click="showLongText">-->
            <!--                Toggle long popup-->
            <!--            </button>-->
            <!--            <button @click="showMap = !showMap">-->
            <!--                Toggle map-->
            <!--            </button>-->
            <!--        </div>-->
            <l-map
                    v-if="showMap"
                    :zoom="zoom"
                    :center="center"
                    :options="mapOptions"
                    style="height: 80%"
                    @update:center="centerUpdate"
                    @update:zoom="zoomUpdate"
            >
                <l-tile-layer
                        :url="url"
                        :attribution="attribution"
                />
<!--                <l-marker :lat-lng="withPopup">-->
<!--                    <l-popup>-->
<!--                        <div @click="innerClick">-->
<!--                            I am a popup-->
<!--                            <p v-show="showParagraph">-->
<!--                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque-->
<!--                                sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.-->
<!--                                Donec finibus semper metus id malesuada.-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </l-popup>-->
<!--                </l-marker>-->
                    <StopMarkers :items="bikes.bikeRentalStations"></StopMarkers>
<!--                <l-marker v-for="bikeStop in bikes.bikeRentalStations" :lat-lng="getMarkerLatLong(bikeStop)" v-bind:key="bikeStop.id">-->
<!--                    <l-popup>-->
<!--                        <div>-->
<!--                            Name {{ bikeStop.name }}-->
<!--                            <br>-->
<!--                            Bikes: {{ bikeStop.bikesAvailable }}-->
<!--                            <br>-->
<!--                            Space: {{ bikeStop.spacesAvailable }}-->
<!--&lt;!&ndash;                            allowDropoff:true&ndash;&gt;-->
<!--&lt;!&ndash;                            bikesAvailable:6&ndash;&gt;-->
<!--&lt;!&ndash;                            lat:60.2689544&ndash;&gt;-->
<!--&lt;!&ndash;                            lon:24.8201851&ndash;&gt;-->
<!--&lt;!&ndash;                            name:"Luhtimäki"&ndash;&gt;-->
<!--&lt;!&ndash;                            spacesAvailable:4&ndash;&gt;-->
<!--&lt;!&ndash;                            stationId:"1215"&ndash;&gt;-->

<!--                        </div>-->

<!--                    </l-popup>-->
<!--                </l-marker>-->
            </l-map>
        </div>
        <div id="list" class="list">
            <citybike :items="bikes.bikeRentalStations"/>
        </div>
    </div>
</template>

<script>
  import Citybike from '@/components/Citybike.vue';
  import {mapActions, mapGetters} from 'vuex';
  import {Icon, latLng} from 'leaflet';
  import {LMap, LTileLayer} from 'vue2-leaflet';
  import 'leaflet/dist/leaflet.css';
  import StopMarkers from '@/components/StopMarkers';

  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: 'app',
    components: {
      StopMarkers,
      Citybike,
      LMap,
      LTileLayer,
      // LMarker,
      // LPopup,
      // LTooltip
    },
    computed: {
      ...mapGetters([
        'bikes'
      ])
    },
    mounted() {
      this.getBikeData();
    },
    data() {
      return {
        zoom: 13,
        center: latLng(60.169667, 24.934885),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        withPopup: latLng(60.169667, 24.93000),
        withTooltip: latLng(60.169667, 24.934885),
        currentZoom: 11.5,
        currentCenter: latLng(60.169667, 24.934885),
        showParagraph: false,
        mapOptions: {
          zoomSnap: 0.5
        },
        showMap: true
      };
    },
    methods: {
      zoomUpdate(zoom) {
        this.currentZoom = zoom;
      },
      centerUpdate(center) {
        this.currentCenter = center;
      },
      showLongText() {
        this.showParagraph = !this.showParagraph;
      },
      innerClick() {
        alert("Click!");
      },
      ...mapActions([
        'fillBikes',
      ]),
      getBikeData() {
        fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{
          bikeRentalStations {
              stationId
              name
              bikesAvailable
              spacesAvailable
              lat
              lon
              allowDropoff
              }
          }`})
        })
        .then(res => res.json())
        .then(res => {
          this.fillBikes(res.data);
        });
      },
      getMarkerLatLong(bikeStop) {
        return latLng(bikeStop.lat, bikeStop.lon);
      },
    },
  };

</script>

<style>

    .map {
    }

    .list {
        left: 50%;
        right: 50%;
        float:bottom;
    }

    button {
        background: #009435;
        border: 1px solid #009435;
    }

    .small-container {
        max-width: 95%;
    }
</style>

