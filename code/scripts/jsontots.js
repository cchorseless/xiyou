const fs = require('fs-extra');
const path = require('path');
const {
  read_all_files,
  read_sub_directories
} = require('./utils');

const jsonpath = "content/scripts/tscripts/shared/Gen/json";
const outtspath = "content/scripts/tscripts/shared/Gen/JsonConfig.ts";
const typepath = "content/scripts/tscripts/shared/Gen/Types.ts";
const selfpath = "content/scripts/tscripts/shared/Gen";
const sourcegen = "E:/project/et_project/ET7/Doc/ExcelConfig/Gen"

function jsontots() {
  let typestr = fs.readFileSync(typepath, "utf-8");
  typestr = typestr.replace(/for\(var /g, "for(let ")
  typestr = typestr.replace(/throw new Error\(\)/g, "GLogHelper.error(1);")
  typestr = typestr.replace(/constructor\(_json_: any\) {\s+this._dataMap/g, "constructor(_json_: any[]) {\n this._dataMap ")
  typestr = typestr.replace(/constructor\(_json_: any\) {\s+if \(_json_.length/g, "constructor(_json_: any[]) {\n if (_json_.length ")
  typestr = typestr.replace(/let _entry_ of _json_\.\S*\)/g, (s) => {
    let cc = s.substring(0, s.length - 1) + " as any[][])";
    return cc;
  })

  let consTr = typestr.match(/constructor\(loader: JsonLoader\) {[^}]*}/g)[0];
  let lines = consTr.split("\n");
  let addstr = "reloadConfig(k: string , loader: JsonLoader) {\n switch(k) { \n";
  for (let line of lines) {
    if (line.indexOf("(loader(") > -1) {
      let loadstr = line.match(/loader\([^\)]*\)/)[0];
      loadstr = loadstr.replace("loader", "case ");
      addstr += loadstr + ":\n";
      addstr += line + ";break;\n";
    }
  }
  addstr += "}\n};\n"
  typestr = typestr.replace(consTr, consTr + "\n" + addstr);

  fs.writeFileSync(typepath, typestr);
  let filestr = "";
  const files = read_all_files(jsonpath);
  files.forEach((file) => {
    let fileName = path.parse(file).name;
    let str = fs.readFileSync(file, "utf-8");
    filestr += `"${fileName}":${str} ,\n`;
  });
  filestr = `
    import { Tables } from "./Types";
    const JSONData : {[k:string]:any[]} = { ${filestr} };
    function JsonDataLoader(filename:string){
      const d = JSONData[filename];
      delete JSONData[filename];
      return d;
    };
    export function RefreshConfig(data: { [k: string]: any }|null = null) {
      if ( _G.GJSONConfig&&data) {
      for (let k in data) {
        JSONData[k] = data[k];
      _G.GJSONConfig.reloadConfig(k, JsonDataLoader);
      }
      return;
    }
      let tabledata: Tables = null as any;
      try {
        tabledata = new Tables(JsonDataLoader);
      }
      catch (error) {
        GLogHelper.error(error)
      }
      _G.GJSONConfig = tabledata;
    };
    declare global {
      var GJSONConfig: Readonly<Tables>;
    }
    `;
  fs.writeFileSync(outtspath, filestr);

}

(async () => {
  fs.copySync(sourcegen, selfpath, { overwrite: true });
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
