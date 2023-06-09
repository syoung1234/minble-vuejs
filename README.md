# minble - vue.js
1인 프로젝트 <br>
vus.js 로는 처음 개발해보았습니다. <br><br>

SNS 형식의 팬 카페입니다. vue.js 부트스트랩을 사용하여 개발하였습니다. 부트스트랩을 사용하면서 필요한 폴더와 파일을 추가하며 사용했기 때문에 형식이 깔끔하지 않습니다. 추후 지속적으로 수정과 삭제를 해 나아갈 예정입니다.

Bootstrap: https://demos.creative-tim.com/vue-argon-dashboard/?ref=readme-vad#/dashboard-default

<br>

minble backend github: https://github.com/syoung1234/minble
<br><br>

# 미리보기
### STAR 계정 게시글 작성 및 파일 업로드
<img src="https://github.com/syoung1234/minble/assets/71418436/4c3544bf-b0cd-4e12-8794-a9c7f9973e09">

<br>

### 파일 다운로드
<img src="https://github.com/syoung1234/minble/assets/71418436/a19dc195-d11b-4726-ab1e-dba43a151e93">

<br>

### STAR 계정 메시지
<img src="https://github.com/syoung1234/minble/assets/71418436/e7dbfccc-4fc8-4ca5-a1f2-9158f0af05e2">



<br><br>

# 실시간 채팅 기능
## [Message](src/views/message/Message.vue)
### webstomp-client
### sockjs-client

``` js
import Stomp from "webstomp-client"
import SockJS from "sockjs-client"

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
            // 서버의 메시지 전송 endpoit를 구독 (pub/sub)
            this.stompClient.subscribe(`/send/${this.channel}`, res => {
                this.messageList.push(JSON.parse(res.body))
            });
        },
        error => {
            // 소켓 연결 실패
            console.log("소켓 연결 실패", error);
            this.connected = false;
        }
    )
},
```
<br><br>

# Setting
yarn install <br>
yarn build <br>
yarn serve