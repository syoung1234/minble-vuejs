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
      <div class="page-header min-vh-100">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
            <div class="text-end mb-2">
                
            </div>
          <div class="card z-index-0">
            <div class="card-header pt-4">
                <h5>
                    <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark"><i class="ni ni-bold-left"></i></button>
                  <span>포스트 쓰기</span>
                  <button type="button" class="btn mb-0 bg-gradient-dark btn-md align-right null null">등록</button>
                  <!-- <a href="/post/create" class="btn mb-0 ml-5 bg-gradient-dark btn-md text-right null null">등록</a> -->
                </h5>
            </div>
            <div class="card-body">
              <form role="form">
                  <table border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4" >
                      <tr>
                        <textarea class="form-control form-control-lg invalid"></textarea>
                      </tr>
                  </table>
                <div class="mb-2">
                  <a href="/post/create" class="btn mb-0 bg-gradient-dark btn-md null null"><i class="ni ni-image"></i></a>
                </div>
              </form>
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
  name: "post",
  components: {
    Navbar,
    AppFooter,
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

}

</script>