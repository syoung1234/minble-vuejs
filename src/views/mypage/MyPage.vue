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
      <div class="page-header">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-body">
                <h5 class="mb-4">마이페이지</h5>
                <div class="mb-5">
                    <a href=""><img :src="profilePath" class="rounded-circle img-size border border-2 border-white w-30"></a>
                    <span class="text-bold text-xl me-1">{{ nickname }}</span>
                    <a href="">
                      <i class="fas fa-pencil-alt color-gray me-2"></i>
                    </a>
                </div>
                <div class="mb-3">
                    <a href=""><span class="text-bold text-xl">비밀번호 변경</span></a>
                </div>
                <div class="mb-3">
                    <a href=""><span class="text-bold text-xl">구매내역</span></a>
                </div>
                <div class="mb-3">
                    <a href=""><span class="text-bold text-xl">작성한 댓글</span></a>
                </div>

            </div>
          </div>
        </div>
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
  name: "Home",
  data() {
    return {
      showModal: false,
      name: this.$route.query.name,
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        }
      },
      profilePath: null,
      nickname: null,
    }
  },
  components: {
    Navbar,
    AppFooter,
  },
  created() {
    this.getNickname();
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
    async getNickname() {
        this.$store.state.name = this.name;
        await this.$axios.get("/api/mypage", this.axiosConfig)
          .then((response) => {
            console.log(response)
            if (response.data == '') {
              this.$store.dispatch("logout", {})
              .then(() => this.$router.push("/start"))
              .catch(({ message }) => alert(message))
            }
            this.$store.state.nickname = response.data.nickname
            this.profilePath = response.data.profilePath
            this.nickname = response.data.nickname
            console.log(this.$store.state.nickname);
          })
          .catch((error) => {
            console.log(error)
          })
    },
    async postSubscriber() {
        const saveData = {};
        saveData.nickname = this.name;
        await this.$axios.post("/api/subscriber", saveData, this.axiosConfig)
            .then((response) => {
                if (response.data.includes("already")) {
                    alert("이미 구독 서비스 중입니다.")
                }
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
  },

  

}

</script>