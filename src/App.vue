<template>
    <div id="app" class="container">
        <div id="map" class="flexbox upl">
            <l-map
                    v-if="showMap"
                    :zoom="zoom"
                    :center="center"
                    :options="mapOptions"
                    @update:center="centerUpdate"
                    @update:zoom="zoomUpdate"
            >
                <l-tile-layer
                        :url="url"
                        :attribution="attribution"
                />

                <l-marker v-for="bikeStop in bikes.bikeRentalStations" :lat-lng="getMarkerLatLong(bikeStop)" v-bind:key="bikeStop.id">
                    <l-popup>
                        <div>
                            Name: {{ bikeStop.name }}
                            <br>
                            Bikes: {{ bikeStop.bikesAvailable }}
                            <br>
                            Space: {{ bikeStop.spacesAvailable }}
                        </div>

                    </l-popup>
                </l-marker>
            </l-map>
        </div>
        <div id="weather" class="flexbox upr">
            <Weather/>
        </div>
        <div id="list" class="flexbox btm">
            <citybike :items="bikes.bikeRentalStations"/>
        </div>

    </div>
</template>

<script>
  import Citybike from '@/components/Citybike.vue';
  import {mapActions, mapGetters} from 'vuex';
  import {Icon, latLng} from 'leaflet';
  import {LMap, LMarker, LPopup, LTileLayer} from 'vue2-leaflet';
  import 'leaflet/dist/leaflet.css';
  import Weather from '@/components/Weather';

  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: 'app',
    components: {
      Weather,
      Citybike,
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
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


    .flexbox {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
        min-height: 200px;
        border: 5px solid white;
        font-size: large;
    }

    .upr {
        max-width: 15rem;
        position: relative;
        padding: 0rem 1rem 0rem 0rem;
        width: 35%;
        border: 5px solid white;
        font-size: smaller;
    }
    .upr{
        margin-bottom: 0;
    }

    p {
        margin-bottom: 0;
    }

    td {
        padding: 2px;
    }

    h3 {
        top: 0;
        bottom: 0;
    }

    .upl {
        border: 5px solid white;
        position: relative;
        box-sizing: border-box;
        top: 0;
        bottom: 0;
        width: 65%;
        padding: 0;
    }

    .btm {
        position: relative;
        width: 85%;
    }

    button {
        background: #009435;
        border: 1px solid #009435;
    }

    .container {
        max-width: 95%;
        display: flex;
        flex-wrap: wrap;
    }
</style>

