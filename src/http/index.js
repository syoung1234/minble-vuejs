import axios from "axios";
import store from "../store";
import jwt from "../common/jwt";
import router from "../router";

const http = axios.create({
  headers: { 
      baseURL: process.env.VUE_APP_API_URL,
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
    const originalRequest = error.config;
    return Promise.reject(error);
  }
)
// http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"


let isRefreshing = false;

http.interceptors.response.use(
  response => {
    // HTTP 응답이 성공적으로 수신된 경우 실행됩니다.
    return response;
  },
  error => {
    // 원래의 요청 설정 저장
    const originalRequest = error.config;

    if (error.response && error.response.data.message == "Unauthorized Member" && !originalRequest._retry) {
      // `originalRequest._retry`는 이 요청이 이미 재시도 된 것인지 확인하기 위한 플래그입니다.
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        // token 요청
        return http.post("/api/refresh-token")
          .then((response) => {
            jwt.saveToken(response.data);
            
            // 새로운 토큰으로 원래의 요청 헤더를 설정하고 원래 요청을 재실행
            originalRequest.headers["Authorization"] = `Bearer ${response.data}`;
            return http(originalRequest);
          })
          .catch(() => {
            router.push("/login");
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
    }

    return Promise.reject(error);
  }
);


export default http