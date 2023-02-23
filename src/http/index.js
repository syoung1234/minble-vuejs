import axios from "axios";
import store from "../store";
const http = axios.create({
  headers: { 
      "Content-Type": "application/json",
    },
})

http.interceptors.request.use(
  config => {
    const isAuthenticated = store.getters["isAuthenticated"]
    if (isAuthenticated) {
        config.headers["Authorization"] = `Bearer ${store.getters["getAccessToken"]}`
    } 
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)
// http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

export default http