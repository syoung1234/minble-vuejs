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
                
            </div>
          <div class="card z-index-0">
            <div class="card-header pt-4">
                <h5>
                  <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                  <span>게시글 작성</span>
                  <button type="button" class="btn mb-0 bg-gradient-dark btn-md align-right null null" @click="postData">등록</button>
                </h5>
            </div>
            <div class="card-body">
              <form role="form">
                  <table border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4" >
                      <tr>
                        <textarea class="form-control form-control-lg invalid" v-model="content"></textarea>
                      </tr>
                  </table>
                  <table class="mb-3">
                    <tr v-if="imageUrlLists.length > 0">
                      <td v-for="(imageUrl, index) in imageUrlLists" :key="index" class="position-re">
                        <img class="img-size file-upload-img-size" :src="imageUrl">
                        <a href="javascript:" @click="removeFile(index)">
                          <img class="close-button" src="/icon/x-icon.png">
                        </a>
                      </td>
                    </tr>
                  </table>
                <div class="mb-2">
                    <button type="button" @click="$refs.fileRef.click" class="btn mb-0 bg-gradient-dark btn-md null null">
                    <div class="ni ni-image color-white mx-auto mb-0">
                      <input type="file" id="file" @change="previewFile()" ref="fileRef" multiple hidden>
                    </div>
                  </button>
                  최대 10장까지 업로드 가능합니다.
                
                </div>
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
import store from "@/store/index.js";
const body = document.getElementsByTagName("body")[0];
const axiosConfig = {
        headers:{
            "X-AUTH-TOKEN": store.state.token.accessToken,
            "Content-Type": "multipart/form-data",
        }
};
export default {
  name: "post",
  data() {
    return {
      content: null,
      files: [],
      preview: "",
      uploadImageFile: "",
      fileCount: 0,
      imageUrlLists: [],
      fileList: [],
    }
  },
  components: {
    Navbar,
    AppFooter,
  },
  created() {
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
    async postData() {
      const formData = new FormData()
      formData.append('content', this.content)

      // this.files = this.$refs.fileRef.files
      this.files = this.fileList
      this.fileCount = this.imageUrlLists.length
      if (this.fileCount > 10) {
        this.fileCount = 10
      }
      if (this.fileCount > 0) {
        for (let i = 0; i < this.fileCount; i ++) {
          const fileForm = this.files[i]
          formData.append(`files[${i}]`, fileForm)
        }
      }

      await this.$axios.post("/api/post/create", formData, axiosConfig)
          .then((response) => {
            console.log(response)
            this.$router.push("/post");
            
          })
          .catch((error) => {
            console.log(error)
          })
    },
    previewFile(){
      const imageLists = event.target.files;

    if (this.imageUrlLists.length < 10) {
      for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      this.imageUrlLists.push(currentImageUrl);
      this.fileList.push(event.target.files[i])
      }
    }
    
    },
    removeFile(index) {
      this.imageUrlLists.splice(index, 1)
      this.fileList.splice(index, 1)
    }
  }

}

</script>