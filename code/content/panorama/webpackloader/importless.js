const path = require('path');
const fs_1 = require('fs');


let _importList_ = [];
async function importless(source, b, c) {
    let lessList = {};
    let tsx = source.match(/<include src="(.*tsx)".*\/>/g);
    if (!tsx) {
        return source
    };
    _importList_ = [];
    tsx = tsx.map((context) => {
        return context.replace(/<include src="(.*tsx)".*\/>/g, "$1");
    }).map((context) => {
        lessList = {
            ...lessList,
            ...resolveImport(this.context, path.resolve(this.context, context))
        };
    });
    let includes = "";
    let includeList = [];
    for (const lessPath in lessList) {
        if (includeList.includes(lessPath)) { continue }
        includeList.push(lessPath);
        let importPath = path.relative(this.context, lessPath);
        console.log("less auto import =>", importPath);
        if (importPath[0] != ".") {
            importPath = "./" + importPath;
        }
        includes += `\n\t\t<include src=\"${importPath.replace(/\\/g, "/")}\"/>`;
    }
    if (tsx && includes != "") {
        source = source.replace(/(.*<\/styles>)/, includes + "\n$1");
    }
    if (source.search(/import.*.less.*;/) != -1) {
        source = source.replace(/import.*.(less|sass|scss|css).*;/g, "");
    }
    return source;
}

function resolveImport(layoutPath, importPath) {
    let list = {};
    const content = fs_1.readFileSync(importPath, "utf-8");
    let importList = content.match(/import.*('|")(\.\.\/.*|\.\/.*)('|");/g);
    if (importList) {
        importList = importList.map((relativePath) => {
            return relativePath.replace(/import.*('|")(\.\.\/.*|\.\/.*)('|");/g, "$2");
        }).map((relativePath) => {
            return path.resolve(layoutPath, relativePath);
        });
    }
    if (importList) {
        importList.forEach(element => {
            // 防止死循环
            if (_importList_.includes(element)) {
                return;
            }
            _importList_.push(element);
            if (element.search(/.*.less/) != -1) {
                list[element] = true;
            } else {
                let exists = fs_1.existsSync(element + ".tsx");
                if (exists) {
                    list = Object.assign(list, resolveImport(path.dirname(element + ".tsx"), element + ".tsx"));
                }
            }
        });
    }
    return list;
}
exports.default = importless;
