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
             <div class="card-body scroll" ref="messageList">
                <table>
                    <tr v-for="(message, index) in messageList" :key="index">
                        <td width="15%" class="">
                            <img :src="message.profilePath" v-if="this.nickname != message.nickname" class="rounded-circle img-size border border-2 border-white">
                        </td>
                        <td v-if="this.nickname != message.nickname">
                            <div class="mt-2">
                            <span> {{message.nickname }}</span>
                            </div>
                            <div class="mt-3 speech-bubble" :style="`width: ${widthList[index]}px`">
                            <span :class="`${index}`" :ref="`contentWidth${index}`">{{ message.content }}</span>
                            </div>
                        </td>
                        <td v-else align="right">
                            <div class="mt-4 speech-bubble" :style="`width: ${widthList[index]}px`">
                            <span :class="`${index}`" :ref="`contentWidth${index}`">{{ message.content }}</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(message, index) in currentMessageList" :key="index" ref="currentMessageList">
                        <td width="15%" class="">
                            <img :src="message.profilePath" v-if="this.nickname != message.nickname" class="rounded-circle img-size border border-2 border-white">
                        </td>
                        <td v-if="this.nickname != message.nickname">
                            <div class="mt-2">
                            <span> {{message.nickname }}</span>
                            </div>
                            <div class="mt-3 speech-bubble" :style="`width: ${currentWidthList[index]}px`">
                            <span :class="`${index}`" :ref="`currentWidth${index}`">{{ message.content }}</span>
                            </div>
                        </td>
                        <td v-else align="right">
                            <div class="mt-4 speech-bubble" :style="`width: ${currentWidthList[index]}px`">
                            <span :class="`${index}`" :ref="`currentWidth${index}`">{{ message.content }}</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="card-footer">
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
            nickname: "",
            message: "",
            messageList: [],
            i: 0,
            axiosConfig: {
            headers:{
                  "X-AUTH-TOKEN": this.$store.state.token.accessToken
              }
            },
            channel: null,
            profilePath: null,
            widthList: [],
            currentMessageList: [],
            currentWidthList: [],
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
            await this.$axios.get("/api/message/test2", this.axiosConfig)
            .then((response) => {
                console.log(response);
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
            this.i = this.i+1;
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
                    this.resizeWidth();
                    // 서버의 메시지 전송 endpoit를 구독 (pub/sub)
                    this.stompClient.subscribe(`/send/${this.channel}`, res => {
                        console.log("구독으로 받은 메시지 입니다.", res.body);
                        this.currentMessageList.push(JSON.parse(res.body))
                        console.log("c_messageList:" + this.currentMessageList)
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

                for (let i = 0; i < this.messageList.length; i++) {
                this.widthList.push(this.$refs['contentWidth'+i].offsetWidth + 35)
                }
                });
            }, deep:true
            
        },
        currentMessageList: {
            handler() {
                    this.$nextTick(() => {
                    // let messages = this.$refs.currentMessageList;
                    this.$refs.messageList.scrollTo({ top: this.$refs.messageList.scrollHeight});

                    for (let i = this.currentMessageList.length-1; i < this.currentMessageList.length; i++) {
                        this.currentWidthList.push(this.$refs['currentWidth'+i].offsetWidth + 35)
                    }
                });
            }, deep:true
            
        }
        
    },
}
</script>