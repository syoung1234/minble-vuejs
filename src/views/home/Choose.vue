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
      <div class="page-header min-vh-50">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-header mt-2">
            </div>
            <div class="card-body">
                <div class="mb-5 text-center">
                  <router-link to="/choose/tester" class="btn bg-gradient-dark p-4 w-80">테스트 계정으로 체험하기</router-link>
                </div>
                <div class="text-center">
                  <router-link to="/login" class="btn bg-gradient-dark p-4 w-80">로그인 하기</router-link>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
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
  name: "choose",
  data() {
    return {
    }
  },
  components: {
    Navbar,
    AppFooter,
  },
  created() {
    this.getLoading();
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
    getLoading() {
      if (this.$store.state.token.accessToken != null) {
        this.$router.push("/home");
      }
    }
  },
}

</script>