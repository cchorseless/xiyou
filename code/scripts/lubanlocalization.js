const fs = require('fs-extra');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const path = require('path');
const xlsx = require('node-xlsx');
const { read_all_files, read_sub_directories } = require('./utils');

// 需要读取的excel路径
const excel_path = 'E:/project/et_project/et6_onlyserver/Doc/ExcelConfig/Datas';


// 本地化语言
function createLanguageTXT(file) {
    if ((path.extname(file) != '.xlsx' && path.extname(file) != '.xls') || file.indexOf('~$') >= 0) {
        console.log('excel 2 kv compiler ingore non-excel file=>', file);
        return;
    }
    let sheets = xlsx.parse(file);
    let sheet = sheets[0];
    let rows = sheet.data;
    let typeindex = 0;
    for (let i = 0; i < 6; i++){
        if (rows[i]&&rows[i][0] == '##type' && rows[i + 1][0] == "##") {
            typeindex = i;
            break;
        }
    }
    if (typeindex == 0) { return }
    // 语言类型标识写在上一层
    let row_1 = rows[typeindex];
    let row_0 = rows[typeindex+1];
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
            let outfile = (`./${outpath[langestart.indexOf(k)]}/lubandoc/${path.basename(file).replace(path.extname(file),".txt" )}` );
            let f_str = '';
            for (let i = typeindex+2; i < rows.length; i++) {
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
                    if (_kk != null && _vv!=null) {
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


const all_lubanexcel_to_locatlization = async () => {
    const files = read_all_files(excel_path);
    files.forEach((file) => {
        createLanguageTXT(file);
    });
};

module.exports.all_lubanexcel_to_locatlization = all_lubanexcel_to_locatlization;
