import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bikes: ["kissa"],
    weather: []
  },

  getters: {
    bikes: state => state.bikes,
    weather: state => state.weather,
  },

  mutations: {
    FILL_BIKES(state, bikes) {
      state.bikes = bikes
    },
    FILL_WEATHER(state, weather) {
      state.weather = weather;
    }
  },

  actions: {
    fillBikes(ctx, bikes) {
      ctx.commit('FILL_BIKES', bikes)
    },
    fillWeather(ctx, weather) {
      ctx.commit('FILL_WEATHER', weather);
    }
  }
});
