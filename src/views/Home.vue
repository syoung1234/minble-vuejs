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
                  <a href="/start" class="text-center">
                    <img src="/icon/plus_icon.png" class="rounded-circle profile-size border border-2 border-white">
                  <figcaption class="text-center"><span class="small">팔로잉 추가</span></figcaption>
                  </a>
                </figure>
              </div>

              <form role="form">
                <h5>게시글</h5>
                  <table border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4" v-for="(post,index) in postList" :key="index">
                  <div class="text-end">
                    <a href="javascript:" v-if="nickname == post?.nickname">
                      <i class="fa fa-ellipsis-v text-xs" @click="postModal(post?.id)"></i>
                    </a>
                  </div>
                      <tr>
                          <td width="20%" v-if="post?.profilePath != null">
                          <img :src="post?.profilePath" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td width="20%" v-else>
                          <img src="/img/team-4.53033970.jpg" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td>
                              <span>{{ post?.nickname }}</span> <br>
                              <span class="small">{{ post?.createdAt }}</span>
                          </td>
                      </tr>
                      <tr class="mt-2 mb-2">
                        <a :href="`/post/detail?num=${post.id}`">
                          <td><div class="text-ellipsis"><span>{{ post?.content }}</span>
                          <img v-if="post?.postFileList[0]" class="img-size me-1 mb-0" :src="post?.postFileList[0].filePath"/>
                          </div>
                          </td>
                        </a>
                      </tr>
                      <tr>
                        <td>
                          <a href="javascript:" class="me-2" @click="getFavorite(`${post?.id}`, index)">
                            <img v-show="post?.favorite == false" class="w-8 me-1 mb-0" src="/icon/hearts--v1.png">
                            <img v-show="post?.favorite == true" class="w-8 me-1 mb-0" src="/icon/full-heart-icon.png">{{ post?.favoriteCount }}
                          </a>
                          <a href="javascript:" class="me-2">
                          <img class="w-7 me-1 mb-0" src="/icon/speech-bubble--v2.png">{{ post?.commentCount }}
                          </a>
                        </td>
                      </tr>
                  </table>
              </form>
              <div class="text-center mb-2" v-if="pageList?.page < pageList?.totalPages-1">
                <a href="javascript:" @click="nextPage()">
                  <img class="w-10 mb-0 mt-3" src="/icon/plus_icon.png" alt="logo">
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
import Modal from "@/examples/PostModal.vue";

const body = document.getElementsByTagName("body")[0];
export default {
  name: "Home",
  data() {
    return {
      postList : [],
      followingList: [],
      role: null,
      pageList: null,
      showModal: false,
      num: null,
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        }
      },
    }
  },
  components: {
    Navbar,
    AppFooter,
    Modal,
  },
  created() {
    this.getList();
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
        await this.$axios.get("/api/mypage", this.axiosConfig)
          .then((response) => {
            console.log(response)
            this.$store.state.nickname = response.data.nickname
            console.log(this.$store.state.nickname);
          })
          .catch((error) => {
            console.log(error)
          })
    },
    async getList() { // 목록
      await this.$axios.get("/api/post", this.axiosConfig)
        .then((response) => {
          this.postList = response.data.postList;
          this.followingList = response.data.following;
          this.role = response.data.role;
          this.pageList = response.data.pageList;
        })
        .catch((error)=> {
          console.log(error)
        })
    },
    async nextPage() { // 더보기
      await this.$axios.get(`/api/post?page=${this.pageList.page+1}`, this.axiosConfig)
        .then((response) => {
          for (let i = 0; i < response.data.postList.length; i++) {
            this.postList.push(response.data.postList[i])
          }
          this.pageList = response.data.pageList;
        })
        .catch((error)=> {
          console.log(error)
        })
    },
    async getFavorite(postId, index) {
      let saveData = {};
      saveData.postId = postId;
      await this.$axios.post("/api/favorite", saveData, this.axiosConfig)
      .then((response) => {
        if (response.data.message == "delete") {
          this.postList[index].favorite = false
        } else {
          this.postList[index].favorite = true
        }
        this.postList[index].favoriteCount = response.data.favoriteCount
        
      })
      .catch((error) => {
        console.log(error)
      })
    },
    async deletePost() {
      const result = confirm("삭제 하시겠습니까?")
      if (result == false) return;
      await this.$axios.delete("/api/post/"+this.num+"/delete", this.axiosConfig)
      .then(() => {
        this.$router.go()
      }).catch((error) => {
        console.log(error)
      })
    },
    postModal(num) {
      this.showModal = true;
      this.num = num;
    },
  },

  

}

</script>