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
          <div class="card z-index-0">
            <div class="card-body">
                <h5 class="mb-4">스토어</h5>
                <button type="button" class="card card-body btn w-100" @click="requestPay">
                    <h4>Message 구독</h4>
                    <p>스타와 메시지를 나눠보세요.</p>
                    <span>월 3300원</span>
                </button>
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
  name: "Home",
  data() {
    return {
      postList : [],
      followingList: [],
      role: null,
      pageList: null,
      showModal: false,
      name: this.$route.query.name,
      nickname: null,
      email: null,
      status: null,
    }
  },
  components: {
    Navbar,
    AppFooter,
  },
  created() {
    this.getShop();
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
    async getShop() {
        this.$store.state.name = this.name;
        await this.$http.get("/api/subscriber?name="+this.name)
          .then((response) => {
            if (response.data == '') {
              this.$store.dispatch("logout", {})
              .then(() => this.$router.push("/start"))
              .catch(({ message }) => alert(message))
            }
            this.$store.state.nickname = response.data.nickname
            this.nickname = response.data.nickname
            this.email = response.data.email
            this.status = response.data.status;
          })
          .catch((error) => {
            console.log(error)
          })
    },
    async postSubscriber() {
        const saveData = {};
        saveData.nickname = this.name;
        await this.$http.post("/api/subscriber", saveData)
            .then((response) => {
                if (response.data.includes("already")) {
                    alert("이미 구독 서비스 중입니다.")
                }
            })
            .catch((error) => {
                console.log(error)
            })
    },
     requestPay: function () {
       if (this.status == true) {
         alert("이미 구독중입니다.")
         return;
       }
       var IMP = window.IMP; // 생략 가능
       IMP.init("imp54845043"); // 예: imp00000000
          // IMP.request_pay(param, callback) 결제창 호출
          IMP.request_pay({ // param
            pg: 'kakaopay',
            merchant_uid: 'merchant_billingKey_' + new Date().getTime(), // 상점에서 관리하는 주문 번호
	          name : '최초인증결제',
	          amount : 0, // 빌링키 발급만 진행하며 결제승인을 하지 않습니다.
	          customer_uid : this.nickname + '_billingKey_' + new Date().getTime(), // 필수 입력
	          buyer_email : this.email,
	          buyer_name : this.nickname,
          }, rsp => { // callback
            if (rsp.success) {
              // console.log(rsp.success)
              // console.log(rsp)
              // 결제 성공 시 로직,
              let saveData = {};
              saveData = rsp;
              saveData.nickname = this.name;
              this.$http.post("/api/subscriber", rsp)
                .then((response) => {
                    if (response.data.includes("already")) {
                        alert("이미 구독 서비스 중입니다.")
                    } else {
                      alert("구독이 완료되었습니다. Message 서비스 이용 가능합니다.")
                      // this.$router.push("/message?name="+this.nickname)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
            } else {
              // 결제 실패 시 로직,
              console.log(rsp)
            }
          });
     }
  },

}

</script>