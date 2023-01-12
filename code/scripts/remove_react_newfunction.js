const fs = require("fs-extra");
const path = require("path");
const { read_all_files, read_sub_directories } = require('./utils');
const program = require('commander');
const chokidar = require('chokidar');


function fix_react(filepath) {
    if (path.extname(filepath) == ".js") {
        let source = fs.readFileSync(filepath, 'utf8');
        console.log(filepath)
        source = source.replace(/new Function\((\"|\')return this(\"|\')\)/g, "(()=>{return this})");
        fs.writeFileSync(filepath, source, 'utf8');
    }
}


(async () => {
    const dirpath = "content/panorama/layout";
    const files = read_all_files(dirpath);
    files.forEach((file) => {
        fix_react(file)
    });
    chokidar.watch(dirpath).on('change', (file) => {
        fix_react(file);
    });
    
})().catch((error) => {
    console.error(error);
    process.exit(1);
});