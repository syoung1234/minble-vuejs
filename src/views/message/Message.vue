<template>
  <main class="main-content mt-1">
    <section>
      <div class="page-header">
    <div class="container">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0 msg-h">
            <div class="card-header text-left pt-4">
              <h5>
                  <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                  Message
              </h5>
            </div>
            <div class="card-body">
                <div :class="{'text-right' : this.nickname == message.nickname}" v-for="(message, index) in messageList" :key="index">
                    <span>{{ message.content }}</span>
                </div>
                
              <input type="text" class="msg-input" v-model="message" @keyup="sendMessage">
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
import Stomp from "webstomp-client"
import SockJS from "sockjs-client"
const body = document.getElementsByTagName("body")[0];
export default {
    name: "message",
    data() {
        return {
            nickname: "test2",
            message: "",
            messageList: [],
            myMessage: false,
            myMessageList: [],
            i: 0,
        }
    },
    components: {
    },
    created() {
        // 소켓 연결 시도
        this.connect();
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
        sendMessage(e) {
            if(e.keyCode === 13 && this.message !== "") {
                this.send();
                this.message = "";
            }
        },
        send() {
            console.log("Send message:" + this.message);
            this.i = this.i+1;
            if (this.stompClient && this.stompClient.connected) {
                const msg = {
                    nickname: "test"+this.i,
                    content: this.message
                };
                this.stompClient.send("/receive", JSON.stringify(msg), {});
            }
        },
        connect() {
            const serverURL = "http://localhost:8080"
            let socket = new SockJS(serverURL);
            this.stompClient = Stomp.over(socket);
            console.log(`소켓 연결 시도: ${serverURL}`)
            this.stompClient.connect(
                {},
                frame => {
                    // 소켓 연결 성공
                    this.connected = true;
                    console.log("소켓 연결 성공", frame)
                    // 서버의 메시지 전송 endpoit를 구독 (pub/sub)
                    this.stompClient.subscribe("/send", res => {
                        console.log("구독으로 받은 메시지 입니다.", res.body);

                        this.messageList.push(JSON.parse(res.body))
                        console.log(
                            this.messageList
                        )
                    });
                },
                error => {
                    // 소켓 연결 실패
                    console.log("소켓 연결 실패", error);
                    this.connected = false;
                }
            )
        }
    }
}
</script>