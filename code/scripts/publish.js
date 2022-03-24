"use strict";
const { spawn } = require('child_process');
const walk = require("walk");
const fs = require("fs-extra");
const fileMatch = require("file-match");
const path = require("path");
const { getDotaPath } = require('./utils');
const packageJson = require("../package.json");
const settings = packageJson.dota_developer.publish_options;
const walker = walk.walk("game");
const fileFilter = fileMatch(settings.excludeFiles);
const encryptFilter = fileMatch(settings.encryptFiles);
const exec = require("child_process").exec;
const aesluadir = 'scripts/aeslua/aeslua/';
const assert = require('assert');
const luamin = require('luamin');
const version = settings.version || '1.0.0';
const dirName = packageJson.name + '_' + version.replace(/\./g, '_');
const publistroot = "publish/" + dirName
const getPublishPath = (source) => {
    return source.replace(/^game/, publistroot)
}

let errorarr = [];
/**是否压缩 */
let ismin = true;
let argv = process.argv;
/**发布LUA */
let publishlua = argv[2] == 'true'
/**发布res */
let publishres = argv[3] == 'true'
/**密匙 */
const keyinfo = [
    { "key": "117DFDBC5F636E65B3826707246DBAF19389F188", "name": "c2", "token": "1.0.0" },
    { "key": "9C44D4B05F11BFB30C7BE83885925F9A147F6288", "name": "c2", "token": "1.0.1" },
    { "key": "A530D6C0869D6737BF79C2C75EC87074050C3C5E", "name": "c2", "token": "1.0.2" },
    { "key": "ECBF6972224D46014FD7B0D6B8E78C9E6211C719", "name": "c2", "token": "1.0.3" },
    { "key": "9010F6B85B864113346A1DE76216E633F0D5BFA8", "name": "c2", "token": "1.0.4" },
    { "key": "E6292454FE5F714E43E5F010582E7A6D3A88A0BB", "name": "c2", "token": "1.0.5" },
    { "key": "E0C380289890E13161BC918FFD08421784698E4C", "name": "c2", "token": "1.0.6" },
    { "key": "C13D8B449E72C7B4AD276EFD372D6EA7A434CDC2", "name": "c2", "token": "1.0.7" },
    { "key": "C6C51CFD08B4301873F813FA4269ECD533AB19E2", "name": "c2", "token": "1.0.8" },
    { "key": "B25530704A94DA3272B8DF55FB30AA2749F74306", "name": "c2", "token": "1.0.9" },
    { "key": "C014CC19D37CF34DCF9AB3DC2A339D70256282FF", "name": "c2", "token": "1.1.0" },
    { "key": "DFB3F90541B943AAE794C7708CD6E069461769C4", "name": "c2", "token": "1.1.1" }
];

const GetdedicatedServerKey = (v) => {
    for (let info of keyinfo) {
        if (info.token == v) {
            return info.key;
        }
    }
    throw new Error('no server key')
}
const dedicatedServerKey = GetdedicatedServerKey(version)

walker.on("file", (root, fileStats, next) => {
    const fileName = path.join(root, fileStats.name);
    if (fileFilter(fileName)) {
        // ignore the files we dont want to publish
        console.log(`[publish.js] ignore filtered file ->${fileName}`);
    }
    else {
        if (!fs.existsSync(getPublishPath(root))) {
            fs.mkdirSync(getPublishPath(root), { recursive: true });
            console.log(`[publish.js] [create-path] ->${root}`);
        }
        // 排除空格文件名
        if (fileName.indexOf(' ') == -1) {
            if (encryptFilter(fileName)) {
                // lua 代码优化
                // if(ismin){
                //     let code = fs.readFileSync(fileName, { encoding: 'utf8' });
                //     code = luamin.minify(code);
                // }
                // console.log(code);
                // 发布lua
                if (publishlua) {
                    exec(`lua scripts/aeslua/encrypt_file.lua ${fileName} ${getPublishPath(fileName)} ${dedicatedServerKey} ${"code"} ${version}`, (err, out, stderr) => {
                        if (err) {
                            errorarr.push(fileName)
                        }
                        else {
                            console.log(`[publish.js] [encrypt] ->${fileName}`);
                        }
                    });
                }

            }
            else {
                // 发布资源
                if (publishres) {
                    console.log(`[publish.js] [copy] ->${fileName}`);
                    fs.copyFileSync(fileName, getPublishPath(fileName));
                }
            }
        }
    }
    next();
});
walker.on('end', async () => {
    console.log(`error encrypt :` + errorarr.length);
    if (errorarr.length > 0) {
        console.error(errorarr);
        return;
    };
    console.log("同步加密文件中·····");
    // 复制加密文件
    let out = publistroot + "/scripts/vscripts/aeslua"
    if (fs.existsSync(aesluadir)) {
        if (!fs.existsSync(out)) {
            fs.mkdirSync(out)
        }
        fs.copySync(aesluadir, out);
    }
    console.log("同步项目目录到dota目录中·····");
    // 映射文件
    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log('No Dota 2 installation found. Addon linking is skipped.');
        return;
    }
    const directoryName = 'game'
    const sourcePath = path.resolve(__dirname, '..', publistroot);
    assert(fs.existsSync(sourcePath), `Could not find '${sourcePath}'`);
    const targetRoot = path.join(dotaPath, directoryName, 'dota_addons');
    assert(fs.existsSync(targetRoot), `Could not find '${targetRoot}'`);
    const targetPath = path.join(dotaPath, directoryName, 'dota_addons', dirName);
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
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
    spawn('explorer', [targetPath])

})
