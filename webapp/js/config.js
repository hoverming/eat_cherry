
angular.module('greenbird')
    .constant('$gbSetting', {
        //-- 是否使用模拟数据
        isMockEnv: true,

        //-- 是否建立websocket
        isUsingWebSocket: false,

        //-- WebSocket地址
        webSocketAddress : "ws://cs.feifeiit.cn/tips",

        //登陆地址
        loginAddress : "http://login.feifeiit.cn"
    });