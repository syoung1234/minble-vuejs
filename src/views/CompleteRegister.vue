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
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
            <div class="card-header mt-2" v-if="type == null">
              <span class="text-bold">가입하신 이메일의 메일함을 확인해주세요. <br> 인증 후 가입이 완료됩니다.</span>
            </div>
            <div class="card-header mt-2" v-else>
              <span class="text-bold">재인증이 필요합니다. 다시 보내기 버튼을 클릭해주세요.<br> 인증 후 가입이 완료됩니다.</span>
            </div>
            <div class="text-center mt-3">
                <button type="button" class="btn" @click="postResend">다시 보내기</button>
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
  name: "CompleteRegister",
  data() {
    return {
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        }
      },
      type: this.$route.query.type,
      email: this.$route.query.email,
    }
  },
  components: {
    Navbar,
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
    postResend() {
      let saveData = {};
      saveData.email = this.email;
      this.$axios.post("/api/email/confirm", saveData)
      .then(() => {
        alert("메일함을 확인해주세요.");
      })
      .catch((error) => {
        console.log(error);
        alert("잘 못 된 접근입니다. 다시 시도해주세요.");
      })
    }
  },
}

</script>