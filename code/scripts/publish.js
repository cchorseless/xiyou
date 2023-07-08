"use strict";
const { spawn } = require("child_process");
const walk = require("walk");
const fs = require("fs-extra");
const fileMatch = require("file-match");
const path = require("path");
const { getDotaPath } = require("./utils");
const packageJson = require("../package.json");
const settings = packageJson.dota_developer.publish_options;
const walker = walk.walk("game");
const fileFilter = fileMatch(settings.excludeFiles);
const encryptFilter = fileMatch(settings.encryptFiles);
const exec = require("child_process").exec;
const aesluadir = "scripts/aeslua/aeslua/";
const assert = require("assert");
const luamin = require("luamin");
const version = settings.version || "1.0.0";
const dirName = packageJson.name + "_" + version.replace(/\./g, "_");
const publistroot = "publish/" + dirName;
const getPublishPath = (source) => {
    return source.replace(/^game/, publistroot);
};

let errorarr = [];
/**是否压缩 */
let ismin = true;
let argv = process.argv;
/**发布LUA */
let publishlua = argv[2] == "true";
/**发布res */
let publishres = argv[3] == "true";
/**是否加密代码 */
let encrypt = argv[4] == "true";
/**密匙 */
const keyinfo = [
    { key: "90C865A2E432539702FEA672E1C9C7029242B5D7", name: "xiyou", token: "1.0.0" },
    { key: "11708B8C7FC5CF1F39CB8C859BCDA626D08B9CFF", name: "xiyou", token: "1.0.1" },
    { key: "B6392736A80D27D1A589B94DFCF27BDCDF68DC7B", name: "xiyou", token: "1.0.2" },
    { key: "042D8AF82A311297C734D25EB928F2136BBC7E84", name: "xiyou", token: "1.0.3" },
    { key: "20A6F90CE89B81F9457182D3F16DFD2D5BFA1D8C", name: "xiyou", token: "1.0.4" },
];

const GetdedicatedServerKey = (v) => {
    for (let info of keyinfo) {
        if (info.token == v) {
            return info.key;
        }
    }
    throw new Error("no server key");
};
const dedicatedServerKey = GetdedicatedServerKey(version);

walker.on("file", (root, fileStats, next) => {
    const fileName = path.join(root, fileStats.name);
    if (fileFilter(fileName)) {
        // ignore the files we dont want to publish
        console.log(`[publish.js] ignore filtered file ->${fileName}`);
    } else {
        if (!fs.existsSync(getPublishPath(root))) {
            fs.mkdirSync(getPublishPath(root), { recursive: true });
            console.log(`[publish.js] [create-path] ->${root}`);
        }
        // 排除空格文件名
        if (fileName.indexOf(" ") == -1) {
            if (encryptFilter(fileName)) {
                // lua 代码优化
                if (!encrypt) {
                    let code = fs.readFileSync(fileName, { encoding: 'utf8' });
                    code = luamin.minify(code);
                    fs.writeFileSync(getPublishPath(fileName), code, { encoding: 'utf8' })
                    console.log(`[publish.js] [not encrypt mini] ->${fileName}`);
                }
                // 发布lua
                else if (publishlua) {
                    exec(`lua scripts/aeslua/encrypt_file.lua ${fileName} ${getPublishPath(fileName)} ${dedicatedServerKey} ${"code"} ${version}`, (err, out, stderr) => {
                        if (err) {
                            errorarr.push(fileName);
                            console.log(err);
                        } else {
                            console.log(`[publish.js] [encrypt] ->${fileName}`);
                        }
                    });
                }
            } else {
                // 发布资源
                if (publishres) {
                    console.log(`[publish.js] [copy] ->${fileName}`);
                    fs.copyFileSync(fileName, getPublishPath(fileName));
                }
            }
        }
    }
    if (errorarr.length == 0) {
        next();
    }
});
walker.on("end", async () => {
    console.log(`error encrypt :` + errorarr.length);
    if (errorarr.length > 0) {
        console.error(errorarr);
        return;
    }
    console.log("同步加密文件中·····");
    // 复制加密文件
    let out = publistroot + "/scripts/vscripts/aeslua";
    if (fs.existsSync(aesluadir)) {
        if (!fs.existsSync(out)) {
            fs.mkdirSync(out);
        }
        fs.copySync(aesluadir, out);
    }
    console.log("同步项目目录到dota目录中·····");
    // 映射文件
    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log("No Dota 2 installation found. Addon linking is skipped.");
        return;
    }
    const directoryName = "game";
    const sourcePath = path.resolve(__dirname, "..", publistroot);
    assert(fs.existsSync(sourcePath), `Could not find '${sourcePath}'`);
    const targetRoot = path.join(dotaPath, directoryName, "dota_addons");
    assert(fs.existsSync(targetRoot), `Could not find '${targetRoot}'`);
    const targetPath = path.join(dotaPath, directoryName, "dota_addons", dirName);
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
    }
    // 移除目标文件夹的所有内容，
    // fs.chmodSync(targetPath, '0755');
    // await rimraf(targetPath, () => {
    //     fs.moveSync(sourcePath, targetPath, { overwrite: true });
    //     console.log(`[publish.js] [finish] ->${targetPath}`);
    // });
    fs.copySync(sourcePath, targetPath);
    fs.removeSync(sourcePath);
    console.log(`[publish.js] [finish] ->${targetPath}`);
    // 打开文件夹
    spawn("explorer", [targetPath]);
});
