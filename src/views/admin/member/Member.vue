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
          <div class="card z-index-0">
            <div class="card-body">
                <h5 class="mb-4">
                    회원 관리
                </h5>
                <div class="mb-4">
                  <select class="form-control w-10 float-left me-3" v-model="searchType">
                    <option value="nickname">닉네임</option>
                    <option value="email">이메일</option>
                    <option value="role">회원유형</option>
                  </select>
                  <select class="form-control w-10 float-left me-3" v-if="searchType == 'role'" v-model="roleType">
                    <option>일반</option>
                    <option>구독자</option>
                    <option>스타</option>
                    <option>관리자</option>
                  </select>
                  <input v-else type="text" class="form-control w-40 float-left me-3" v-model="keyword">
                  <button class="btn" type="button" @click="searchMember">검색</button>
                </div>
                <table>
                    <tr>
                        <th width="25%">닉네임</th>
                        <th width="25%">이메일</th>
                        <th width="25%">회원유형</th>
                        <th width="25%">가입일</th>
                    </tr>
                    <template v-for="(member, index) in memberList" :key="index">
                      <tr class="pointer" @click="getDetail(member.nickname)">
                        <td>{{ member.nickname }}</td>
                        <td>{{ member.email }}</td>
                        <td>{{ member.role }}</td>
                        <td>{{ member.createdAt }}</td>
                      </tr>
                    </template>
                </table>
            </div>
            <argon-pagination>
              <argon-pagination-item prev @click="changePage(currentPage)" />
              <template v-for="n in totalPages" :key="n">
                <argon-pagination-item :label="n" :active="currentPage+1 == n" @click="changePage(n)" />
              </template>
              <argon-pagination-item next @click="changePage(currentPage+2)" />
            </argon-pagination>
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
  name: "adminMember",
  data() {
    return {
      showModal: false,
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        },
        params: {},
      },
      nickname: null,
      memberList: [],
      currentPage: 0,
      totalPages: 0,
      params: {},
      searchType: "nickname",
      keyword: null,
      roleType: "일반",
    }
  },
  components: {
    Navbar,
    ArgonPagination,
    ArgonPaginationItem,
  },
  created() {
    this.getNickname();
    this.getMember();
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
    async getMember() {
      await this.$axios.get("/api/admin/member", this.axiosConfig)
      .then((response) => {
        this.memberList = response.data.content;
        this.currentPage = response.data.pageable.pageNumber;
        this.totalPages = response.data.totalPages;
      })
      .catch((error) => {
        console.log(error)
      })
    },
    changePage(n) {
      this.axiosConfig.params.page = n-1
      this.getMember();
    },
    getDetail(nickname) {
      this.$router.push("/admin/member/detail?name="+nickname)
    },
    searchMember() {
      this.axiosConfig.params.searchType = this.searchType;

      if (this.searchType == 'role') {
        this.axiosConfig.params.keyword = this.roleType;  
      } else {
        this.axiosConfig.params.keyword = this.keyword;
      }
      
      this.getMember();
    }
  }
}

</script>