<template>
    <div :items="weather" v-if="weather.request !== undefined">
        <h3 :items="weather">Weather in {{weather.request.query}}</h3>
        <p> {{ weather.current.weather_descriptions[0] }}
        <br> {{ mutateDateTime(weather) }} </p>
        <table >
            <tbody>
            <tr>
                <td>
                    <img :src="getWeatherImg(weather)" />
                </td>
                <td>
                    <h3 id="temperature">{{ weather.current.temperature }}°c</h3>
                </td>
            </tr>
            <tr>
                <td>Wind</td>
                <td>{{ weather.current.wind_speed }} km/h from {{ this.weather.current.wind_dir }}</td>
            </tr>
            <tr>
                <td>Cloud cover level</td>
                <td> {{ weather.current.cloudcover }}% </td>
            </tr>
            <tr>
                <td>Pressure</td>
                <td>{{ weather.current.pressure }} mb</td>
            </tr>
            <tr>
                <td>Humidity</td>
                <td>{{ weather.current.humidity }}%</td>
            </tr>
            <tr>
                <td>Geo coords</td>
                <td>{{ weather.location.lat }}, {{ weather.location.lon}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";

    export default {
      name: "Weather",
      mounted() {
        this.fetchWeather()
      },
      data() {
        return {
        }
      },
      computed: {
          ...mapGetters([
              'weather'
          ]),
      },
      methods: {
          ...mapActions([
              'fillWeather'
          ]),
         fetchWeather() {

          fetch('http://api.weatherstack.com/current?access_key=3af74978960c2a744ba2372d42673f6a&query=Helsinki')
          .then(response => response.json())
          .then(response => {
            this.fillWeather(response);
          })
        },
        getWeatherImg(weather) {
          return weather.current.weather_icons[0];
        },
        mutateDateTime(weather) {
          let arr = weather.location.localtime.split(" ");
          let date = arr[0].split('-');
          let time = arr[1];
          return 'Data received at ' + date[2] + "." + date[1] + '.' + date[0] + ' at ' + time
        }
      }
    }
</script>
