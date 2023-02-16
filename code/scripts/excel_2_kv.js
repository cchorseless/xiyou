const fs = require('fs-extra');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const path = require('path');
const xlsx = require('node-xlsx');
const { read_all_files, read_sub_directories } = require('./utils');

// 需要读取的excel路径
const excel_path = 'excels';
const kv_path = 'game/scripts/npc';
/**转出TXT的文件列表 */
const toTxtFileArray = [
    /**英雄列表 */
    'herolist',
    /**技能总表 */
    "npc_abilities_custom",
    /**技能覆盖 */
    "npc_abilities_override",
    /**英雄列表 */
    "npc_heroes_custom",
    /**道具列表 */
    "npc_items_custom",
    /**单位表 */
    "npc_units_custom",]


/**
 * 解析参数表数据结构
 */
function parse_paramSheet(file, sheet_data, sheet_param) {
    let key_note = sheet_param.data[0];// 第一行 存字段说明
    let key_arg = sheet_param.data[1];
    let key_type = sheet_param.data[2];
    let key_parent = sheet_param.data[3];
    let data_note = sheet_data.data[0];
    let data_arg = sheet_data.data[1];
    let typeObj = [];
    let len = key_arg.length;
    let lendata = data_arg.length;
    for (let i = 1; i < len; i++) {
        let _obj = {};
        if (key_arg[i] == null || key_parent[i] == null || key_type[i] == null) {
            continue
        }
        _obj.note = key_note[i];
        _obj.arg = key_arg[i].replace(" ", "");
        _obj.parent = key_parent[i].replace(" ", "");
        _obj.type = key_type[i].replace(" ", "");
        let [isk, ktype] = typeIsK(file, _obj.type);
        _obj.ktype = ktype;
        if (isk) {
            _obj._childs = [];
        }
        for (let j = 0; j < lendata; j++) {
            if (_obj.note == data_note[j] && _obj.arg == data_arg[j]) {
                _obj.col = j;
                break
            }
        }
        typeObj.push(_obj);
        if (_obj.col == null && _obj.parent != 'root') {
            console.warn('请注意：' + file + "中，字段: " + _obj.arg + '无对应数据列。')
        }
    }
    // 找到子节点
    for (let obj of typeObj) {
        if (obj._childs != null) {
            for (let _obj of typeObj) {
                if (_obj.parent == obj.arg) {
                    obj._childs.push(_obj)
                }
            }
            // 没有子节点 就有V对应
            if (obj._childs.length == 0) {
                let vtype = obj.type.replace('K+', 'V+').replace('K&', 'V&');
                for (let _obj2 of typeObj) {
                    if (_obj2.parent == obj.parent && _obj2.arg == obj.arg && _obj2.type == vtype) {
                        // 对应VALUE
                        obj.vobj = _obj2;
                        break
                    }
                }

            }
        }
    }
    return typeObj
}

/**
 * 处理#base
 * @param {} file
 * @param {*} sheet_data
 * @param {*} sheet_param
 */
function parse_paramSheetBaseData(sheet_param) {
    let r = ""
    if (sheet_param.data.length >= 6 && sheet_param.data[4] == '#base') {
        for (let i = 5; i < sheet_param.data.length; i++) {
            let v = sheet_param.data[i][0]
            if (v && ((v + "").endsWith('.kv') || (v + "").endsWith('.txt'))) {
                r += "#base  \"" + v + "\"\n"
            }
        }
    }
    return r

}


// 判断是不是K
function typeIsK(file, s) {
    let kArray = s.split('>');
    for (let k of kArray) {
        if (k == 'K' || k == "K+" || k == "K&") {
            return [true, k];
        }
        else if (k == 'V' || k == "V+" || k == "V&") {
            return [false, k];
        }
    }
    throw Error(file + ' 字段： ' + s + ' no have K OR V')
}

function findFirstRowDataBeginAt(file, sheet_data, startRow, endRow, col) {
    if (col == null) { return }
    let data = sheet_data.data;
    for (let i = startRow; i < endRow; i++) {
        if (data[i][col] != null) {
            return (data[i][col] + "").replace(/\\/g, '/')
        }
    }
    // throw Error("No Value: " + file + ' rowRange<' + startRow + "," + endRow + '> col=' + col);
}

function dealChild(file, sheet_data, needParse, obj, parentObj, startRow, endRow) {
    for (let objChild of obj._childs) {
        // console.log("dealChild", objChild);
        let kArray = objChild.type.split('>');
        let len_karray = kArray.length
        // return
        if (objChild._childs != null) {
            // true K
            if (objChild.ktype == "K") {
                parentObj[objChild.arg] = {};
                needParse.push({
                    obj: objChild,
                    parentObj: parentObj[objChild.arg],
                    startRow: startRow,
                    endRow: endRow
                });
            }
            // K+ 从数据表中找K
            else if (objChild.ktype == "K+") {
                // 考虑  01>K+ 的情况 确保有K值
                let _parentObj = parentObj;
                if (len_karray > 1) {
                    for (let i = startRow; i < endRow; i++) {
                        let trueKey = sheet_data.data[i][objChild.col];
                        if (trueKey != null) {
                            parentObj[objChild.arg] = parentObj[objChild.arg] || {};
                            _parentObj = parentObj[objChild.arg];
                            for (let _k = 0; _k < len_karray; _k++) {
                                let _kk = kArray[_k];
                                if (_k < len_karray - 1) {
                                    _parentObj[_kk] = {};
                                    _parentObj = _parentObj[_kk];
                                }
                            }
                            break;
                        }
                    }
                }
                for (let i = startRow; i < endRow; i++) {
                    let trueKey = sheet_data.data[i][objChild.col];
                    if (trueKey != null) {
                        let _endRow = endRow;
                        for (let j = i + 1; j < endRow; j++) {
                            let nextTrueKey = sheet_data.data[j][objChild.col];
                            // 下一个不等于上一个,找到下一个了
                            if (nextTrueKey != null && nextTrueKey != trueKey) {
                                _endRow = j;
                                break;
                            }
                        }
                        let vobj = objChild.vobj;
                        if (vobj) {
                            if (sheet_data.data[i][vobj.col]) {
                                _parentObj[trueKey] = '' + sheet_data.data[i][vobj.col];
                            }
                        }
                        else if (objChild._childs.length > 0) {
                            _parentObj[trueKey] = {};
                            needParse.push({
                                obj: objChild,
                                parentObj: _parentObj[trueKey],
                                startRow: i,
                                endRow: _endRow
                            });
                        }
                        // 找V+
                        i = _endRow - 1;
                    }
                }
            }
            else if (objChild.ktype == "K&") {
                // 考虑  01>K+ 的情况 确保有K值
                let _parentObj = parentObj;
                if (len_karray > 0) {
                    for (let i = startRow; i < endRow; i++) {
                        let trueKey = sheet_data.data[i][objChild.col];
                        if (trueKey != null) {
                            parentObj[objChild.arg] = parentObj[objChild.arg] || {};
                            _parentObj = parentObj[objChild.arg];
                            for (let _k = 0; _k < len_karray; _k++) {
                                let _kk = kArray[_k];
                                if (_k < len_karray - 1) {
                                    _parentObj[_kk] = {};
                                    _parentObj = _parentObj[_kk];
                                }
                            }
                            break;
                        }
                    }
                };
                let trueKey = sheet_data.data[startRow][objChild.col];
                let truevalue;
                let vobj = objChild.vobj;
                if (vobj) {
                    truevalue = '' + sheet_data.data[startRow][vobj.col];;
                }
                if (trueKey != null && truevalue != null) {
                    let trueKeyList = trueKey.split('\n');
                    let trueValueList = truevalue.split('\n');
                    while (trueKeyList.length > 0) {
                        let tmp_trueKey = trueKeyList.shift();
                        if (tmp_trueKey && tmp_trueKey.length > 0) {
                            _parentObj[tmp_trueKey] = '' + trueValueList.shift();
                        }
                    }
                }
            }
        }
        else {
            if (objChild.ktype == 'V') {
                let value = findFirstRowDataBeginAt(file, sheet_data, startRow, endRow, objChild.col);
                if (value == null) {
                    continue
                }
                if (len_karray == 1) {
                    parentObj[objChild.arg] = value;
                }
                else {
                    parentObj[objChild.arg] = parentObj[objChild.arg] || {};
                    let _parentObj = parentObj[objChild.arg];
                    for (let _k = 0; _k < len_karray; _k++) {
                        let _kk = kArray[_k];
                        if (_k < len_karray - 2) {
                            _parentObj[_kk] = {};
                            _parentObj = _parentObj[_kk];
                        }
                        else if (_k == len_karray - 2) {
                            // 有值才添加
                            _parentObj[_kk] = value;
                            break
                        }
                    }
                }

            }

        }
    }
}


/**
 * 解析数据表
 * @param {*} file
 * @param {*} sheet_data
 * @param {*} typeObj
 */
function parse_dataSheet(file, sheet_data, typeObj) {
    let result = {};
    let needParse = [];
    let maxSheetRow = sheet_data.data.length;
    for (let obj of typeObj) {
        // 根节点
        if (obj.parent == "root") {
            let _isK = obj._childs != null;
            if (_isK) {
                result[obj.arg] = {};
                needParse.push({
                    obj: obj,
                    parentObj: result[obj.arg],
                    startRow: 2,
                    endRow: maxSheetRow
                });
            }
            else {
                // 有值才添加
                let value = findFirstRowDataBeginAt(file, sheet_data, 2, maxSheetRow, obj.col);
                if (value != null) {
                    result[obj.arg] = value;
                }
            }
        }
    }
    // return result;
    while (needParse.length > 0) {
        let parentInfo = needParse.shift();
        let obj = parentInfo.obj;
        let parentObj = parentInfo.parentObj;
        let startRow = parentInfo.startRow;
        let endRow = parentInfo.endRow;
        dealChild(file, sheet_data, needParse, obj, parentObj, startRow, endRow);
    }
    return result;
}

// 本地化语言
function createLanguageTXT(file, rows) {
    let row_0 = rows[0];
    let row_1 = rows[1];
    let langestart = ['schinese', 'english', 'russian'];
    let outpath = [
        'localization/SChinese',
        'localization/English',
        'localization/Russian',
    ]
    let result_txt_obj = {};
    for (let k of langestart) {
        result_txt_obj[k] = {
            temp_param: [],
            temp_value: []
        }
    }
    for (let i = 0; i < row_1.length; i++) {
        if (row_1[i] == null) { continue; }
        k = row_1[i].toLowerCase().replace(/ /g, '');
        if (langestart.indexOf(k) > -1) {
            let param_str = row_0[i].replace(/ /g, '');;
            if (param_str.indexOf('{') > -1 && param_str.indexOf('}') > -1) {
                let temp1 = param_str.split('{');
                let temp_str = [];
                temp1.forEach((s) => {
                    if (s.indexOf('}') > -1) {
                        let temp2 = s.split('}');
                        let indexKey = row_0.indexOf(temp2[0])
                        if (indexKey > -1) {
                            temp_str.push(indexKey)
                        }
                        temp_str.push(temp2[1])
                    }
                    else {
                        temp_str.push(s)
                    }
                });
                result_txt_obj[k].temp_param.push(temp_str)
                result_txt_obj[k].temp_value.push([i])
            }
        }

    };
    for (let k in result_txt_obj) {
        let _param = result_txt_obj[k].temp_param
        if (_param.length > 0) {
            let outfile = file.replace('excels', '' + outpath[langestart.indexOf(k)]).replace(path.extname(file), '.txt');
            let f_str = '';
            for (let i = 2; i < rows.length; i++) {
                for (let jj = 0; jj < _param.length; jj++) {
                    let __arr = _param[jj]
                    let _kk = ''
                    for (let __k of __arr) {
                        if (typeof __k == 'string') {
                            _kk += __k
                        }
                        else if (typeof __k == 'number') {
                            if (rows[i][__k] != null) {
                                _kk += rows[i][__k]
                            }
                            else {
                                _kk = null
                                break;
                            }
                        }
                    }
                    let _vv=rows[i][result_txt_obj[k].temp_value[jj]]
                    if (_kk != null&&_vv != null)  {
                        f_str += `"${_kk}"`;
                        f_str += "       ";
                        f_str += `"${_vv}"`;
                        f_str += "\n";
                    }

                }
            };
            let _outfile_ = outfile.split('/');
            let dirpath = '';
            while (_outfile_.length > 1) {
                dirpath += _outfile_.shift() + '/';
                if (!fs.existsSync(dirpath)) {
                    fs.mkdirSync(dirpath)
                }
            }
            fs.writeFileSync(outfile, f_str);
            console.log(outfile + '  ' + k + ' language finish ')
        }
    }

}


function single_excel_to_kv(file) {
    if ((path.extname(file) != '.xlsx' && path.extname(file) != '.xls') || file.indexOf('~$') >= 0) {
        console.log('excel 2 kv compiler ingore non-excel file=>', file);
        return;
    }
    let sheets = xlsx.parse(file);
    if (sheets.length < 2) {
        console.error("缺少参数表:", file)
        return;
    }
    let sheet = sheets[0];
    let sheet_param = sheets[1];
    if (sheet_param.name != "param") {
        console.error("第二张表格须命名为 param ，以供辨识:", file);
        return;
    }
    let rows = sheet.data;
    let nrows = rows.length;
    if (nrows < 3) {
        console.log('ignore empty file=>', file, 'REQUIRES AT LEAST 3 LINES(comment, key data)');
        return;
    }

    let rows_param = sheet_param.data;
    let nrows_param = rows_param.length;
    if (nrows_param < 3) {
        console.log('无参数表数据', file, '参数表 AT LEAST 3 LINES(comment, key data)');
        return;
    }

    let typeObj = parse_paramSheet(file, sheet, sheet_param);
    // console.log(typeObj)
    let result = parse_dataSheet(file, sheet, typeObj)
    // console.log(result)
    // return
    if (Object.keys(result).length <= 0) {
        console.error("fail xlsx->kv生成失败：" + file + '输出为空KV，已跳过')
        return;
    }
    // 有些文件一定要TXT扩展
    let fileName = path.parse(file).name;
    let _outFileext = '.kv';
    if (toTxtFileArray.indexOf(fileName) > -1) {
        _outFileext = '.txt'
    }
    let outpath = file.replace(excel_path, kv_path).replace('.xlsx', _outFileext);
    let parent_i = outpath.lastIndexOf('/');
    let out_dir = outpath.substr(0, parent_i);
    if (!fs.existsSync(out_dir)) fs.mkdirSync(out_dir);
    let r_s = "// generate with  kv generator \n\n" + parse_paramSheetBaseData(sheet_param);
    r_s += keyvalues.encode(result).replace(/\\\"/g, "'");
    fs.writeFileSync(outpath, r_s);
    console.log('success xlsx->kv', outpath);
    createLanguageTXT(file, rows)
}


function single_excel_to_locatlization(file) {
    if ((path.extname(file) != '.xlsx' && path.extname(file) != '.xls') || file.indexOf('~$') >= 0) {
        console.log('excel 2 kv compiler ingore non-excel file=>', file);
        return;
    }
    let sheets = xlsx.parse(file);
    if (sheets.length < 2) {
        console.error("缺少参数表:", file)
        return;
    }
    let sheet = sheets[0];
    let sheet_param = sheets[1];
    if (sheet_param.name != "param") {
        console.error("第二张表格须命名为 param ，以供辨识:", file);
        return;
    }
    let rows = sheet.data;
    createLanguageTXT(file, rows)
}


const select_excel_to_kv = async (fileNames) => {
    const files = read_all_files(excel_path);
    files.forEach((file) => {
        let fileName = path.parse(file).name;
        // console.log(fileName);
        if (fileNames.indexOf(fileName) > -1) {
            single_excel_to_kv(file);
        }
    });
};

const all_excel_to_kv = async (path) => {
    const files = read_all_files(excel_path);
    files.forEach((file) => {
        single_excel_to_kv(file);
    });
};

const all_excel_to_locatlization = async (path) => {
    const files = read_all_files(excel_path);
    files.forEach((file) => {
        single_excel_to_locatlization(file);
    });
};

module.exports.all_excel_to_locatlization = all_excel_to_locatlization;


(async () => {
    var args = process.argv.splice(2)
    // 單個文件
    if (args.length > 0 && args.indexOf('--watch') == -1) {
        select_excel_to_kv(args);
    }
    else {
        all_excel_to_kv();
    }
    program.option('-w, --watch', 'Watch Mode').parse(process.argv);
    if (args.indexOf('--watch') > -1) {
        console.log('start with watch mode');
        chokidar.watch(excel_path).on('change', (file) => {
            single_excel_to_kv(file);
        });
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
