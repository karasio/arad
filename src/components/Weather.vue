<template>
    <div :items="this.weather">
        <h3 :items="this.weather">Weather in {{this.weather.request.query}}</h3>
        <p> {{ this.weather.current.weather_descriptions[0] }}
        <br> {{ mutateDateTime() }} </p>
        <table >
            <tbody>
            <tr>
                <td>
                    <img :src="getWeatherImg()" />
                </td>
                <td>
                    <h3 id="temperature">{{ this.weather.current.temperature }}°c</h3>
                </td>
            </tr>
            <tr>
                <td>Wind</td>
                <td>{{ this.weather.current.wind_speed }} km/h from {{ this.weather.current.wind_dir }}</td>
            </tr>
            <tr>
                <td>Cloud cover level</td>
                <td> {{ this.weather.current.cloudcover }}% </td>
            </tr>
            <tr>
                <td>Pressure</td>
                <td>{{ this.weather.current.pressure }} mb</td>
            </tr>
            <tr>
                <td>Humidity</td>
                <td>{{ this.weather.current.humidity }}%</td>
            </tr>
            <tr>
                <td>Geo coords</td>
                <td>{{ this.weather.location.lat }}, {{ this.weather.location.lon}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
      name: "Weather",
      mounted() {
        this.fetchWeather()
      },
      data() {
        return {
            weather: Object,
        }
      },
      methods: {
        fetchWeather() {
          fetch('http://api.weatherstack.com/current?access_key=3af74978960c2a744ba2372d42673f6a&query=Helsinki')
          .then(response => response.json())
          .then(response => {
            console.log(response);
            console.log(typeof response);
            this.weather = response;
          })
        },
        getWeatherImg() {
          console.log(this.weather.current.weather_icons[0]);
          return this.weather.current.weather_icons[0];
        },
        mutateDateTime() {
          let arr = this.weather.location.localtime.split(" ");
          let date = arr[0].split('-');
          let time = arr[1];
          return 'Data received at ' + date[2] + "." + date[1] + '.' + date[0] + ' at ' + time
        }
      }
    }
</script>
