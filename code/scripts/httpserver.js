// 1. 加载http核心模块
const http = require("http");
const fs = require("fs-extra");
const keyvalues = require("keyvalues-node");
const kv_path = "game/scripts/";

function main() {
    // 2. 使用http.createServer()方法创建一个web服务器，通过server接收
    let server = http.createServer();

    // 3. 服务器要做的事：提供服务，发送、接收、处理请求，并发送响应
    /** server.on注册request请求事件，客户端请求时会自动触发服务器的request请求事件；
	回调函数对请求进行处理，参数介绍：
	req提供了请求的详细信息。通过它可以访问请求头和请求的数据.
	res用于构造要返回给客户端的数据。
    */
    server.on("request", function (req, res) {
        // 这里的回调事件根据需要编写即可，这里给出简单示例
        // 3.1 收到请求时，打印请求的路径
        console.log(`收到客户端的请求了，请求路径是${req.url}`);
        // 3.2 设置响应头中的Content-Type为plain普通文本模式，否则中文无法正常展示
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        let url = req.url.replace("/", "_");
        let body = "";

        req.on("data", function (chunk) {
            body += chunk;
        });
        req.on("end", function () {
            try {
                body = JSON.parse(body);
                fs.writeJSONSync(kv_path + `${url}.json`, body);
            } catch (e) {}
        });
    });
    // 4.绑定端口号;
    server.listen(3000, function () {
        console.log("服务器启动成功，可以通过http:127.0.0.1:3000/来进行访问");
    });
}

(async () => {
    main();
    // GetConfig()
    // changets()
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
