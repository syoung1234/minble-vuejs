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
                    작성한 댓글
                </h5>
                <table>
                    <th class="me-2 pe-5">작성일</th>
                    <th>내용</th>
                    <tr style="cursor: pointer;">
                        <td class="small me-2">2022.11.10</td>
                        <td>내용내용</td>
                    </tr>
                    <tr>
                        <td class="small">2022.11.10</td>
                        <td>내용내용</td>
                    </tr>
                </table>
                <div class="text-center">
                    <button type="button" class="btn btn-link text-dark"><span>더보기 </span><span class="text-lg align-bottom">⌵</span>  </button>
                </div>
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
  name: "commentList",
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
  },

}

</script>