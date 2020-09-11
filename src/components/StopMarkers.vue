<template>
    <div>
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
    </div>
</template>

<script>
  import {latLng} from 'leaflet';
    import {LMarker, LPopup} from 'vue2-leaflet';

    export default {
      name: 'StopMarkers',
      components: {
        LMarker,
        LPopup,
      },
      methods: {
        getMarkerLatLong(bikeStop) {
          return latLng(bikeStop.lat, bikeStop.lon);
        },
      },
      props: {
        items: Array,
      }
    }
</script>
