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
      token: this.$route.query.token,
    }
  },
  components: {
      Navbar,
  },
  created() {
    this.getConfirmEmail();
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
      getConfirmEmail() {
          this.$axios.get("/api/email/confirm", {params: {"token": this.token}})
          .then((response) => {
              console.log(response)
              if (response.data == "success") {
                  this.$router.push("/")
              } else if (response.data == "fail") {
                  alert("잘못된 접근입니다.")
                  this.$router.push("/")
              } else {
                  alert("유효기간이 만료되었습니다. 재인증이 필요합니다.")
                  this.$router.push("/complete/register?type=re_request&email="+response.data)
              }
          })
          .catch((error) => {
              console.log(error)
              this.$router.push("/")
          })
      }
  },
}

</script>