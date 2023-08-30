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
              <div class="text-end mb-2">
                <a href="/post/create" class="btn mb-0 bg-gradient-dark btn-md null null" v-if="role != null"><i class="fas fa-plus me-2"></i>Add</a>
              </div>
              <div class="card z-index-0">
                <div class="card-body">

                  <h5>STAR를 선택하세요!</h5>
                  <table v-for="(following, i) in followingList" :key="i" border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4">
                    <tr class="pointer" @click="navigateTo(following.nickname)">
                      <td>
                        <img v-if="following?.profilePath" :src="following?.profilePath" class="rounded-circle profile-size border border-2 border-white" alt="est">
                        <img v-else src="/img/team-4.53033970.jpg" class="rounded-circle profile-size border border-2 border-white">
                      </td>
                      <td class="ms-3">
                        <span class="small ms-3">{{ following?.nickname }}</span>
                      </td>
                    </tr>
                  </table>

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
      followingList: [],
      role: null,
      num: null,
    }
  },
  components: {
    Navbar,
    AppFooter,
  },
  created() {
    this.getFollowList();
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
    this.$store.state.name = "";
    this.$route.query.name = "";
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
  methods: {
    async getFollowList() {
      await this.$http.get("/api/follow/list")
          .then((response) => {
            console.log(response);
            this.followingList= response.data;
          })
          .catch((error) => {
            console.log(error);
          })
    },
    navigateTo(nickname) {
      this.$router.push(`/post?name=${nickname}`);
    }
  },



}

</script>