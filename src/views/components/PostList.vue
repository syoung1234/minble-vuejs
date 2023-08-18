<template>
  <form role="form">
    <h5 class="pb-1">게시글</h5>
    <table border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4" v-for="(post,index) in postList" :key="index">
      <div class="text-end">
        <a href="javascript:" v-if="nickname == post?.nickname">
          <i class="fa fa-ellipsis-v text-xs" @click="postModal(post?.id)"></i>
        </a>
      </div>
      <tr>
        <td width="20%" v-if="post?.profilePath != null">
          <img :src="post?.profilePath" class="rounded-circle img-size border border-2 border-white" alt="">
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
            <img v-if="post?.postFileList[0]" class="img-size me-1 mb-0" :src="post?.postFileList[0]"/>
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
  <div class="text-center mb-2" v-if="!lastPage">
    <a href="javascript:" @click="nextPage()">
      <img class="w-10 mb-0 mt-3" src="/icon/plus_icon.png" alt="logo">
    </a>
  </div>
</template>
<script>
export default {
  name: "PostList",
  data() {
    return {
      postList: [],
      pageList: null,
      lastPage: true,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() { // 목록
      this.$store.state.name = null
      await this.$http.get("/api/post")
          .then((response) => {
            console.log(response);
            this.fetchPostData(response);
          })
          .catch((error)=> {
            console.log(error)
          })
    },
    async nextPage() { // 더보기
      await this.$http.get(`/api/post?page=${this.pageList.page+1}`)
          .then((response) => {
            for (let i = 0; i < response.data.content.length; i++) {
              this.postList.push(response.data.content[i])
            }
            this.pageList = response.data.pageList;
          })
          .catch((error)=> {
            console.log(error)
          })
    },

    fetchPostData(response) {
      console.log(response);
      this.postList = response.data.content;
      this.role = response.data.role;
      this.pageList = response.data.pageList;
      this.lastPage = response.data.last;
    },
    async getFavorite(postId, index) {
      let saveData = {};
      saveData.postId = postId;
      await this.$http.post("/api/favorite", saveData)
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
      await this.$http.delete("/api/post/"+this.num+"/delete")
          .then(() => {
            this.$router.go()
          }).catch((error) => {
            console.log(error)
          })
    },
  }
}

</script>