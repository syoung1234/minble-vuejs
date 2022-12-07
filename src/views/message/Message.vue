<template>
  <main class="main-content">
    <section>
      <div class="page-header">
    <div class="container pd-0">
      <div class="row">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
          <div class="card z-index-0 msg-h">
            <div class="card-header text-left pt-4">
              <h5>
                  <button type="button" class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark" @click="this.$router.go(-1);"><i class="ni ni-bold-left"></i></button>
                  Message
              </h5>
            </div>
             <div class="card-body scroll" ref="messageList">
                <table>
                    <template v-for="(message, index) in messageList" :key="index">
                        <tr v-if="index > 0 && messageList[index-1].createdAt.substr(0, 10) != messageList[index].createdAt.substr(0, 10)">
                            <td align="center" colspan="2"><p class="mt-3">{{messageList[index].createdAt.substr(0, 10)}}</p></td>
                        </tr>
                        <tr>
                            <td width="15%" class="" v-if="this.nickname != message.nickname && message.nickname == message.channel">
                                <img :src="message.profilePath" v-if="this.nickname != message.nickname" class="rounded-circle img-size border border-2 border-white">
                            </td>
                            <td v-if="message.nickname == message.channel">
                                <div class="mt-2">
                                <span> {{ message.nickname }}</span>
                                </div>
                                <div class="mt-1 speech-bubble float-left">
                                <span>{{ message.content }}</span>
                                </div>
                                <div class="mt-4">
                                    <span class="text-xs ms-1">{{ message.createdAt.substr(-5) }}</span>
                                </div>
                            </td>
                            <td colspan="2" v-else-if="this.nickname == message.nickname" align="right">
                                <div class="mt-2 speech-bubble msg-bg float-right">
                                <span>{{ message.content }}</span>
                                </div>
                                <div class="mt-4 float-right">
                                    <span class="text-xs me-1">{{ message.createdAt.substr(-5) }}</span>
                                </div>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
            <div class="card-footer">
                <input type="text" class="msg-input" v-model="message" @keyup="sendMessage">
                <a href="javascript:" @click="postComment">
                    <img class="img-size mb-1 ms-2 msg-btn" src="/icon/send-message-2-2.png">
                </a>
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
            nickname: "",
            message: "",
            messageList: [],
            axiosConfig: {
            headers:{
                  "X-AUTH-TOKEN": this.$store.state.token.accessToken
              }
            },
            channel: null,
            profilePath: null,
            name: this.$route.query.name
        }
    },
    components: {
    },
    created() {
        this.getMessage();
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
        async getMessage() {
            await this.$axios.get(`/api/message/${this.name}`, this.axiosConfig)
            .then((response) => {
                if (response.data == '') {
                    alert("구독 서비스가 필요합니다.")
                    this.$router.go(-1);
                    return;
                }
                this.channel = response.data.channel;
                this.profilePath = response.data.profilePath;
                this.nickname = response.data.nickname;
                this.messageList = response.data.messageList;
                // 소켓 연결 시도
                this.connect();
            })
            .catch((error) => {
                console.log(error)
            })
        },
        sendMessage(e) {
            if(e.keyCode === 13 && this.message !== "") {
                this.send();
                this.message = "";
            }
        },
        send() {
            console.log("Send message:" + this.message);
            if (this.stompClient && this.stompClient.connected) {
                const msg = {
                    nickname: this.nickname,
                    content: this.message,
                    channel: this.channel,
                    profilePath: this.profilePath,
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
                    console.log(this.$refs.contentWidth1)
                    // 서버의 메시지 전송 endpoit를 구독 (pub/sub)
                    this.stompClient.subscribe(`/send/${this.channel}`, res => {
                        console.log("구독으로 받은 메시지 입니다.", res.body);
                        this.messageList.push(JSON.parse(res.body))
                        console.log("messageList:" + this.messageList)
                    });
                },
                error => {
                    // 소켓 연결 실패
                    console.log("소켓 연결 실패", error);
                    this.connected = false;
                }
            )
        }
    },
    watch: {
        messageList: {
            // 화면에 추가된 후 동작하도록
            handler() {
                this.$nextTick(() => {
                let messages = this.$refs.messageList;
                messages.scrollTo({ top: messages.scrollHeight});

                });
            }, deep:true
            
        },
    },
}
</script>