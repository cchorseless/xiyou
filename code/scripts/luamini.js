const fs = require("fs-extra");
const path = require('path');
const luamin = require('luamin');
const {
    read_all_files,
    read_sub_directories
} = require("./utils");
const lua_path = 'game/scripts/vscripts';


(async () => {
    const luafiles = read_all_files(lua_path);
    luafiles.forEach((file) => {
        if (file.indexOf('.lua') > -1) {
            let luaCode = fs.readFileSync(file, 'utf8');
            // let ast = luamin.luaparse.parse(luaCode, { 'scope': true });
            luaCode = luamin.minify(luaCode); // 'a=(1+2-3)*4/5^6';
            fs.writeFileSync(file, luaCode);
            console.log(`Minified ${file}`);
        }
    });

})().catch((error) => {
    console.error(error);
    process.exit(1);
});