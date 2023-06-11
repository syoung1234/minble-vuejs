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
      <div class="page-header min-vh-100">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0 msg-h">
            <div class="card-header mt-2">
              <router-link to="/home" v-if="this.$store.state.token.accessToken">
                  <img class="img-size w-10" src="/icon/x-icon.png">
              </router-link>
              <span class="text-bold ms-3">팔로우 추가하기</span>
            </div>
            <div class="card-body">
                <div class="scroll mb-5 float-left">
                <a href="javascript:" v-for="(following, i) in followingList" :key="i" @click="postFollow(following.nickname)">
                  <figure class="float-left profile-area me-2">
                      <img :src="following?.profilePath" class="rounded-circle profile-size border border-2 border-white" alt="est">
                    <figcaption class="text-center"><span class="small">{{ following?.nickname }}</span></figcaption>
                  </figure>
                </a>
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
  name: "start",
  data() {
    return {
      followingList: [],
      num: null,
      accessToken: this.$route.query.accessToken,
    }
  },
  components: {
    Navbar,
    AppFooter,
  },
  created() {
    this.getSocial();
    this.getList();
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
    getSocial() {
      if (this.accessToken) {
        this.$store
        .dispatch("socialLogin", {
          accessToken: this.accessToken
        })
        .then(() => {
          this.$router.push("/home");
        })
        .catch((error) => {
          console.log(error)
        })
      }
    },
    async getList() { // 목록
      await this.$http.get("/api/follow/list")
        .then((response) => {
          this.followingList = response.data
        })
        .catch((error)=> {
          console.log(error)
        })
    },
    async postFollow(nickname) { // 팔로우 하기 
      if (this.$store.state.token.accessToken) {
        
        const result = confirm("팔로우 하시겠습니까?")
        if (result == false) return;
        let saveData = {}
        saveData.nickname = nickname
        await this.$http.post("/api/follow/create", saveData)
          .then((response) => {
            // this.$router.go()
            if (response.data == "success") {
              this.$router.push("/home")
            } else {
              alert("TESTER를 이용해주세요");
            }
            
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        alert("로그인이 필요한 서비스입니다.");
        this.$router.push("/login")
      }
    },
  },

}

</script>