<template>

    <div id="eka" style="height: 800px; width: 100%">
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
            <l-marker :lat-lng="withPopup">
                <l-popup>
                    <div @click="innerClick">
                        I am a popup
                        <p v-show="showParagraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                            sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
                            Donec finibus semper metus id malesuada.
                        </p>
                    </div>
                </l-popup>
            </l-marker>
            <l-marker :lat-lng="withTooltip">
                <l-tooltip :options="{ permanent: true, interactive: true }">
                    <div @click="innerClick">
                        I am a tooltip
                        <p v-show="showParagraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                            sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
                            Donec finibus semper metus id malesuada.
                        </p>
                    </div>
                </l-tooltip>
            </l-marker>
            <l-marker v-for bikeStop in >

            </l-marker>
        </l-map>
    </div>
</template>

<script>
  import { latLng, Icon } from "leaflet";
  import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
  import 'leaflet/dist/leaflet.css';

  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: "Example",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LTooltip
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
      }
    }
  };
</script>
