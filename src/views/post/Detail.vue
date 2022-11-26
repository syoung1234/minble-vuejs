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
      <a :href="`/post/create?num=${id}`">
        <i class="fas fa-pencil-alt text-dark me-2"> 수정</i>
      </a>
    </div>
    <div>
      <a href="javascript:" @click="deletePost">
        <i class="fas fa-trash-alt me-2"> 삭제</i>
        </a>
    </div>
   </Modal>
   <ImageModal v-if="showImageModal" @close="showImageModal = false">
      <div><img class="img-size modal-img-mh" :src="modalFilePath"></div>
      <!-- /default -->
      <!-- footer 슬롯 콘텐츠 -->
      <div class="img-modal-footer">
        <button type="button" class="btn btn-link bg-white w-100" @click="downloadFile">
            다운로드
        </button>
      </div>
   </ImageModal>
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
                    <div class="text-end">
                    <a href="javascript:">
                      <i class="fa fa-ellipsis-v text-xs text-end" @click="showModal = true"></i>
                    </a>
                    </div>
                      <tr>
                          <td width="20%" v-if="postDetail?.profilePath != null">
                          <img :src="postDetail?.profilePath" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td width="20%" v-else>
                          <img src="/img/team-4.53033970.jpg" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td>
                              <span class="text-bold">{{ postDetail?.nickname }}</span> <br>
                              <span class="small">{{ postDetail?.createdAt }}</span>
                          </td>
                      </tr>
                      <tr class="mt-2">
                          <td>
                            <div class="">
                              <span>{{ postDetail?.content }}</span>
                            </div>
                            <div v-for="(file, i) in postDetail?.postFileList" :key="i">
                            <button type="button" class="btn btn-link" @click="showImage(file.filePath, file.filename)">
                              <img class="img-size" :src="file.filePath">
                            </button>
                            </div>
                          </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="javascript:" class="me-2" @click="getFavorite(`${postDetail?.id}`)">
                            <img v-show="postDetail?.favorite == false" class="w-8 me-1 mb-0" src="/icon/hearts--v1.png">
                            <img v-show="postDetail?.favorite == true" class="w-8 me-1 mb-0" src="/icon/full-heart-icon.png">{{ postDetail?.favoriteCount }}
                          </a>
                          <a href="javascript:" class="me-2">
                          <img class="w-7 me-1 mb-0" src="/icon/speech-bubble--v2.png">{{ postDetail?.commentCount }}
                          </a>
                        </td>
                      </tr>
                      <hr>
                      <b>댓글</b>
                      <tr class="mt-3">
                        <td width="85%">
                          <textarea class="textarea-comment-h" v-model="content" placeholder="댓글 쓰기" @keydown="resize" @keyup="resize"></textarea>
                        </td>
                        <td width=15%>
                          <a href="javascript:" @click="postComment">
                            <img class="img-size mb-1" src="/icon/send-message-2-2.png">
                          </a>
                        </td>
                      </tr>
                      <tr v-for="(comment, index) in commentList" :key="index" class="mb-2 align-top">
                        <td width="15%" v-if="comment?.profilePath != null">
                          <img :src="comment?.profilePath" class="rounded-circle img-size border border-2 border-white">
                        </td>
                        <td class="word-break">
                          <span class="text-bold me-1 small">{{ comment?.nickname }}</span> 
                          <span class="small">{{ comment?.content }}</span>
                          <br>
                          <span class="text-xs">{{ comment?.createdAt }}</span> &nbsp;
                          <span class="text-xs">답글 달기</span> &nbsp;
                          <a href="javascript:" @click="deleteComment(comment?.commentId)">
                            <span class="text-xs">삭제</span>
                          </a>
                        </td>
                      </tr>
                      <div class="text-center mb-2" v-if="pageList.nextPage < pageList.totalPages">
                        <a href="javascript:" @click="nextPage()">
                          <img class="w-10 mb-0 mt-3" src="/icon/plus_icon.png" alt="logo">
                        </a>
                      </div>
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
import ImageModal from "@/examples/ImageModal.vue";
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
    ImageModal,
  },
  data() {
      return {
          id: this.$route.query.num,
          showModal: false,
          postDetail: null,
          content: null,
          showImageModal: false,
          modalFilePath: null,
          modalFileName: null,
          commentList: [],
          pageList: [],
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
      await this.$axios.get("/api/post/"+this.id, {
        headers:{
            "X-AUTH-TOKEN": store.state.token.accessToken
        }
      })
        .then((response) => {
          this.postDetail = response.data;
          this.commentList = response.data.commentList;
          this.pageList = response.data.pageList;
        })
        .catch((error)=> {
          console.log(error)
        })
    },
    async postComment() {
      let saveData = {}
      saveData.content = this.content
      saveData.postId = this.id
      await this.$axios.post("/api/comment", saveData, axiosConfig)
        .then(() => {
          this.$router.go()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async deleteComment(commentId) {
      const result = confirm("삭제 하시겠습니까?")
      if (result == false) return;
      await this.$axios.delete(`/api/comment/${commentId}/delete`, axiosConfig)
      .then(() => {
        this.$router.go()
      })
      .catch((error) => {
        console.log(error)
      })
    },
    async getFavorite(postId) {
      let saveData = {};
      saveData.postId = postId;
      await this.$axios.post("/api/favorite", saveData, {
        headers:{
            "X-AUTH-TOKEN": store.state.token.accessToken
        }
      }).then((response) => {
        if (response.data.message == "delete") {
          this.postDetail.favorite = false
        } else {
          this.postDetail.favorite = true
        }
        this.postDetail.favoriteCount = response.data.favoriteCount
        
      })
      .catch((error) => {
        console.log(error)
      })
    },
    async nextPage() {
      await this.$axios.get(`/api/post/${this.id}?page=${this.pageList.page+1}`, {
        headers:{
            "X-AUTH-TOKEN": store.state.token.accessToken
        }
      })
        .then((response) => {
          for (let i = 0; i < response.data.commentList.length; i++) {
            this.commentList.push(response.data.commentList[i])
          }
          this.pageList = response.data.pageList;
        })
        .catch((error)=> {
          console.log(error)
        })
    },
    async deletePost() {
      const result = confirm("삭제 하시겠습니까?")
      if (result == false) return;
      await this.$axios.delete("/api/post/"+this.id+"/delete", {
        headers:{
            "X-AUTH-TOKEN": store.state.token.accessToken
        }
      }).then(() => {
        this.$router.push("/post")
      }).catch((error) => {
        console.log(error)
      })
    },
    downloadFile() {
      try {
      let element = document.createElement('a');
               element.setAttribute('href', `/api/file/post/download/${this.modalFileName}` );
               element.click();
      } catch(error) {
        console.log(error)
      }
    },
    resize(event) {
      let obj = event.target
      obj.style.height = '1px';
      obj.style.height = (10 + obj.scrollHeight) + 'px';
    },
    showImage(filePath, fileName) {
      this.showImageModal = true;
      this.modalFilePath = filePath;
      this.modalFileName = fileName;
    },

  }
 
}

</script>