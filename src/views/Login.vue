<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-8 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">로그인</h4>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <input class="form-control form-control-lg invalid" type="email" placeholder="이메일" name="email" size="lg" v-model="email" />
                    </div>
                    <div class="mb-3">
                      <input type="password" class="form-control form-control-lg invalid" placeholder="비밀번호" name="password" size="lg" v-model="password" />
                    </div>
                    <!-- <argon-switch id="rememberMe">Remember me</argon-switch> -->

                    <div class="text-center">
                      <argon-button @click="postData()"
                      type="button"
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                      >로그인</argon-button>
                    </div>
                    <button type="button" class="btn-naver mt-5" @click="this.$refs.naverLogin.click"><span class="social-font">네이버 로그인</span></button>
                    <a :href="`${apiUrl}/oauth2/authorization/naver`" ref="naverLogin"></a>
                    <div class="mt-2">
                      <a :href="`${apiUrl}/oauth2/authorization/kakao`"><img src="/icon/kakao_login_large_wide.png" class="img-size w-100 social-img"></a>
                    </div>
                    <div class="mt-2">
                      <button type="button" class="btn-google"><span class="social-font" @click="this.$refs.googleLogin.click">구글 로그인</span></button>
                    </div>
                    <a :href="`${apiUrl}/oauth2/authorization/google`" ref="googleLogin"></a>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    <a
                      href="/register"
                      class="text-success text-gradient font-weight-bold me-3"
                    >회원가입</a>
                    <a
                      href="/find-password"
                      class="text-success text-gradient font-weight-bold"
                    >비밀번호 찾기</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "login",
  data() {
        return {
            email: null,
            password: null,
            apiUrl: process.env.VUE_APP_API_URL,
            axiosConfig: {
              headers:{
                "Content-Type": "application/json"
              }
            },
        }
    },
  methods: {
    postData() {
      let saveData = {};
      saveData.email = this.email;
      saveData.password = this.password;

      if (this.email == null || this.password == null) {
          alert("이메일 또는 비밀번호를 입력해주세요.")
          return
      }

      // this.$http.post("/api/login", JSON.stringify(saveData))
      //   .then((response) => {
      //     console.log(response)
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })

      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(response => {
          if (response.data.status == "unconfirmed") {
            // 로그아웃
            this.$store.dispatch("logout", {})
              .then(() => this.$router.push("/complete/register?type=re_request&email="+this.email))
              .catch(() => this.$router.push("/complete/register?type=re_request&email="+this.email))
          } else {
            if (response.data.roleType == "ROLE_STAR") {
              this.$router.push("/post?name="+response.data.nickname);
            } else {
              this.$router.push("/home");
            }
          }

        })
        .catch((error) => {
          console.log(error);
          alert("이메일 또는 비밀번호를 맞지 않습니다.")
        })

      // this.$axios
      // .post("/api/login", JSON.stringify(saveData), axiosConfig)
      // .then((res) => {
      //     console.log(res)
      //     // this.$cookie.set("accessToken", res.data), 1;
      //     // axios.defaults.headers.common["X-AUTH-TOKEN"] = res.data;
      //     this.$router.push("/");
      // })
      // .catch((error) => {  // eslint-disable-line no-unused-vars
      //   alert("이메일 또는 비밀번호를 맞지 않습니다.")
      // })
    },
  },
  components: {
    Navbar,
    ArgonButton,
  },
  created() {
    // console.log(process.env)
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
  

};
</script>
