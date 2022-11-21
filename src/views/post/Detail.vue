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
   <Modal v-if="showModal" @close="showModal = false">
   </Modal>
  <main class="main-content mt-8">
    <section>
      <div class="page-header min-vh-100">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-header text-left pt-4">
                <h5>
                  <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                    게시글
                </h5>
            </div>
            <div class="card-body">
              <form role="form">
                  <table border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4" >
                      <i class="fa fa-ellipsis-v text-xs text-end" @click="showModal = true"></i>
                      <tr>
                          <td width="20%" v-if="postDetail?.profilePath != null">
                          <img :src="postDetail?.profilePath" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td width="20%" v-else>
                          <img src="/img/team-4.53033970.jpg" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td>
                              <span>{{ postDetail?.nickname }}</span> <br>
                              <span>{{ postDetail?.createdAt }}</span>
                          </td>
                      </tr>
                      <tr class="mt-2">
                          <td><div class=""><span>{{ postDetail?.content }}</span></div></td>
                      </tr>
                      <tr>
                        <td><img class="w-8 me-1 mb-0" src="/icon/hearts--v1.png" alt="logo">{{ postDetail?.favoriteCount }}
                        <img class="w-7 me-1 mb-0" src="/icon/speech-bubble--v2.png" alt="logo">{{ postDetail?.commentCount }}</td>
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
import Modal from "@/examples/PostModal.vue";
import store from "@/store/index.js"

const body = document.getElementsByTagName("body")[0];
const axiosConfig = {
        headers:{
            "X-AUTH-TOKEN": store.state.token.accessToken
        }
};

export default {
  name: "post",
  components: {
    Navbar,
    AppFooter,
    Modal,
  },
  data() {
      return {
          id: this.$route.query.num,
          showModal: false,
          postDetail: null,
      }
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
    this.getPost();
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
  methods: {
    async getPost() {
      await this.$axios.get("/api/post/"+this.id, axiosConfig)
        .then((response) => {
          this.postDetail = response.data;
        })
        .catch((error)=> {
          console.log(error)
        })
    }

  }
 
}

</script>