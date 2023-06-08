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
  <main class="main-content mt-8">
    <section>
      <div class="page-header min-vh-50">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-header mt-2">
                <h5>
                <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-m text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                계정 선택하기
                </h5>
            </div>
            <div class="card-body">
                <div class="mb-5 text-center">
                  <button type="button" class="btn p-4 w-80" @click="postTester('star')">STAR 계정으로 체험하기</button>
                </div>
                <div class="text-center">
                  <button type="button" class="btn bg-gradient-dark p-4 w-80" @click="postTester('user')">USER 계정으로 체험하기</button>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
    </div>
    </div>
    </div>
    </section>
  </main>
  <app-footer />
</template>
<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";

const body = document.getElementsByTagName("body")[0];
export default {
  name: "chooseTester",
  data() {
    return {
      followingList: [],
      num: null,
      accessToken: this.$route.query.accessToken,
      email: null,
    }
  },
  components: {
    Navbar,
    AppFooter,
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
  methods: {
      postTester(type) {
        if (type == "star") {
            this.email = "star1@minble.com"
        } else {
            this.email = "test2@minble.com"
        }
        this.$store
        .dispatch("login", {
          email: this.email,
          password: "test1234",
        })
        .then(response => {
          if (response.data.status == "unconfirmed") {
            // 로그아웃
            this.$store.dispatch("logout", {})
              .then(() => this.$router.push("/complete/register?type=re_request&email="+this.email))
              .catch(() => this.$router.push("/complete/register?type=re_request&email="+this.email))
          } else {
            if (response.data.roleType == "ROLE_STAR_TEST") {
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
      }
  },
}

</script>