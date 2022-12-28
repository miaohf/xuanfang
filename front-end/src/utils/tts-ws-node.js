/* Created by miaohf on 2021/11/23.
 * 运行前：请先填写 appid、apiSecret、apiKey
 * 在线语音合成 WebAPI 接口调用示例 接口文档（必看）：https://www.xfyun.cn/doc/tts/online_tts/API.html
 * https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 */
const CryptoJS = require('crypto-js')
// const WebSocket = require('ws')
var fs = require('fs')


export class keDaXunFei {
    constructor(outputfile, text) {
        // let this = this
        this.hostUrl = "wss://tts-api.xfyun.cn/v2/tts",
            this.host = "tts-api.xfyun.cn",
            this.uri = "/v2/tts",
            this.appid = "fc655f56",
            this.apiSecret = "ZGU1NWJlMDUwMDc4OTQ3ZWFiNzI4NDU2",
            this.apiKey = "ec4bfd6e0394962b97b0bae83a28a4a4",
            this.outputfile = outputfile || 'test.mp3',
            this.text = text || "这是一个例子，欢迎使用九色鹿抽签管理系统"
    }


    // connect () {
    //     this.ws = new WebSocket(config.serverUri);
    
    //     this.ws.onopen = () => this.onConnectionOpen();
    //     this.ws.onmessage = (event) => this.onConnectionMessage(event);
    //     this.ws.onclose = () => this.onConnectionClose();
    //     this.ws.sendJSON = (obj) => this.ws.send(JSON.stringify(obj));
    
    //     this.state.status = States.CONNECTING;
    //   }

    connect() {
        
        // 获取当前时间 RFC1123格式
        let date = (new Date().toUTCString())
        console.log(this.hostUrl, this.getAuthStr(date), date, this.host)
        let wssUrl = this.hostUrl + "?authorization=" + this.getAuthStr(date) + "&date=" + date + "&host=" + this.host
        console.log(this.text)
        let ws = new WebSocket(wssUrl)      

        // 连接建立完毕，读取数据进行识别
        ws.onopen = () => {
            console.log("websocket connect!")
            let frame = {
                // 填充common
                "common": {
                    "app_id": this.appid
                },
                // 填充business
                "business": {
                    // "aue": "raw", // pcm
                    "aue": "lame",   // mp3
                    "auf": "audio/L16;rate=16000",
                    "vcn": "x2_qianqian",
                    "tte": "UTF8"
                },
                // 填充data
                "data": {
                    "text": Buffer.from(this.text).toString('base64'),
                    "status": 2
                }
            }
            ws.send(JSON.stringify(frame))
            // 如果之前保存过音频文件，删除之
            // if (fs.existsSync('./test.pcm')) {
            //     fs.unlink('./test.pcm', (err) => {
            //         if (err) {
            //             console.log('remove error: ' + err)
            //         }
            //     })
            // }
        }
        
        // 得到结果后进行处理，仅供参考，具体业务具体对待
        ws.onmessage = (response) => {
            console.log(response)
            // if (err) {
            //     console.log('message error: ' + err)
            //     return
            // }
            let res = JSON.parse(response.data)
            if (res.code != 0) {
                console.log(res.code, res.message)
                ws.close()
                return
            }
            let audio = res.data.audio
            // console.log(audio)
            let audioBuf = Buffer.from(audio, 'base64')
            this.save(audioBuf)
            if (res.code == 0 && res.data.status == 2) {
                ws.close()
            }
        }

        // 资源释放
        ws.onclose = () => {
            console.log('connect close!')
        }

        // 连接错误
        ws.onerror = (err) => {
            console.log("websocket connect err: " + err)
        }
    }

    // 鉴权签名
    getAuthStr(date) {
        let signatureOrigin = `host: ${this.host}\ndate: ${date}\nGET ${this.uri} HTTP/1.1`
        let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.apiSecret)
        let signature = CryptoJS.enc.Base64.stringify(signatureSha)
        let authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
        let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
        return authStr
    }


    // 保存文件
    save(data) {
        fs.writeFile('./test.mp3', data, { flag: 'a' }, (err) => {
            if (err) {
                console.log('save error: ' + err)
                return
            }
            console.log('文件保存成功')
        })
    }
}