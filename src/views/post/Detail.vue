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
      <div class="page-header">
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
                    <a href="javascript:" v-if="myNickname == postDetail?.nickname">
                      <i class="fa fa-ellipsis-v text-xs text-end" @click="showModal = true"></i>
                    </a>
                    </div>
                      <tr>
                          <td width="20%" v-if="postDetail?.profilePath != null">
                          <img :src="postDetail?.profilePath" class="rounded-circle img-size border border-2 border-white">
                          </td>
                          <td>
                              <span class="text-bold">{{ postDetail?.nickname }}</span> <br>
                              <span class="small">{{ postDetail?.createdAt }}</span>
                          </td>
                      </tr>
                      <tr class="mt-2">
                          <td>
                            <div class="">
                              <p class="content-preline">{{ postDetail?.content }}</p>
                            </div>
                            <div v-for="(file, i) in postDetail?.postFileList" :key="i">
                            <button type="button" class="btn btn-link" @click="showImage(file.filePath, file.fileName)">
                              <img class="img-size" :src="file.filePath">
                            </button>
                            </div>
                          </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="javascript:" class="me-2" @click="getFavorite(`${postDetail?.postId}`)">
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
                          <a href="javascript:" @click="postComment(null)">
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
                          <p class="small content-preline mb-0">{{ comment?.content }}</p>
                          <span class="text-xs">{{ comment?.createdAt }}</span> &nbsp;
                          <a href="javascript:"><span class="text-xs" @click="displayReply(comment?.id)">답글 달기</span></a> &nbsp;
                          <a href="javascript:" @click="deleteComment(comment?.id)" v-if="myNickname == comment.nickname">
                            <span class="text-xs">삭제</span>
                          </a>
                          <br>

                          <div :ref="`replyDisplay${comment?.id}`" style="display: none;">
                          <textarea class="textarea-comment-h w-80" :ref="`reply${comment?.id}`" placeholder="답글 쓰기" @keydown="resize" @keyup="resize"></textarea> &nbsp;
                            <a href="javascript:" @click="postComment(comment?.id)">
                              <img class="img-size mb-1 w-10 align-initial" src="/icon/send-message-2-2.png">
                            </a>
                          </div>
                          <div :ref="`replyListDisplay${comment?.id}`" style="display: none;">
                          <table>
                            <tr v-for="(reply, i) in replyList[comment.id]" :key="i" class="mb-2 align-top">
                              <td width="15%" v-if="reply?.profilePath != null">
                                <img :src="reply?.profilePath" class="rounded-circle img-size border border-2 border-white">
                              </td>
                              <td>
                              <span class="text-bold me-1 small">{{ reply?.nickname }}</span>
                              <p class="small content-preline mb-0">{{ reply?.content }}</p>
                              <span class="text-xs">{{ reply?.createdAt }}</span> &nbsp;
                              <a href="javascript:" @click="deleteReply(reply?.id)" v-if="myNickname == reply.nickname">
                                <span class="text-xs">삭제</span>
                              </a>
                              </td>
                            </tr>
                            </table>
                          </div>
                          <a href="javascript:" v-if="comment?.replyCount > 0">
                          <span class="text-xs" @click="displayReplyList(comment?.id)" v-if="replyList[comment.id] && comment.replyCount - replyList[comment.id].replyCount > 0">⎯ 답글 {{ comment.replyCount - replyList[comment.id].replyCount }}개 보기</span>
                          <span class="text-xs" @click="displayReplyList(comment?.id)" v-else-if="replyList[comment.id] && comment.replyCount - replyList[comment.id].replyCount < 0"></span>
                          <span class="text-xs" @click="displayReplyList(comment?.id)" v-else>⎯ 답글 {{ comment.replyCount }}개 보기</span>
                          </a>
                        </td>
                      </tr>
                      <tr>
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

const body = document.getElementsByTagName("body")[0];

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
          myNickname: null,
          replyList: [],
      }
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
    this.getPost();
    this.getNickname();
    this.getComment();
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
        await this.$http.get("/api/mypage")
          .then((response) => {
            console.log(response)
            this.myNickname = response.data.nickname
          })
          .catch((error) => {
            console.log(error)
          })
    },
    // post 랑 comment 따로 요청하기
    async getPost() {
      await this.$http.get("/api/post/"+this.id)
        .then((response) => {
          console.log(response)
          this.postDetail = response.data;
        })
        .catch((error)=> {
          console.log(error)
        })
    },
    async getComment() {
      await this.$http.get("/api/comment?postId="+this.id)
          .then((response) => {
            console.log(response);
            this.commentList = response.data.content
          })
          .catch((error) => {
            console.log(error)
          })
    },
    async postComment(commentId) {
      let depth = 0;
      let commentContent = this.content 

      if (commentId > 0) {
        depth = 1;
        commentContent = this.$refs["reply"+commentId].value
      }

      let saveData = {}
      saveData.content = commentContent
      saveData.postId = this.id
      saveData.parentId = commentId
      saveData.depth = depth

      await this.$http.post("/api/comment", saveData)
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
      await this.$http.delete(`/api/comment/${commentId}/delete`)
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
      await this.$http.post("/api/favorite", saveData)
      .then((response) => {
        this.postDetail.favorite = response.data.like
        this.postDetail.favoriteCount = response.data.favoriteCount

      })
      .catch((error) => {
        console.log(error)
      })
    },
    async deletePost() {
      const result = confirm("삭제 하시겠습니까?")
      if (result == false) return;
      await this.$http.delete("/api/post/"+this.id+"/delete")
      .then(() => {
        this.$router.push("/post")
      }).catch((error) => {
        console.log(error)
      })
    },
    downloadFile() {
      try {
      let element = document.createElement('a');
               element.setAttribute('href', `${this.modalFilePath}` );
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
    displayReply(commentId) {
      if (this.$refs["replyDisplay"+commentId].style.display == "") {
        this.$refs["replyDisplay"+commentId].style.display = "none"
      } else {
        this.$refs["replyDisplay"+commentId].style.display = ""
      }
    },
    displayReplyList(commentId) {
      let replyPage;
      if (this.replyList[commentId]) {
        replyPage = this.replyList[commentId].page+1;
      } else {
        replyPage = 0;
      }
      this.$http.get(`/api/comment/${commentId}/children?page=${replyPage}`)
      .then((response) => {
        console.log(response)
        if (this.replyList[commentId]) {
          for (let i = 0; i < response.data.content.length; i++) {
            this.replyList[commentId].push(response.data.content[i])
          }
        } else {
          this.replyList[commentId] = response.data.content;
        }

        this.replyList[commentId].replyCount = (response.data.number+1) * response.data.size;
        this.replyList[commentId].page = response.data.number;

      })
      .catch((error) => {
        console.log(error)
      })
      if (this.$refs["replyListDisplay"+commentId].style.display == "none") {
        this.$refs["replyListDisplay"+commentId].style.display = ""
      } 
    },
    async deleteReply(replyId) {
      const result = confirm("삭제 하시겠습니까?")
      if (result == false) return;
      this.$http.delete(`/api/reply/${replyId}`)
      .then(() => {
        this.$router.go();
      })
      .catch((error) => {
        console.log(error)
      })
    },

  }
 
}

</script>