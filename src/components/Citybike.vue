<template>
    <div id="citybikes">
        <h1>Kaupunkipyörät</h1>
        <b-table
                :items="bikes.bikeRentalStations"
        ></b-table>
    </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: 'CityBike',
    // data() {
    //   return {
    //     bikeData: null,
    //   }
    // },
    computed: {
      ...mapGetters([
        'bikes'
      ])
    },
    mounted() {
      this.getBikeData()
    },
    methods: {
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
          .then(res => this.fillBikes(res.data));
      },
    }
  };

</script>

<style scoped>
</style>
