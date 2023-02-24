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
  <MyPageModal v-if="showModal" @close="showModal = false">
   <div class="mb-1">
      <input type="text" maxlength="20" class="form-control form-control-lg invalid" v-model="updateNickname" @keyup="duplicate()">
    </div>
    <div class="text-muted font-italic" v-if="nicknameDuplicateFlag === false"> 
      <small class="color-red">이미 사용 중인 닉네임입니다.</small>
    </div>
    <div class="text-muted font-italic" v-else-if="nicknameDuplicateFlag === true"> 
      <small class="color-green">사용 가능한 닉네임입니다.</small>
    </div>
    <div class="modal-btn mt-3">
        <button type="button" class="btn" @click="postNickname">저장</button>
    </div>
   </MyPageModal>
  <main class="main-content mt-8">
    <section>
      <div class="page-header">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-body">
                <h5 class="mb-4">마이페이지</h5>
                <div class="mb-4">
                    <button type="button" @click="$refs.fileRef.click" class="btn btn-link mb-0 w-25 pd-0 me-2">
                    <img :src="profilePath" class="rounded-circle img-size border border-2 border-white">
                    <div class="ni ni-image color-white mx-auto mb-0">
                      <input type="file" id="file" ref="fileRef" @change="postProfile()" hidden>
                    </div>
                  </button>
                    <span class="text-bold text-xl me-1">{{ nickname }}</span>
                    <a href="javascript:" @click="showModal = true">
                      <i class="fas fa-pencil-alt color-gray me-2"></i>
                    </a>
                </div>
                <div class="mb-3">
                    <router-link to="/my/change/password"><span class="text-bold text-lg">비밀번호 변경</span></router-link>
                </div>
                <div class="mb-3">
                    <router-link to="/my/payment/history"><span class="text-bold text-lg">결제내역</span></router-link>
                </div>
                <div class="mb-6">
                    <router-link to="/my/comment"><span class="text-bold text-lg">작성한 댓글</span></router-link>
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
import MyPageModal from "@/examples/MyPageModal.vue";

const body = document.getElementsByTagName("body")[0];
export default {
  name: "Home",
  data() {
    return {
      showModal: false,
      name: this.$route.query.name,
      profilePath: null,
      nickname: null,
      nicknameDuplicateFlag: null,
      profile: null,
    }
  },
  components: {
    Navbar,
    AppFooter,
    MyPageModal,
  },
  created() {
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
        // this.$store.state.name = this.name;
        await this.$http.get("/api/mypage")
          .then((response) => {
            if (response.data == '') {
              this.$store.dispatch("logout", {})
              .then(() => this.$router.push("/start"))
              .catch(({ message }) => alert(message))
            }
            this.$store.state.nickname = response.data.nickname
            this.profilePath = response.data.profilePath
            this.nickname = response.data.nickname
            console.log(this.$store.state.nickname);
          })
          .catch((error) => {
            console.log(error)
          })
    },
    // 중복체크
    async duplicate() {
        console.log(this.updateNickname)
        if (this.updateNickname.length == 20) {
            return;
        }
        if (this.updateNickname == null || this.updateNickname == "") {
          this.nicknameDuplicateFlag = null;
            return;
        }
        let data = {};
        data.nickname = this.updateNickname;
        let result = null;
        await this.$http.post("/api/duplicate/nickname", data)
        .then((res) => {
            if (res.data == "exist") {
                result = false;
            } else {
                result = true;
            }
            this.nicknameDuplicateFlag = result;
                  
        })
        .catch((error) => {
          console.log(error);
        })
            
    },
    async postNickname() {
        if (this.updateNickname == null || this.updateNickname == "") {
            return;
        }
        const postData = {};
        postData.nickname = this.updateNickname
        await this.$http.post("/api/mypage/nickname", postData)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    },
    async postProfile() {
      const formData = new FormData();
      formData.append("profile", event.target.files[0]);
      await this.$http.post("/api/mypage/profile", formData)
      .then(() => {
        this.$router.go()
      })
      .catch(() => {
        alert("잘 못 된 접근입니다.")
      })
    },

  },

  

}

</script>