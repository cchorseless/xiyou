"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function tsCssLoader(source) {
    if (source.search(/import.*.less.*;/) != -1) {
        source = source.replace(/import.*.(less|sass|scss|css).*;/g, "");
    }
    let luastart = source.search(/#region LUA/);
    let luaend = source.search(/#endregion LUA/);
    while (luastart != -1 && luaend != -1) {
        source = source.substring(0, luastart) + source.substring(luaend + 14);
        luastart = source.search(/#region LUA/);
        luaend = source.search(/#endregion LUA/);
    }
    return source;
}
exports.default = tsCssLoader;
