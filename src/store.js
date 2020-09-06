import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bikes: ["kissa"],
  },

  getters: {
    bikes: state => state.bikes,
  },

  mutations: {
    FILL_BIKES(state, bikes) {
      state.bikes = bikes
    }
  },

  actions: {
    fillBikes(ctx, bikes) {
      ctx.commit('FILL_BIKES', bikes)
    },
  }
});
