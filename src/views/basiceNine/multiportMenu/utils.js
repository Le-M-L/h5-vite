import { ref, onMounted } from 'vue';
import TransWorker from './transcode.worker.js'

console.log(postMessage)

import CryptoJS from 'crypto-js';

const APPID = '5ec4f194';
const API_SECRET = '5b348ea95510075e40d6fd2ffcd1d355';
const API_KEY = '0ba50e9138d9a8040d314308af844072';

export const initWebScoket = () => {
  const webSocket = ref();
  /**
   * 获取websocket url
   * 该接口需要后端提供，这里为了方便前端处理
   */
  const getWebSocketUrl = () => {
    return new Promise((resolve, reject) => {
      // 请求地址根据语种不同变化
      var url = 'wss://iat-api.xfyun.cn/v2/iat';
      var host = 'iat-api.xfyun.cn';
      var apiKey = API_KEY;
      var apiSecret = API_SECRET;
      var date = new Date().toGMTString();
      var algorithm = 'hmac-sha256';
      var headers = 'host date request-line';
      var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
      var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
      var signature = CryptoJS.enc.Base64.stringify(signatureSha);
      var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
      var authorization = btoa(authorizationOrigin);
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
      resolve(url);
    });
  };

  // 向webSocket发送数据
  const webSocketSend = () => {
      // 连接状态 1 表示成功
    if (webSocket.value.readyState !== 1) {
      return;
    }
    // let audioData = this.audioData.splice(0, 1280);
    // var params = {
    //   common: {
    //     app_id: this.appId,
    //   },
    //   business: {
    //     language: this.language, //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
    //     domain: 'iat',
    //     accent: this.accent, //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
    //     vad_eos: 5000,
    //     dwa: 'wpgs', //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
    //   },
    //   data: {
    //     status: 0,
    //     format: 'audio/L16;rate=16000',
    //     encoding: 'raw',
    //     audio: this.toBase64(audioData),
    //   },
    // };
    // this.webSocket.send(JSON.stringify(params));
    // this.handlerInterval = setInterval(() => {
    //   // websocket未连接
    //   if (this.webSocket.readyState !== 1) {
    //     this.audioData = [];
    //     clearInterval(this.handlerInterval);
    //     return;
    //   }
    //   if (this.audioData.length === 0) {
    //     if (this.status === 'end') {
    //       this.webSocket.send(
    //         JSON.stringify({
    //           data: {
    //             status: 2,
    //             format: 'audio/L16;rate=16000',
    //             encoding: 'raw',
    //             audio: '',
    //           },
    //         }),
    //       );
    //       this.audioData = [];
    //       clearInterval(this.handlerInterval);
    //     }
    //     return false;
    //   }
    //   audioData = this.audioData.splice(0, 1280);
    //   // 中间帧
    //   this.webSocket.send(
    //     JSON.stringify({
    //       data: {
    //         status: 1,
    //         format: 'audio/L16;rate=16000',
    //         encoding: 'raw',
    //         audio: this.toBase64(audioData),
    //       },
    //     }),
    //   );
    // }, 40);
  };

  onMounted(() => {
    getWebSocketUrl().then((url) => {
      let iatWS;
      if ('WebSocket' in window) {
        iatWS = new WebSocket(url);
      } else if ('MozWebSocket' in window) {
        iatWS = new MozWebSocket(url);
      } else {
        alert('浏览器不支持WebSocket');
        return;
      }
      //   this.setStatus('init');
      // 链接成功后的回调
      iatWS.onopen = (e) => {
        console.log(e);
        // 设置录音状态
        // this.setStatus('ing');
        // 重新开始录音
        setTimeout(() => {
          webSocketSend();
        }, 500);
      };
      // 接收 消息
      iatWS.onmessage = (e) => {
        console.log(e);
        // this.result(e.data);
      };
      // 错误信息
      iatWS.onerror = (e) => {
        console.log('error', e);
        // this.recorderStop();
      };
      // 关闭
      iatWS.onclose = (e) => {
        console.log('close', e);
        // this.recorderStop();
      };
      webSocket.value = iatWS;
    });
  });

  return {
    webSocket,
  };
};
