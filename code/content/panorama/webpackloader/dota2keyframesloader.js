"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
async function dota2KeyframesLoader(source) {
    source = source.replace(/@keyframes\s*(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, name) => {
        return match.replace(name, `'${name}'`);
    });
    return source;
}
exports.default = dota2KeyframesLoader;
