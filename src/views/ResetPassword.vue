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
          <div>
            <span>비밀번호를 재설정해주세요.</span><br>
            <span>8~16자 영문, 숫자를 사용하세요.</span>
          </div>
          <div class="mb-3">
            <input class="form-control form-control-default invalid mt-3" type="password" placeholder="비밀번호" aria-label="Password" v-model="password" @blur="passwordValid(), passwordCheckValid()" />
            <div class="text-muted font-italic" v-if="!passwordValidFlag"> 
              <small class="color-red">8~16자 영문, 숫자를 사용하세요.</small>
            </div>
          </div>
          <div class="mb-5">
            <input class="form-control form-control-default invalid mt-3" type="password" placeholder="비밀번호 확인" aria-label="PasswordConfirmation" v-model="password_confirmation" @blur="passwordCheckValid" />
            <div class="text-muted font-italic" v-if="!passwordCheckFlag">
              <small class="color-red">비밀번호가 일치하지 않습니다.</small>
            </div>
          </div>
          <div class="text-center">
            <button class="btn bg-gradient-dark btn-md" type="button" color="dark" variant="gradient" @click="postResetPassword">완료</button>
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
  name: "ResetPassword",
  data() {
    return {
      token: this.$route.query.token,
      password: null,
      password_confirmation: null,
      passwordValidFlag: true,
      passwordCheckFlag: true,
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
      postResetPassword() {
        if (this.password == null || this.passwordValid == false || this.passwordCheckFlag == false || this.password_confirmation == null) {
          return;
        }
        let saveData = {};
        saveData.token = this.token;
        saveData.password = this.password;
        this.$axios.post("/api/email/password", saveData)
        .then((response) => {
            if (response.data == "success") {
              alert("비밀번호 변경이 완료 되었습니다.")
              this.$router.push("/login")
            } else {
              alert("유효기간이 만료되었습니다. 다시 시도해주세요.")
              this.$router.push("/find-password")
            }
        })
        .catch(() => {
            alert("다시 시도해주세요.")
            this.$router.push("/")
        })
      },
      // 비밀번호 유효성
      passwordValid () {
        if (/^(?=.*[a-z])(?=.*[0-9]).{8,16}$/.test(this.password)) {
          this.passwordValidFlag = true
        } else {
          this.passwordValidFlag = false
        }
      },
      // 비밀번호 확인
      passwordCheckValid() {
        if (this.password_confirmation == null) {
          return;
        }
          if(this.password === this.password_confirmation) {
              this.passwordCheckFlag = true
          } else {
              this.passwordCheckFlag = false
          }
      },
  },
}

</script>