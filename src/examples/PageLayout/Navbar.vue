<template>
  <!-- Navbar -->
  <nav
    class="navbar navbar-expand-lg top-0 z-index-3 position-absolute mt-4"
    :class="isBlur ? isBlur : 'shadow-none my-2 navbar-transparent w-100'"
  >
    <div class="container ps-2 pe-0">
      <router-link
        class="navbar-brand font-weight-bolder ms-lg-0 ms-3"
        :class="darkMode ? 'text-black' : 'text-white'"
        :to="roleType == 'ROLE_STAR' ? `/post?name=${this.$store.state.name}` : '/'"
        >Minble</router-link
      >
      <button
        class="shadow-none navbar-toggler ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="mt-2 navbar-toggler-icon">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse" id="navigation">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link to="/home" v-if="this.$store.state.token.accessToken && roleType != 'ROLE_STAR'"
              class="nav-link d-flex align-items-center me-2 active"
              aria-current="page"
            >
              <i
                class="fa fa-chart-pie opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              Home
            </router-link>
            <router-link to="/start" v-else-if="!this.$store.state.token.accessToken && roleType != 'ROLE_STAR'"
              class="nav-link d-flex align-items-center me-2 active"
              aria-current="page"
            >
              <i
                class="fa fa-chart-pie opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              Home
            </router-link>
          </li>
          <li class="nav-item" v-if="this.$store.state.token.accessToken && this.$store.state.name">
            <router-link class="nav-link me-2" :to="`/post?name=${this.$store.state.name}`">
              <i
                class="fas fa-key opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              <span v-if="roleType == 'ROLE_STAR'">Home</span>
              <span v-else>Post</span>
            </router-link>
          </li>
          <li class="nav-item" v-if="this.$store.state.token.accessToken && this.$store.state.name">
            <router-link class="nav-link me-2" :to="`/message?name=${this.$store.state.name}`">
              <i
                class="fas fa-key opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              Message
            </router-link>
          </li>
          <li class="nav-item" v-if="this.$store.state.token.accessToken && this.$store.state.name && roleType != 'ROLE_STAR'">
            <router-link class="nav-link me-2" :to="`/shop?name=${this.$store.state.name}`">
              <i
                class="fas fa-key opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              Store
            </router-link>
          </li>
          <li class="nav-item" v-if="this.$store.state.token.accessToken">
            <router-link class="nav-link me-2" to="/my">
              <i
                class="fa fa-user opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              My
            </router-link>
          </li>
          <li class="nav-item" v-if="!this.$store.state.token.accessToken">
            <router-link class="nav-link me-2" to="/login">
              <i
                class="fas fa-key opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              Login
            </router-link>
          </li>
          <li class="nav-item" v-if="this.$store.state.token.accessToken">
            <a href="javascript:" class="nav-link me-2" @click="logout">
              <i
                class="fas fa-user-circle opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<script>
import downArrWhite from "@/assets/img/down-arrow-white.svg";
import downArrBlack from "@/assets/img/down-arrow-dark.svg";

export default {
  name: "navbar",
  data() {
    return {
      downArrWhite,
      downArrBlack,
      axiosConfig: {
        headers:{
            "X-AUTH-TOKEN": this.$store.state.token.accessToken
        }
      },
      accessToken: this.$store.state.token.accessToken,
      roleType: null,
    };
  },
  props: {
    btnBackground: String,
    isBlur: String,
    isBtn: { type: String, default: "bg-gradient-light" },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    darkModes() {
      return {
        "text-dark": this.darkMode
      };
    }
  },
  created() {
    this.getNickname();
  },
  methods: {
    logout() {
      this.$store.dispatch("logout", {})
      .then(() => this.$router.push("/start"))
      .catch(({ message }) => alert(message))
    },
    getNickname() {
      // 로그인이 안되어있을 경우 
      if (this.$store.state.token.accessToken == null || this.$store.state.token.accessToken == '') {
        return;
      }
      this.$store
      .dispatch("user", {
        accessToken: this.$store.state.token.accessToken,
      })
      .then((response) => {
        this.roleType = response.data.roleType;
        this.$store.state.nickname = response.data.nickname;
        this.$store.state.profilePath = response.data.profilePath;
        if (this.roleType == "ROLE_STAR") {
          this.$store.state.name = response.data.nickname;
        }
      })
      .catch((error) => {
        alert("다시 시도해주세요"+ error)
      })
    },

  }
};
</script>
