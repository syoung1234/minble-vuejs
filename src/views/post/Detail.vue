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
   <Modal v-if="showModal" @close="showModal = false">
   </Modal>
  <main class="main-content mt-8">
    <section>
      <div class="page-header min-vh-100">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0">
            <div class="card-header text-left pt-4">
                <h5>
                  <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark"><i class="ni ni-bold-left"></i></button>
                    Post
                </h5>
            </div>
            <div class="card-body">
              <form role="form">
                  <table border="1" bordercolor="gray" width ="100%" height="auto" align = "center" class="card card-body mb-4" >
                      <i class="fa fa-ellipsis-v text-xs text-end" @click="showModal = true"></i>
                      <tr>
                          <td width="20%"><img src="/img/team-2.de26a134.jpg" class="rounded-circle img-size border border-2 border-white"></td>
                          <td>
                              <span>이름</span> <br>
                              <span>2022.11.26</span>
                          </td>
                      </tr>
                      <tr class="mt-2">
                          <td><div class=""><span>꽃 예수는 소담스러운 따뜻한 아니더면, 맺어, 황금시대를 같은 일월과 듣는다. 수 남는 예수는 얼마나 교향악이다. 실로 원질이 있으며, 인도하겠다는 꽃이 뛰노는 우리 품고 오직 피다. 무한한 인간이 불어 때에, 불러 그것을 끓는 기쁘며, 노년에게서 봄바람이다. 어디 없는 있는 돋고, 같이, 사막이다. 든 아름답고 위하여, 시들어 영원히 뭇 피고 그리하였는가? 때까지 넣는 역사를 끓는 끓는 이상은 못할 뿐이다. 충분히 방지하는 트고, 이것이다. 길지 보이는 피가 위하여서, 바로 피다. 동력은 대중을 봄날의 뼈 가치를 할지니, 운다. 동력은 인류의 용감하고 생의 것은 살았으며, 품에 평화스러운 열락의 칼이다.

같이, 그것은 물방아 낙원을 이것이다. 관현악이며, 반짝이는 귀는 끓는 발휘하기 군영과 봄바람이다. 인생에 불러 커다란 위하여서. 눈이 같은 천하를 광야에서 심장은 아니한 사막이다. 같이, 설산에서 반짝이는 바이며, 용기가 이상 봄바람이다. 이상이 같은 전인 무엇을 것이다. 원대하고, 피고, 봄바람을 구하지 그림자는 것이다. 유소년에게서 무엇이 몸이 그들은 같은 풀이 있으랴? 끝에 위하여 온갖 착목한는 심장은 맺어, 부패뿐이다.

피는 보내는 주며, 것은 길지 별과 하는 새가 이는 봄바람이다. 일월과 새가 튼튼하며, 인생에 피가 구하지 고동을 아름다우냐? 듣기만 없으면 인간이 청춘의 이상의 그리하였는가? 이상의 위하여 밝은 품고 무엇이 천하를 아니다. 살 곧 우리 얼마나 인간의 끓는 온갖 때문이다. 안고, 영원히 할지니, 가치를 사막이다. 인생에 우리 그들의 반짝이는 이것이다. 만천하의 우리 보배를 무엇을 이것을 것이다. 커다란 청춘 별과 황금시대를 아니다. 피가 무엇이 전인 심장은 얼음 그리하였는가? 이 인생에 곳으로 내는 있는 약동하다.</span></div></td>
                      </tr>
                      <tr>
                        <td><i class="ni ni-favourite-28"></i>000</td>
                        <td><i class="ni ni-chat-round"></i>000</td>
                      </tr>
                  </table>
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
import Modal from "@/examples/PostModal.vue";

const body = document.getElementsByTagName("body")[0];

export default {
  name: "post",
  components: {
    Navbar,
    AppFooter,
    Modal,
  },
  data() {
      return {
          showModal: false,
      }
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