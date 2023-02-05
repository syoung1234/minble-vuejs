<template>
  <div class="container top-0 position-sticky z-index-sticky" v-if="isLoading == false">
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
  <LoadingSpinner v-if="isLoading"></LoadingSpinner>
  <main class="main-content mt-8" v-else>
    <section>
      <div class="page-header min-vh-100">
    <div class="container">
      <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-header pt-4">
              <h4>
                <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                회원가입
              </h4>
            </div>
            <div class="card-body">
              <form role="form">
                <input class="form-control form-control-default invalid" type="email" placeholder="이메일" aria-label="email" v-model="email" @blur="emailValidCheck(), checkDuplicate('email')" />
                  <div class="text-muted font-italic" v-if="!emailValidCheckFlag"> 
                    <small class="color-red">이메일 형식으로 입력해주세요.</small>
                  </div>
                  <div class="text-muted font-italic" v-else-if="emailDuplicateFlag === false"> 
                    <small class="color-red">이미 사용 중인 이메일입니다.</small>
                  </div>
                  <div class="text-muted font-italic" v-else-if="emailDuplicateFlag === true"> 
                    <small class="color-green">사용 가능한 이메일입니다.</small>
                  </div>
                <input class="form-control form-control-default invalid mt-3" type="password" placeholder="비밀번호" aria-label="Password" v-model="password" @blur="passwordValid(), passwordCheckValid()" />
                  <div class="text-muted font-italic" v-if="!passwordValidFlag"> 
                    <small class="color-red">8~16자 영문, 숫자를 사용하세요.</small>
                  </div>
                  <input class="form-control form-control-default invalid mt-3" type="password" placeholder="비밀번호 확인" aria-label="PasswordConfirmation" v-model="password_confirmation" @blur="passwordCheckValid" />
                  <div class="text-muted font-italic" v-if="!passwordCheckFlag">
                    <small class="color-red">비밀번호가 일치하지 않습니다.</small>
                  </div>
                <input class="form-control form-control-default invalid mt-3" type="text" placeholder="닉네임" aria-label="Nickname" v-model="nickname" @blur="nicknameNullCheck(), checkDuplicate('nickname')" />
                  <div class="text-muted font-italic" v-if="!nicknameNullCheckFlag"> 
                      <small class="color-red">닉네임 입력해주세요.</small>
                  </div>
                  <div class="text-muted font-italic" v-else-if="nicknameDuplicateFlag === false"> 
                    <small class="color-red">이미 사용 중인 닉네임입니다.</small>
                  </div>
                  <div class="text-muted font-italic" v-else-if="nicknameDuplicateFlag === true"> 
                    <small class="color-green">사용 가능한 닉네임입니다.</small>
                  </div>
                <!-- <input class="form-control form-control-default invalid mt-3" type="text" placeholder="휴대폰 번호" aria-label="Nickname" v-model="phone" /> -->
                <div class="form-check mt-3"> 
                  <input type="checkbox" class="form-check-input" v-model="agreeCheck">
                  <label class="form-check-label" for="flexCheckDefault">
                    I agree the
                    <a
                      href="javascript:;"
                      class="text-dark font-weight-bolder"
                    >Terms and Conditions</a>
                  </label>
                </div>
                
                <div class="text-center">
                  <button class="btn mb-0 bg-gradient-dark btn-md w-100 null my-4 mb-2" type="button" fullWidth color="dark" variant="gradient" @click="postData">회원가입</button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  Already have an account?
                  <a
                    href="/login"
                    class="text-dark font-weight-bolder"
                  >로그인</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </section>
  </main>
  <div v-if="isLoading == false">
  <app-footer />
  </div>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue"
const body = document.getElementsByTagName("body")[0];
const axiosConfig = {
        headers:{
            "Content-Type": "application/json"
        }
    }
export default {
  name: "register",
  data() {
        return {
            email: null,
            nickname: null,
            password: null,
            password_confirmation: null,
            phone: null,
            passwordValidFlag: true,
            passwordCheckFlag: true,
            nicknameNullCheckFlag: true,
            emailValidCheckFlag: true,
            emailDuplicateFlag: '',
            nicknameDuplicateFlag: '',
            agreeCheck: false,
            isLoading: false,
        }
    },
    methods: {
        // 중복체크 (이메일, 닉네임)
        checkDuplicate(key) {
          let data = {};
          let type = null;
          data.email = this.email;
          data.nickname = this.nickname;
          let result = null;

          if (key == "email") {
              type = this.email;
          } else if (key == "nickname") {
              type = this.nickname;
          }
          if (type != null) {
              this.$axios
              .post(`/api/duplicate/${key}`, data, axiosConfig)
              .then((res) => {
                  if (res.data == "exist") {
                      result = false;
                  } else {
                      result = true;
                  }

                  if (key == "email") {
                      this.emailDuplicateFlag = result;
                  } else if (key == "nickname") {
                      this.nicknameDuplicateFlag = result;
                  }
                      
              })
              .catch((error) => {
                console.log(error);
              })
          }
            
        },
        // 이메일 유효성
        emailValidCheck() {
	        if (/.+@.+\..+/.test(this.email)) {
	        	//유효성이 틀리다면 data 값을 false로 한다.
                this.emailValidCheckFlag = true;
	        } else {
	        	this.emailValidCheckFlag = false;
	        }
        },
        // 닉네임 null 체크
        nicknameNullCheck() {
            if (this.nickname == null) {
                this.nicknameNullCheckFlag = false;
            } else {
                this.nicknameNullCheckFlag =true
            }
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
            if(this.password === this.password_confirmation) {
                this.passwordCheckFlag = true
            } else {
                this.passwordCheckFlag = false
            }
        },
        // 회원가입 전송
        postData() {
            if (this.email != null && this.password != null && this.password_confirmation != null && this.nickname != null &&
            this.passwordValidFlag == true && this.passwordCheckFlag == true && this.agreeCheck == true) {
                let saveData = {};
                saveData.email = this.email;
                saveData.password = this.password;
                saveData.nickname= this.nickname;
                saveData.phone = this.phone;
                this.isLoading = true;
                
                this.$axios
                .post("/api/register", JSON.stringify(saveData), axiosConfig)
                .then((res) => {
                  console.log(res)
                  if (res.data == "success") {
                    this.$router.push("/complete/register");
                  }
                })
                .catch((error) => { 
                  console.log(error);
                  alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
                  this.$router.push('/');
                })
                .finally(() => {
                });
            }
        },
  },
  components: {
    Navbar,
    AppFooter,
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
};
</script>
