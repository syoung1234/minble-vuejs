<template>
<LoadingSpinner v-if="isLoading"></LoadingSpinner>
  <div class="container top-0 position-sticky z-index-sticky" v-else-if="isLoading == false">
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
  <main class="main-content mt-8" v-if="isLoading == false">
    <section>
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column" v-if="isSend == false">
          <div class="mb-3">
            <span>가입하신 이메일을 입력해주세요.</span>
          </div>
          <div class="mb-5">
            <input class="form-control form-control-lg invalid" type="email" placeholder="이메일" name="email" v-model="email" />
          </div>
          <div class="text-center">
            <button class="btn" type="button" @click="getPasswordEmail">비밀번호 찾기</button>
          </div>
        </div>

        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column" v-else>
          <span>비밀번호 재설정 메일을 보냈습니다.</span>
          <span>입력하신 메일함을 확인해주세요</span>
        </div>
      </div>
    </div>
    </section>
  </main>
</template>
<script>

import Navbar from "@/examples/PageLayout/Navbar.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue"
const body = document.getElementsByTagName("body")[0];

export default {
  name: "FindPassword",
  data() {
    return {
      email: null,
      isLoading: false,
      isSend: false,
    }
  },
  components: {
      Navbar,
      LoadingSpinner,
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
    getPasswordEmail() {
      if (this.email == null || this.email == "") {
        alert("이메일을 입력해주세요.");
        return;
      }
      this.isLoading = true;
      this.$axios.get("/api/email/password", {params: {"email": this.email}})
      .then((response) => {
        if (response.data == "empty") {
          alert("가입되지 않은 회원입니다.")
          this.isLoading = false;
        } else {
          this.isSend = true;
          this.isLoading = false;
          alert("메일이 발송되었습니다. 메일함을 확인해주세요.")
        }
      })
      .catch(() => {
        alert("다시 시도해주세요.")
      })
    }
  },
}

</script>