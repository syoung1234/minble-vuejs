<template>
    <input type="text" v-model="message" @keyup="sendMessage">
    <div v-for="(message, index) in messageList" :key="index">
        <h3>내용: {{ message.content }}</h3>
    </div>
</template>

<script>
import Stomp from "webstomp-client"
import SockJS from "sockjs-client"

export default {
    name: "message",
    data() {
        return {
            nickname: "",
            message: "",
            messageList: [],
        }
    },
    created() {
        // 소켓 연결 시도
        this.connect();
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
            if (this.stompClient && this.stompClient.connected) {
                const msg = {
                    nickname: "test",
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