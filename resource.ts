import express from 'express';
import { join } from 'path-browserify';

const root = require("../output/test.json")[0];
const pkgRoot = join(root.dir, root.id);

export default (port: number = 5500, host: string = '127.0.0.1') => {
    const app = express();
    console.log(`为静态资源${pkgRoot}启动express服务器.`);
    app.use(express.static(pkgRoot));

    return app.listen(port, host, () => {
        console.log("已启动静态资源.");
    })
}