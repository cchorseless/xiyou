/*
 * @Author: Jaxh
 * @Date: 2021-04-27 12:22:26
 * @LastEditors: your name
 * @LastEditTime: 2021-05-24 15:03:06
 * @Description: file content
 */
const fs = require('fs-extra');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const path = require('path');
const { read_all_files, read_sub_directories } = require('./utils');

// 需要读取的excel路径
const npc_path = 'game/scripts/';
const kv_path = 'game/scripts/npc';
const interface_path = 'content/scripts/tscripts/kvInterface';
const uiInterface_path = 'content/panorama/src/config';
const kvjsconfig = 'game/scripts/npc/kv_js_config.kv';
const KvAllInterface_UI = uiInterface_path + '/KvAllInterface.ts';
const KvAllInterface_Game = interface_path + '/KvAllInterface.ts';

String.format = function () {
    var param = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        param.push(arguments[i]);
    }
    var statment = param[0]; // get the first element(the original statement)
    param.shift(); // remove the first element from array
    return statment.replace(/\{(\d+)\}/g, function (m, n) {
        return param[n];
    });
};

/**
 * 计算两个set的相似度
 * @param {} set1
 * @param {*} set2
 */
function countSetKeyIsSame(set1, set2) {
    // return 1
    // 长度
    let leng_set1 = set1.size;
    let leng_set2 = set2.size;
    let minLen = Math.min(leng_set1, leng_set2);
    if (Math.abs(leng_set1 - leng_set2) > 5 && minLen >= 5) {
        return 0.1
    }
    // 交集
    let intersect = new Set([...set1].filter(function (x) {
        return set2.has(x);
    }))

    let r = Math.max(intersect.size / leng_set1, intersect.size / leng_set2);
    if (intersect.size > 0) {
        if (leng_set1 <= 3 || leng_set2 <= 3) {
            r = r + 0.8
        }
    }
    return r
}


function parseTreeObj(obj) {
    let typeObj = {};
    let needkeys = [];
    typeObj["0"] = {}
    for (let _key in obj) {
        if (_key == "__extendBase__") {
            typeObj['__extendBase__'] = obj["__extendBase__"]
            continue
        }
        let t_s = null
        if (typeof (obj[_key]) == "string") {
            t_s = "string"
        }
        else {
            t_s = "OBJ_1_1"
            needkeys.push({ deep: 1, parent: obj, key: _key, parentindex: "OBJ_1_1" })
        }
        // 考虑K相同值不同的情况
        let countDeep = Object.keys(typeObj["0"]).length || 1;
        if (typeObj["0"]["OBJ_0_" + countDeep] == null) {
            typeObj["0"]["OBJ_0_" + countDeep] = {}
        }
        let cur = typeObj["0"]["OBJ_0_" + countDeep];
        if (cur[_key] == null) {
            cur[_key] = t_s
        }
        else {
            cur[_key] = " | " + t_s;
        }
    }
    while (needkeys.length > 0) {
        let info = needkeys.shift();
        obj = info.parent[info.key];
        deep = info.deep;
        // 下一层对象结构
        if (typeObj['' + deep] == null) {
            typeObj['' + deep] = {}
        }
        let countDeep = Object.keys(typeObj['' + deep]).length || 1;
        if (typeObj['' + deep]["OBJ_" + deep + "_" + countDeep] == null) {
            typeObj['' + deep]["OBJ_" + deep + "_" + countDeep] = {}
        }
        // 第一个对象，只有一个对象
        let cur = typeObj['' + deep]["OBJ_" + deep + "_" + countDeep];
        let countindex = null;
        if (Object.keys(cur).length == 0) {
            countindex = "OBJ_" + deep + "_" + 1;
        }
        // 本层有多个结构，需要匹配最合适的
        else {
            let maxKeissame = 0;// 最大相似度
            let keySet = new Set(Object.keys(obj));
            for (let _k in typeObj['' + deep]) {
                let _v = typeObj['' + deep][_k];
                let haskeyset = new Set(Object.keys(_v));
                // 用集合 判断 key的相似度
                let keyisSame = countSetKeyIsSame(keySet, haskeyset);
                // K值相同加分
                if (_k == info.key) {
                    keyisSame += 0.1
                }
                else {
                    keyisSame -= 0.1
                }
                if (keyisSame > maxKeissame) {
                    maxKeissame = keyisSame
                    countindex = _k
                }
            }
            if (maxKeissame <= 0.8) {
                //  找到索引
                countindex = "OBJ_" + deep + "_" + (countDeep + 1);
                if (typeObj['' + deep][countindex] == null) {
                    typeObj['' + deep][countindex] = {}
                }
            }
        }
        // 修改父节点类型指向
        if (countindex) {
            // console.log(info.parentindex)
            let _p = typeObj['' + (deep - 1)][info.parentindex];
            if (_p) {
                if (_p[info.key]) {
                    _p[info.key] = _p[info.key].replace('OBJ_?', countindex);
                }
                else {
                    _p[info.key] = countindex;
                }
            }
        }
        // 遍历对象
        for (let _key in obj) {
            let cur_type = null;
            if (typeof (obj[_key]) == "string") {
                cur_type = "string"
            }
            // 有新的下一列需要添加
            else {
                needkeys.push({ deep: deep + 1, parent: obj, key: _key, parentindex: countindex });
                // 需要挑选 下一深度的类型
                cur_type = "OBJ_?";
            }
            // 兼容同个字段多个类型值
            let cur = typeObj['' + deep][countindex][_key];
            if (cur != null && cur.indexOf(cur_type) == -1) {
                cur += " | " + cur_type
            }
            else {
                cur = cur_type;
            }
            typeObj['' + deep][countindex][_key] = cur
        }


    }

    return typeObj
}

function buildTsStr(obj) {
    let r = "";
    let outObj = {};
    let needExtra = null;
    for (let i in obj) {
        if (i == "__extendBase__") {
            needExtra = obj[i];
            continue
        }
        let _obj = obj[i];
        for (let _k in _obj) {
            outObj[_k] = _obj[_k]
        }
    }
    let insterS = '';
    // 处理继承关系
    if (needExtra) {
        let i = 0;
        for (let _base of needExtra) {
            // #base  "kv/npc_summon_uni2t.kv" => import { OBJ_1_1 as npc_summon_unit } from "./kv/npc_summon_unit";
            _base = _base.replace("#base", "import { OBJ_1_1 as Import_OBJ_" + i + " } from ");
            _base = _base.replace(/\'/g, "\"").replace("\"", "\"./");
            _base = _base.replace(/\.(k|K)(v|V)/, '').replace(/\.(t|T)(x|X)(t|T)/, '');
            if (i == 0) {
                insterS += ' extends ';
            }
            else {
                insterS += ',';
            }
            insterS += " Import_OBJ_" + i;
            i += 1;
            r += _base
        }
    }
    for (let _k in outObj) {
        if (_k == 'OBJ_1_1') {
            r += "export interface " + _k + insterS + " {\n";
        }
        else {
            r += "export interface " + _k + " {\n";
        }
        let inobj = outObj[_k];
        let temp = "";
        for (let k in inobj) {
            if (!temp.includes(inobj[k])) {
                if (temp != "") {
                    temp += " | ";
                }
                temp += inobj[k];
            }
            r += '"' + k + '" :' + inobj[k] + " ,\n";
        }
        if (temp == "") {
            temp="any"
        }
        if (_k !== "OBJ_0_1") {
            r += `[k:string] : ${temp} `;
        }
        r += '}\n';
    }
    // console.log(r);
    return r
}

function single_excel_to_kv(file, outFilePath = interface_path) {
    if ((path.extname(file) != '.txt' && path.extname(file) != '.kv') || file.indexOf('~$') >= 0) {
        console.log('kv2Interface compiler ingore non-excel file=>', file);
        return;
    }

    let kv_s = fs.readFileSync(file, "utf8");
    // 处理#base
    let repObj = kv_s.match(/#base(.+)([\r\n|\n])/gi);
    if (repObj) {
        for (let reps of repObj) {
            kv_s = kv_s.replace(reps, "");
        }
    }
    else {
        if (kv_s.indexOf('#base') >= 0) {
            throw Error("#base 没有匹配到")
        }
    }
    let obj;
    try {
        obj = keyvalues.decode(kv_s);
    }
    catch (e) {
        console.log('解析KV文件失败:', file, e);
        return
    }
    if (repObj && obj) {
        obj['__extendBase__'] = repObj
    }
    // console.log(obj);
    // return
    let func = (obj) => {
        for (let _key in obj) {
            if (_key == "__extendBase__") {
                continue
            }
            if (typeof (obj[_key]) == "string") {
                obj[_key] = "string"
            }
            else {
                func(obj[_key])
            }
        }
        return obj
    }
    let outObj = func(obj);
    let outType = parseTreeObj(outObj);
    // console.log(outType);
    // let
    // return
    let outpath = file.replace(kv_path, outFilePath).replace(/\.(k|K)(v|V)$/, '.ts').replace(/\.(t|T)(x|X)(t|T)$/, '.ts');;
    let parent_i = outpath.lastIndexOf('/');
    let out_dir = outpath.substr(0, parent_i);
    if (!fs.existsSync(outFilePath)) fs.mkdirSync(outFilePath);
    if (!fs.existsSync(out_dir)) fs.mkdirSync(out_dir);
    fs.writeFileSync(outpath, "" + buildTsStr(outType));
    console.log('success kv->interface', outpath);
    return true
}

const all_excel_to_kv = async () => {
    //生成接口文件
    if (!fs.existsSync(kvjsconfig)) {
        throw Error("kvjsconfig文件不存在：" + file);
    }
    let kvConfig = keyvalues.decode(fs.readFileSync(kvjsconfig, 'utf-8'));
    let kvfiles = kvConfig.EOMConfig.kvfiles;// 转JS
    // 客戶端
    let kvInterface_client = kvConfig.EOMConfig.kvInterface_client;
    // 服務器
    let kvInterface_server = kvConfig.EOMConfig.kvInterface_server;
    // 整體合併
    let kvToInterface = {};
    for (let _kk in kvInterface_client) { kvToInterface[_kk] = kvInterface_client[_kk] }
    for (let _kk in kvInterface_server) { kvToInterface[_kk] = kvInterface_server[_kk] }
    let successCount = 0;
    let errorCount = 0;
    //#region  转 uiinterface
    let KvAllInterface_s = '';
    let KvAllInterface_s_1 = '';
    for (let k in kvfiles) {
        let file = npc_path + kvfiles[k];
        let ext = path.extname(file);
        if (!(ext == '.txt' || ext == '.kv')) {
            console.log('kv js sync script ignore change of none kv file=>', file);
            return;
        }
        if (!fs.existsSync(file)) {
            console.error("kv文件不存在：", file);
            continue
        }
        if (single_excel_to_kv(file, uiInterface_path)) {
            successCount += 1
            KvAllInterface_s += "import { OBJ_0_1 as Import_OBJ_" + successCount + " } from ";
            KvAllInterface_s += file.replace(kv_path, "\".").replace(ext, "\" \n");
            if (KvAllInterface_s_1.length == 0) {
                KvAllInterface_s_1 += 'export interface KvAllInterface extends CustomUIConfig {\n'
            }
            KvAllInterface_s_1 += "\"" + k + "\": Import_OBJ_" + successCount + ',\n';
        }
        else {
            errorCount += 1;
        }
    }
    // KvAllInterface
    if (KvAllInterface_s_1 == "") { KvAllInterface_s_1 = "{" }
    KvAllInterface_s += KvAllInterface_s_1 + '}\n';
    if (!fs.existsSync(KvAllInterface_UI)) fs.mkdirSync(KvAllInterface_UI);
    fs.writeFileSync(KvAllInterface_UI, KvAllInterface_s);
    console.log('Parse kv->UIInterface finish,', ' success: ', successCount, ' fail: ', errorCount);
    //#endregion
    //#region 转 game接口文件
    successCount = 0
    errorCount = 0
    KvAllInterface_s = '';
    KvAllInterface_s_1 = '';

    let KvAllPath_s = '';
    let KvServer_Interf_s = '';
    let KvServer_s = '';
    let KvClient_Interf_s = '';
    let KvClient_s = '';
    for (let k in kvToInterface) {
        let file = npc_path + kvToInterface[k];
        let ext = path.extname(file);
        if (!(ext == '.txt' || ext == '.kv')) {
            console.log('kv js sync script ignore change of none kv file=>', file);
            return;
        }
        if (!fs.existsSync(file)) {
            console.error("kv文件不存在：", file);
            continue
        }
        if (single_excel_to_kv(file, interface_path)) {
            successCount += 1
            KvAllInterface_s += "import { OBJ_1_1 as Import_OBJ_" + successCount + " } from ";
            KvAllInterface_s += file.replace(kv_path, "\".").replace(ext, "\" \n");
            if (KvAllInterface_s_1.length == 0) {
                KvAllInterface_s_1 += 'export interface KvAllInterface  {\n'
            }
            KvAllInterface_s_1 += "\"" + k + "\": Import_OBJ_" + successCount + ',\n';
            if (KvAllPath_s.length == 0) {
                KvAllPath_s += 'export const KvAllPath = {\n';
            }
            KvAllPath_s += "\"" + k + "\": \"" + file.replace("game/", "") + '\",\n';
            // 服務器表列表
            if (KvServer_s.length == 0) {
                KvServer_s += 'export const KvServer = {\n';
            }
            if (KvServer_Interf_s.length == 0) {
                KvServer_Interf_s += 'export interface KvServerInterface   {\n';
            }
            if (kvInterface_server[k]) {
                KvServer_s += "\"" + k + "\": \"" + file.replace("game/", "") + '\",\n';
                KvServer_Interf_s += "\"" + k + "\": Import_OBJ_" + successCount + ',\n';
            }
            // 客戶端表列表
            if (KvClient_s.length == 0) {
                KvClient_s += 'export const KvClient = {\n';
            }
            if (KvClient_Interf_s.length == 0) {
                KvClient_Interf_s += 'export interface KvClientInterface   {\n';
            }
            if (kvInterface_client[k]) {
                KvClient_s += "\"" + k + "\": \"" + file.replace("game/", "") + '\",\n';
                KvClient_Interf_s += "\"" + k + "\": Import_OBJ_" + successCount + ',\n';
            }
        }
        else {
            errorCount += 1;
        }
    }
    // KvAllInterface
    KvAllInterface_s += KvAllInterface_s_1 + '}\n' + KvAllPath_s + '}\n';
    KvAllInterface_s += KvServer_Interf_s + '}\n' + KvServer_s + '}\n';
    KvAllInterface_s += KvClient_Interf_s + '}\n' + KvClient_s + '}\n';

    // KvAllPath

    if (!fs.existsSync(KvAllInterface_Game)) fs.mkdirSync(KvAllInterface_Game);
    fs.writeFileSync(KvAllInterface_Game, KvAllInterface_s);
    console.log('Parse kv->Game Interface finish,', ' success: ', successCount, ' fail: ', errorCount);
    //#endregion
};

(async () => {
    all_excel_to_kv();
    program.option('-w, --watch', 'Watch Mode').parse(process.argv);
    if (program.watch) {
        console.log('start with watch mode');
        chokidar.watch(kv_path).on('change', (file) => {
            single_excel_to_kv(file);
        });
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
