"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
async function tsCssLoader(source) {
    if (source.search(/import.*.less.*;/) != -1) {
        source = source.replace(/import.*.(less|sass|scss|css).*;/g, "");
    }
    return source;
}
exports.default = tsCssLoader;
