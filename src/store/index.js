import { createStore } from "vuex";
import jwt from "../common/jwt";
import axios from "axios"

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    count: 0,
    token: {
      accessToken: jwt.getToken(),
    },
    isAuthenticated: !!jwt.getToken(),
    name: null,
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    navbarMinimize(state) {
      const sidenav_show = document.querySelector(".g-sidenav-show");

      if (sidenav_show.classList.contains("g-sidenav-hidden")) {
        sidenav_show.classList.remove("g-sidenav-hidden");
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
    updateName(state, payload) {
      state.name = payload;
    },
    login: function (state, payload = {}) {
      state.token.accessToken = payload.accessToken
      state.isAuthenticated = true
      jwt.saveToken(payload.accessToken)
    },
    logout: function (state = {}) {
      state.token.accessToken = ""
      state.isAuthenticated = false
      jwt.destroyToken()
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
    login: function (context, payload) {
      const axiosConfig = {
        headers:{
            "Content-Type": "application/json"
        }
      }
      let params = {
          email: payload.email,
          password: payload.password
      }
      return new Promise((resolve, reject) => {
          axios
              .post("/api/login", JSON.stringify(params), axiosConfig)
              .then(response => {
                  const { data } = response
                  context.commit("login", {
                      accessToken: data,
                  })
                  resolve(response)
              })
              .catch(error => {
                  reject(error)
              })
      })
  },
  logout: function (context, payload) {
    return new Promise(resolve => {
      setTimeout(function() {
        context.commit("logout", payload)
        resolve({})
      }, 1000)
    })
  }
},
  getters: {
    getAccessToken: function (state) {
      return state.token.accessToken
    },
    isAuthenticated: function (state) {
      return state.isAuthenticated
    },
  }
});
