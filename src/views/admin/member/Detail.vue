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
          <div class="card z-index-0">
            <div class="card-body">
                <h5 class="mb-4">
                    <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                    회원 관리
                </h5>
                <div class="mb-3">
                    <img :src="data?.profilePath" class="rounded-circle img-size border border-2 border-white file-upload-img-size">
                </div>
                <div class="mb-3">
                    <span class="text-lg">닉네임: {{ data?.nickname }}</span>
                </div>
                <div class="mb-3">
                    <span class="text-lg">이메일: {{ data?.email }}</span>
                </div>
                <div class="mb-3">
                    <span class="text-lg">회원유형: </span>
                    <select>
                        <option :selected="data?.role == '일반'">일반</option>
                        <option :selected="data?.role == '구독자'">구독자</option>
                        <option :selected="data?.role == '스타'">스타</option>
                        <option :selected="data?.role == '관리자'">관리자</option>
                    </select>
                </div>
                <div class="mb-3">
                    <span class="text-lg">가입일: {{ data?.createdAt }}</span>
                </div>
                <button type="button" class="btn">저장</button>
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
  name: "adminMemberDetail",
  data() {
    return {
      name: this.$route.query.name,
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        }
      },
      data: null,
    }
  },
  components: {
    Navbar,
  },
  created() {
    this.getMember();
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
    async getMember() {
      await this.$axios.get(`/api/admin/member/${this.name}`, this.axiosConfig)
      .then((response) => {
        console.log(response)
        this.data = response.data;
      })
      .catch((error) => {
        console.log(error)
      })
    }
  },

}

</script>