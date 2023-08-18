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
    <div class="mb-1">
      <a :href="`/post/create?num=${num}`">
        <i class="fas fa-pencil-alt text-dark me-2"> 수정</i>
      </a>
    </div>
    <div>
      <a href="javascript:" @click="deletePost">
        <i class="fas fa-trash-alt me-2"> 삭제</i>
      </a>
    </div>
  </Modal>
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

              <div class="scroll mb-5 float-left">
                <h5>나의 팔로잉 목록</h5>
                <a :href="`/post?name=${following.nickname}`" v-for="(following, i) in followingList" :key="i">
                  <figure class="float-left profile-area me-2">
                      <img v-if="following?.profilePath" :src="following?.profilePath" class="rounded-circle profile-size border border-2 border-white" alt="est">
                      <img v-else src="/img/team-4.53033970.jpg" class="rounded-circle profile-size border border-2 border-white">
                    <figcaption class="text-center"><span class="small">{{ following?.nickname }}</span></figcaption>
                  </figure>
                </a>
                <figure class="float-left profile-area me-2">
                  <router-link to="/start" class="text-center">
                    <img src="/icon/plus_icon.png" class="rounded-circle profile-size border border-2 border-white">
                  <figcaption class="text-center"><span class="small">팔로잉 추가</span></figcaption>
                  </router-link>
                </figure>
              </div>

              <div v-if="followingList.length > 0">
                <PostList />
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
import Modal from "@/examples/PostModal.vue";
import PostList from "@/views/components/PostList.vue";

const body = document.getElementsByTagName("body")[0];
export default {
  name: "Home",
  data() {
    return {
      followingList: [],
      role: null,
      showModal: false,
      num: null,
    }
  },
  components: {
    Navbar,
    AppFooter,
    Modal,
    PostList,
  },
  created() {
    this.getFollowList();
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

    postModal(num) {
      this.showModal = true;
      this.num = num;
    },
  },



}

</script>