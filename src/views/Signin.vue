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
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">로그인</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <input class="form-control form-control-lg invalid" type="email" placeholder="이메일" name="email" size="lg" v-model="email" />
                    </div>
                    <div class="mb-3">
                      <input type="password" class="form-control form-control-lg invalid" placeholder="비밀번호" name="password" size="lg" v-model="password" />
                    </div>
                    <argon-switch id="rememberMe">Remember me</argon-switch>

                    <div class="text-center">
                      <argon-button @click="postData()"
                      type="button"
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                      >Sign in</argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                    >Sign up</a>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
const axiosConfig = {
        headers:{
            "Content-Type": "application/json"
        }
    }
export default {
  name: "signin",
  data() {
        return {
            email: null,
            password: null,
        }
    },
  methods: {
    postData() {
      console.log(this.email)
      console.log(this.password)
        let saveData = {};
        saveData.email = this.email;
        saveData.password = this.password;

        if (this.email == null || this.password == null) {
            alert("이메일 또는 비밀번호를 입력해주세요.")
            return
        }

      this.$axios
      .post("/api/login", JSON.stringify(saveData), axiosConfig)
      .then((res) => {
          console.log(res)
          // this.$cookie.set("accessToken", res.data), 1;
          // axios.defaults.headers.common["X-AUTH-TOKEN"] = res.data;
          this.$router.push("/");
      })
      .catch((error) => {  // eslint-disable-line no-unused-vars
        alert("이메일 또는 비밀번호를 맞지 않습니다.")
      })
    }
  },
  components: {
    Navbar,
    ArgonSwitch,
    ArgonButton,
  },
  created() {
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
