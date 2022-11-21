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
          <div class="scroll">
            <a href="" v-for="(following, i) in followingList" :key="i">
                <img v-if="following?.profilePath" :src="following?.profilePath" class="rounded-circle profile-size border border-2 border-white">
                <img v-else src="/img/team-4.53033970.jpg" class="rounded-circle profile-size border border-2 border-white">
            </a>
          </div>
            <div class="text-end mb-2">
                <a href="/post/create" class="btn mb-0 bg-gradient-dark btn-md null null"><i class="fas fa-plus me-2"></i>Add</a>
            </div>
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>Post</h5>
            </div>
            <div class="card-body">
              <form role="form">
                  <table border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4" v-for="(post,index) in postList" :key="index">
                    <i class="fa fa-ellipsis-v text-xs text-end"></i>
                      <tr>
                          <td width="20%" v-if="post?.profilePath != null">
                          <img :src="post?.profilePath" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td width="20%" v-else>
                          <img src="/img/team-4.53033970.jpg" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td>
                              <span>{{ post?.nickname }}</span> <br>
                              <span>{{ post?.createdAt }}</span>
                          </td>
                      </tr>
                      <tr class="mt-2">
                        <a href="" @click="getDetail(`${post?.id}`)">
                          <td><div class="text-ellipsis"><span>{{ post?.content }}</span></div></td>
                        </a>
                      </tr>
                      <tr>
                        <td><img class="w-8 me-1 mb-0" src="/icon/hearts--v1.png" alt="logo">{{ post?.favoriteCount }}
                        <img class="w-7 me-1 mb-0" src="/icon/speech-bubble--v2.png" alt="logo">{{ post?.commentCount }}</td>
                      </tr>
                  </table>
              </form>
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
import store from '@/store/index.js';
const body = document.getElementsByTagName("body")[0];
export default {
  name: "post",
  data() {
    return {
      postList : [],
      followingList: [],
    }
  },
  components: {
    Navbar,
    AppFooter,
  },
  created() {
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
    async getList() {
      await this.$axios.get("/api/post", {
        headers:{
            "X-AUTH-TOKEN": store.state.token.accessToken
        }
      })
        .then((response) => {
          console.log(response.data);
          this.postList = response.data.postList;
          this.followingList = response.data.following;
        })
        .catch((error)=> {
          console.log(error)
        })
    },
     getDetail(num) {
      let params = {
        "num": num
      }
      this.$router.push({path: "/post/detail", query: params})
    }
  },

  

}

</script>