const fs = require('fs-extra');
const path = require('path');
const {
    read_all_files,
    read_sub_directories
} = require('./utils');

const jsonpath = "game/scripts/tscripts/shared/Gen/json";
const outtspath = "game/scripts/tscripts/shared/Gen/JsonConfig.ts";

function jsontots() {
    let filestr = "";
    const files = read_all_files(jsonpath);
    files.forEach((file) => {
        let fileName = path.parse(file).name;
        let str = fs.readFileSync(file, "utf-8");
        filestr += `"${fileName}":${str} ,\n`;
    });
    filestr = `
    import { Tables } from "./Types";
    const JSONData : any = { ${filestr} };
    function JsonDataLoader(filename:string){
        return JSONData[filename];
    };
    export const JSONConfig: Tables = new Tables(JsonDataLoader);
    `;
    fs.writeFileSync(outtspath, filestr)
}

(async () => {
    // var args = process.argv.splice(2);
    // readDATA();
    // createNpc()
    jsontots()
    // createItem()
    // createSound();
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
