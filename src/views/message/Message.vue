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
            <ImageModal v-if="showImageModal" @close="showImageModal = false">
               <div><img class="img-size modal-img-mh" :src="modalFilePath"></div>
               <!-- /default -->
               <!-- footer 슬롯 콘텐츠 -->
               <div class="img-modal-footer">
                 <button type="button" class="btn btn-link bg-white w-100" @click="downloadFile">
                     다운로드
                 </button>
               </div>
            </ImageModal>
             <div class="card-body scroll" ref="messageList">
                <table>
                    <template v-for="(message, index) in messageList" :key="index">
                        <tr v-if="index > 0 && messageList[index-1].createdAt.substr(0, 10) != messageList[index].createdAt.substr(0, 10)">
                            <td align="center" colspan="2"><p class="mt-3">{{messageList[index].createdAt.substr(0, 10)}}</p></td>
                        </tr>
                        <tr class="">
                            <td width="15%" class="align-top" v-if="this.nickname != message.nickname">
                                <img :src="message.profilePath" v-if="this.nickname != message.nickname" class="rounded-circle img-size border border-2 border-white mt-2">
                            </td>
                            <td v-if="nickname != message.nickname">
                                <div class="mt-2">
                                <span> {{ message.nickname }}</span>
                                </div>
                                <img class="img-size float-left msg-file" :src="message.filePath" @click="showImage(message.filePath, message.filename)" v-if="message.filePath">
                                <div class="mt-1 speech-bubble float-left" v-else>
                                    <span>{{ message.content }}</span>
                                </div>
                                <div class="mt-4">
                                    <span class="text-xs ms-1">{{ message.createdAt.substr(-5) }}</span>
                                </div>
                            </td>
                            <td colspan="2" v-else align="right">
                                <img class="img-size float-right msg-file pointer" :src="message.filePath" v-if="message.filePath" @click="showImage(message.filePath, message.filename)">
                                <div class="mt-2 speech-bubble msg-bg float-right" v-else>
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
            <div :class="nickname == channel ? 'card-footer px-2' : 'card-footer'">
                <div class="ni ni-image color-gray mx-auto mb-0 me-1 pointer" @click="$refs.fileRef.click" v-if="nickname == channel">
                    <input type="file" id="file" @change="postFile()" ref="fileRef" multiple hidden>
                </div>
                <input type="text" class="msg-input" v-model="message" @keyup="sendMessage">
                <img class="img-size mb-1 ms-2 msg-btn pointer" src="/icon/send-message-2-2.png" @click="send">
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
import ImageModal from "@/examples/ImageModal.vue";

const body = document.getElementsByTagName("body")[0];
export default {
    name: "message",
    data() {
        return {
            nickname: "",
            message: "",
            messageList: [],
            channel: null,
            profilePath: null,
            name: this.$route.query.name,
            filePath: null,
            showImageModal: false,
            modalFilePath: null,
            modalFileName: null,
        }
    },
    components: {
        ImageModal,
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
            await this.$http.get(`/api/message/${this.name}`)
            .then((response) => {
                console.log(response)
                if (response.data == '') {
                    alert("구독 서비스가 필요합니다.")
                    this.$router.push("/store?name="+this.name)
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
            }
        },
        send() {
            if (this.message == "") {
                return;
            }
            console.log("Send message:" + this.message);
            if (this.stompClient && this.stompClient.connected) {
                const msg = {
                    nickname: this.nickname,
                    content: this.message,
                    channel: this.channel,
                    profilePath: this.profilePath,
                    filePath: this.filePath,
                };
                this.stompClient.send("/receive", JSON.stringify(msg), {});
            }
            // 초기화
            this.message = "";
            this.filePath = null;
        },
        connect() {
            const serverURL = process.env.VUE_APP_API_URL;
            let socket = new SockJS(serverURL + "/echo");
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
                        // console.log("구독으로 받은 메시지 입니다.", res.body);
                        this.messageList.push(JSON.parse(res.body))
                        // console.log("messageList:" + this.messageList)
                    });
                },
                error => {
                    // 소켓 연결 실패
                    console.log("소켓 연결 실패", error);
                    this.connected = false;
                }
            )
        },
        async postFile() {
            const formData = new FormData()
            // 파일 전송 
            let file = event.target.files[0];
            console.log(file);
            formData.append("file", file)
            
            // 파일 저장 후에 메시지 send()
            await this.$axios.post("/api/messagefile", formData, {headers:{
            "Content-Type": "multipart/form-data"}})
            .then((response) => {
                console.log(response)
                this.filePath = response.data; // 메시지 보낸 후 초기화 해줘야함 
                this.message = null; // 메시지가 null일 때는 메시지에 파일만 전송
                this.send();
            })
            .catch((error) => {
                console.log(error)
            })
        },
        showImage(filePath, filename) {
          this.showImageModal = true;
          this.modalFilePath = filePath;
          this.modalFileName = filename;
        },
        downloadFile() {
            try {
                let element = document.createElement('a');
                    element.setAttribute('href', `${this.modalFilePath}` );
                    element.click();
            } catch (error) {
                console.log(error);
            }
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