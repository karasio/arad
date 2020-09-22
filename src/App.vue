<template>
    <div id="app" class="container">
        <div class="row">
            <div class="col-md-9">
                <div id="map" class="map"></div>
            </div>
            <div class="col-md-3">
                <div
                        class="form-check"
                        v-for="layer in layers"
                        :key="layer.id"
                >
                    <label class="form-check-label">
                        <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="layer.active"
                                @change="layerChanged(layer.id, layer.active)"
                        />
                        {{ layer.name }}
                    </label>
                </div>
                <div id="weather">
                    <Weather/>
                </div>
            </div>
        </div>
        <div id="inputdiv">
            <form @submit.prevent="handleSearch" id="inputForm" class="row">
                <div class="col-md-4">
                    <p>From:</p>
                    <b-dropdown :text="whereFrom.name" >
                        <b-dropdown-item-button
                                v-for="station in bikes"
                                :key="station.stationId"
                                @click.prevent="pickupClickedStation(station)">
                            {{ station.name }}
                        </b-dropdown-item-button>
                    </b-dropdown>
                </div>
                <div class="col-md-4">
                    <p>To:</p>
                    <input
                            id="destInput"
                            type="text"
                            ref="destination"
                            v-model="whereTo"
                            placeholder="Annankatu 1, Helsinki"
                    />
                </div>
                <button class="col-md-2">Search route</button>
            </form>
        </div>
        <div id="list" class="flexbox btm">
            <citybike :items="bikes"/>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    import L from 'leaflet';
    import 'leaflet-routing-machine';

    import {Icon} from "leaflet";
    import 'leaflet/dist/leaflet.css';
    import { OpenStreetMapProvider } from 'leaflet-geosearch';


    import Weather from "@/components/Weather";
    import Citybike from "@/components/Citybike";

    const provider = new OpenStreetMapProvider();


    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    export default {
        name: "Example",
        components: {
            Weather,
            Citybike
        },
        computed: {
            ...mapGetters([
                "bikes"
            ]) ,
        },

        mounted() {
            this.getBikeData();
            this.initMap();
            this.initLayers();
        },
        data() {
            return {
                map: null,
                tileLayer: null,
                layers: [
                    {
                        id: 0,
                        name: 'Show citybike stations?',
                        active: false,
                        features: [],
                    }
                ],
                whereTo: '',
                whereFrom: {name: 'Choose station',},
                routingControl: "",
            };
        },
        methods: {
            initMap() {
                this.map = L.map('map').setView([60.169667, 24.934885], 12);
                this.tileLayer = L.tileLayer(
                    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                    {
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                    }
                );
                this.tileLayer.addTo(this.map);
            },
            initLayers() {
                this.layers.forEach((layer) => {
                    const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                    const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');

                    markerFeatures.forEach((feature) => {
                        feature.leafletObject = L.marker(feature.coords)
                            .bindPopup(feature.name);
                    });
                    polygonFeatures.forEach((feature) => {
                        feature.leafletObject = L.polygon(feature.coords)
                            .bindPopup(feature.name);
                    });
                });
            },
            layerChanged(layerId, active) {
                const layer = this.layers.find(layer => layer.id === layerId);
                layer.features.forEach((feature) => {
                    if (active) {
                        feature.leafletObject.addTo(this.map);
                    } else {
                        feature.leafletObject.removeFrom(this.map);
                    }
                })
            },
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
                        this.fillBikes(res.data.bikeRentalStations);
                        this.fillFeatures(JSON.parse(JSON.stringify(res.data.bikeRentalStations)));
                    });
            },
            ...mapActions([
                "fillBikes"
            ]),
            fillFeatures(tempbikes) {
                tempbikes.forEach(station => {
                    station.coords = [station.lat, station.lon];
                    station.type = 'marker';
                    station.leafletObject = L.marker(station.coords).bindPopup(station.name + "<br>Bikes: " + station.bikesAvailable + "<br>Space: " + station.spacesAvailable);
                });
                this.layers[0].features = tempbikes;
            },
            async handleSearch() {
                if (this.routingControl !== "") {
                    this.map.removeControl(this.routingControl);
                }
                const results = await provider.search({ query: this.whereTo});
                // console.log(results);
                let from = [this.whereFrom.lat, this.whereFrom.lon];
                let to = [results[0].y, results[0].x];
                // console.log("from ", from, " to ", to);

                this.routingControl = L.Routing.control({
                    waypoints: [from, to],
                });

                this.routingControl.addTo(this.map);
            },
            pickupClickedStation(station) {
                // console.log(station.name);
                this.whereFrom = station;
            },
        }
    };
</script>

<style>
    .form-check-label {
        padding-bottom: 1.5rem;
        padding-top: 1.5rem;
    }

    #inputdiv {
        padding-top: 1.5rem;
    }
    .map {
        height: 600px;
    }

    .leaflet-routing-alt {
        background-color: white;
        width: 300px;
    }
</style>
