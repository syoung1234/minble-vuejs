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
                    회원 관리
                </h5>
                <div class="mb-3">
                    프로필
                </div>
                <div class="mb-3">
                    <span class="text-lg">닉네임: test5</span>
                </div>
                <div class="mb-3">
                    <span class="text-lg">이메일: test5@test.com</span>
                </div>
                <div class="mb-3">
                    <span class="text-lg">회원유형: </span>
                    <select>
                        <option>일반</option>
                        <option>구독자</option>
                        <option>스타</option>
                        <option>관리자</option>
                    </select>
                </div>
                <div class="mb-3">
                    <span class="text-lg">가입일: 2022.12.30</span>
                </div>
                <button type="button" class="btn">저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </section>
  </main>
</template>
<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";

const body = document.getElementsByTagName("body")[0];
export default {
  name: "paymentHistory",
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
      paymentList: [],
      pageList: [],
    }
  },
  components: {
    Navbar,
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
            if (response.data == '') {
              this.$store.dispatch("logout", {})
              .then(() => this.$router.push("/start"))
              .catch(({ message }) => alert(message))
            }
            this.$store.state.nickname = response.data.nickname
            this.profilePath = response.data.profilePath
            this.nickname = response.data.nickname
          })
          .catch((error) => {
            console.log(error)
          })
    },
  },

}

</script>