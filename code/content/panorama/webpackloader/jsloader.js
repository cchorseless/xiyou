"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function removenewfunction(source) {
    const reg = /new Function\((\"|\')return this(\"|\')\)/g;
    source = source.replace(reg, "(()=>{return (globalThis)})");
    return source;
}
exports.default = removenewfunction;
