const fs = require('fs-extra');
const xlsx = require('node-xlsx');
const excelpath = "./scripts/excel/excel_line_change.xlsx";

function excel_line_change() {
    let sheets = xlsx.parse(excelpath);
    if (sheets.length < 2) {
        console.error("缺少参数表:", file)
        return;
    }
    let sheet = sheets[0];
    let sheet_param = sheets[1];

    let rows = sheet.data;
    let rows_param = sheet_param.data;
    const rowszhuanzhi = [];
    for (let i = 0; i < rows[0].length; i++) {
        rowszhuanzhi.push([])
        for (let j = 0; j < rows.length; j++) {
            rowszhuanzhi[i].push(rows[j][i]);
        }
    }
    const rowsline = rows[1];
    const rows_paramline = rows_param[1];
    const newdata = [];
    // newdata.length = 0;
    const adddataindex = []
    for (let i = 0; i < rows_paramline.length; i++) {
        let key = rows_paramline[i];
        let index = rowsline.indexOf(key);
        if (index == -1) {
            newdata.push([])
        }
        else {
            newdata.push(rowszhuanzhi[index] || [])
            adddataindex.push(index);
        }
    }
    newdata.push([111])
    for (let i = 0; i < rowsline.length; i++) {
        if (!adddataindex.includes(i)) {
            newdata.push(rowszhuanzhi[i] || [])
        }
    }
    // for (let v of newdata) {
    //     rows_param.push(v)
    // }

    const newrowszhuanzhi = [];
    for (let i = 0; i < newdata[0].length; i++) {
        newrowszhuanzhi.push([])
        for (let j = 0; j < newdata.length; j++) {
            newrowszhuanzhi[i].push(newdata[j][i]);
        }
    }
    sheets = [sheet, sheet_param];
    sheets.push({ name: "sheetoutdata", data: newrowszhuanzhi });
    fs.writeFileSync(excelpath, xlsx.build(sheets));
};


(async () => {
    var args = process.argv.splice(2)
    excel_line_change();


})().catch((error) => {
    console.error(error);
    process.exit(1);
});