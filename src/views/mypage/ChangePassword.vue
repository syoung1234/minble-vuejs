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
      <div class="page-header">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-body">
                <h5 class="mb-4">
                    <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                    비밀번호 변경
                </h5>
                <div class="mb-5">
                    <p>현재 비밀번호</p>
                    <input type="text" class="form-control form-control-lg invalid">
                </div>
                <div class="mb-2">
                    <p>변경할 비밀번호</p>
                    <input type="text" class="form-control form-control-lg invalid">
                </div>
                <div class="mb-5">
                    <p>변경할 비밀번호 확인</p>
                    <input type="text" class="form-control form-control-lg invalid">
                </div>
                <div class="mb-3 float-right">
                    <button type="button" class="btn">완료</button>
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

const body = document.getElementsByTagName("body")[0];
export default {
  name: "Home",
  data() {
    return {
      showModal: false,
      name: this.$route.query.name,
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        }
      },
      profilePath: null,
      nickname: null,
      nicknameDuplicateFlag: null,
    }
  },
  components: {
    Navbar,
    AppFooter,
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
        this.$store.state.name = this.name;
        await this.$axios.get("/api/mypage", this.axiosConfig)
          .then((response) => {
            console.log(response)
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
        await this.$axios.post("/api/duplicate/nickname", data, this.axiosConfig)
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
        await this.$axios.post("/api/mypage/nickname", postData, this.axiosConfig)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

  },

  

}

</script>