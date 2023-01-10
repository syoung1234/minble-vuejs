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
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-body">
                <h5 class="mb-4">
                    회원 관리
                </h5>
                <div class="mb-7">
                  <select class="form-control w-25 float-left">
                    <option>닉네임</option>
                    <option>이메일</option>
                    <option>회원유형</option>
                  </select>
                  <input type="text" class="form-control w-70 float-right">
                </div>
                <table>
                    <tr>
                        <th width="25%">닉네임</th>
                        <th width="25%">이메일</th>
                        <th width="25%">회원유형</th>
                        <th width="25%">가입일</th>
                    </tr>
                    <tr class="pointer" @click="getDetail">
                        <td>test5</td>
                        <td>test5@test.com</td>
                        <td>일반</td>
                        <td>2022.12.15</td>
                    </tr>
                    <tr class="pointer">
                        <td>test5</td>
                        <td>test5@test.com</td>
                        <td>일반</td>
                        <td>2022.12.15</td>
                    </tr>
                </table>
            </div>
            <argon-pagination class="justify-center">
              <argon-pagination-item prev />
              <argon-pagination-item label="1" active />
              <argon-pagination-item label="2" disabled />
              <argon-pagination-item label="3" />
              <argon-pagination-item next />
            </argon-pagination>
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
import ArgonPagination from "@/components/ArgonPagination.vue";
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue";

const body = document.getElementsByTagName("body")[0];
export default {
  name: "paymentHistory",
  data() {
    return {
      showModal: false,
      name: this.$route.query.name,
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        }
      },
      profilePath: null,
      nickname: null,
      paymentList: [],
      pageList: [],
    }
  },
  components: {
    Navbar,
    ArgonPagination,
    ArgonPaginationItem,
  },
  created() {
    this.getNickname();
    this.getPayment();
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
    async getNickname() {
        this.$store.state.name = this.name;
        await this.$axios.get("/api/mypage", this.axiosConfig)
          .then((response) => {
            if (response.data == '') {
              this.$store.dispatch("logout", {})
              .then(() => this.$router.push("/start"))
              .catch(({ message }) => alert(message))
            }
            this.$store.state.nickname = response.data.nickname
            this.profilePath = response.data.profilePath
            this.nickname = response.data.nickname
          })
          .catch((error) => {
            console.log(error)
          })
    },
    async getPayment() {
      await this.$axios.get("/api/mypage/payment", this.axiosConfig)
      .then((response) => {
        console.log(response)
        this.paymentList = response.data.paymentList;
        this.pageList = response.data.pageList;
      })
      .catch((error) => {
        console.log(error)
      })
    },
    getDetail() {
      this.$router.push("/admin/member/detail");
    }
  },

}

</script>