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
  <main class="mt-8 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">닉네임 설정</h4>
                  <small>닉네임을 설정해주세요.</small>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <input class="form-control form-control-lg invalid" type="text" placeholder="닉네임" size="lg" v-model="nickname" @blur="nicknameNullCheck(), checkDuplicate()" />
                        <div class="text-muted font-italic" v-if="!nicknameNullCheckFlag"> 
                            <small class="color-red">닉네임 입력해주세요.</small>
                        </div>
                        <div class="text-muted font-italic" v-else-if="nicknameDuplicateFlag === false"> 
                          <small class="color-red">이미 사용 중인 닉네임입니다.</small>
                        </div>
                        <div class="text-muted font-italic" v-else-if="nicknameDuplicateFlag === true"> 
                          <small class="color-green">사용 가능한 닉네임입니다.</small>
                        </div>
                    </div>
                    <button type="button" class="btn float-right" @click="postData">완료</button>
                  </form>
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
// import ArgonSwitch from "@/components/ArgonSwitch.vue";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "login",
  data() {
        return {
            nickname: null,
            nicknameNullCheckFlag: true,
            nicknameDuplicateFlag: '',
            email: this.$route.query.email,
            social: this.$route.query.social,
        }
    },
  methods: {
    // 닉네임 null 체크
    nicknameNullCheck() {
        if (this.nickname == null) {
            this.nicknameNullCheckFlag = false;
        } else {
            this.nicknameNullCheckFlag =true
        }
    },
    checkDuplicate() {
        let data = {};
        data.nickname = this.nickname;
        let result = null;

        this.$axios.post("/api/duplicate/nickname", data)
        .then((res) => {
            if (res.data == "exist") {
                result = false;
            } else {
                result = true;
            }
            this.nicknameDuplicateFlag = result;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    postData() {
        if (this.nicknameNullCheckFlag == null || this.nicknameNullCheckFlag == false || this.nicknameDuplicateFlag == false) {
            return;
        }
        let saveData = {};
        saveData.email = this.email;
        saveData.nickname = this.nickname;
        saveData.social = this. social;
        console.log(saveData)
        this.$axios.post("/api/register/social", saveData)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
        
    }
  },
  components: {
    Navbar,
    // ArgonSwitch,
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
