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
                    <select v-model="roleType">
                        <option>일반</option>
                        <option>구독자</option>
                        <option>스타</option>
                        <option>관리자</option>
                    </select>
                </div>
                <div class="mb-3">
                    <span class="text-lg">가입일: {{ data?.createdAt }}</span>
                </div>
                <button type="button" class="btn" @click="postRole">저장</button>
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
      roleType: null,
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
        this.data = response.data;
        this.roleType = response.data.role;
      })
      .catch((error) => {
        console.log(error)
      })
    },
    async postRole() {
      let saveData = {};
      saveData.nickname = this.data.nickname;
      saveData.role = this.roleType;
      console.log(this.roleType)
      await this.$axios.post("/api/admin/member", saveData, this.axiosConfig)
      .then((response) => {
        if(response.data == 'success') {
          alert("변경이 완료되었습니다.")
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }
  },

}

</script>