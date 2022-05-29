const fs = require("fs-extra");
const keyvalues = require("keyvalues-node");
const program = require("commander");
const chokidar = require("chokidar");
const path = require("path");
const xlsx = require("node-xlsx");
const { read_all_files, read_sub_directories } = require("./utils");

// 需要读取的excel路径
const excel_path = "excels/sounds";
const kv_path = "content/soundevents";
const ts_path = "game/scripts/tscripts/assert/Assert_SoundEvent.ts";

function single_excel_to_kv(file) {
    if ((path.extname(file) != ".xlsx" && path.extname(file) != ".xls") || file.indexOf("~$") >= 0) {
        console.log("excel 2 kv compiler ingore non-excel file=>", file);
        return;
    }
    let sheets = xlsx.parse(file);
    if (sheets.length < 2) {
        console.error("缺少参数表:", file);
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
        console.log("ignore empty file=>", file, "REQUIRES AT LEAST 3 LINES(comment, key data)");
        return;
    }
    let key_note = rows[0]; // 第一行 存字段说明
    let key_arg = rows[1];
    let keyindex = key_arg.indexOf("soundIndex");
    let obj = {};
    let ts_str = "";
    for (let i = 2; i < nrows; i++) {
        let _record = rows[i];
        ts_str += `export const ${_record[0]} = "${_record[keyindex]}" ;\n`;
        obj["" + _record[keyindex]] = {};
        for (let j = 1; j < key_arg.length; j++) {
            if (!_record[j]) {
                continue;
            }
            switch (key_arg[j]) {
                case "type":
                case "volume":
                case "pitch_rand_min":
                case "pitch_rand_max":
                case "pitch":
                case "soundlevel":
                case "distance_max":
                case "event_type":
                case "vsnd_duration":
                    obj["" + _record[keyindex]][key_arg[j]] = _record[j];
                    break;
                case "vsnd_files":
                    obj["" + _record[keyindex]]["vsnd_files"] = _record[j].split("\n");
                    break;
            }
        }
    }
    let fileName = path.parse(file).name;
    let _outFileext = ".vsndevts";
    let outpath = kv_path + "/" + fileName + _outFileext;
    if (!fs.existsSync(kv_path)) fs.mkdirSync(kv_path);
    let _ss = `<!-- kv3 encoding:text:version{e21c7f3c-8a33-41c5-9977-a76d3a32aa0d} format:generic:version{7412167c-06e9-4698-aff2-e63eb59037e7} -->`;
    let r_s = JSON.stringify(obj).replace(/:/g, "=");
    r_s=r_s.replace(/\.vsnd",/g, ".vsnd\"_").replace(/,/g, "\n").replace(/\.vsnd"_/g, ".vsnd\",")
     r_s = _ss + "\n" + r_s + "\n";
    // r_s = r_s.replace(/:/g, "=");
    fs.writeFileSync(outpath, r_s);
    let ts_ss = `
    export module Assert_SoundEvent {
        ${ts_str}
    }
    `;
    fs.writeFileSync(ts_path, ts_ss);

    console.log("success xlsx->kv", outpath);
}

async function all_excel_to_kv() {
    const files = read_all_files(excel_path);
    files.forEach((file) => {
        single_excel_to_kv(file);
    });
}

(async () => {
    var args = process.argv.splice(2);
    // 單個文件
    all_excel_to_kv();
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
