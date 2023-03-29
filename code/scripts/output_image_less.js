const fs = require("fs-extra");
const path = require("path");

const imagePath = "content/panorama/images";
const outPath = "content/panorama/src/view/allres_image";
const allres_imagepath = "content/panorama/src/view/res_image.less";

let filecount = 0;
let allfileimport = "";
const picEndList = ['.png', '.jpg', '.jpeg', 'psd', '.bmp', '.tif', '.gif', '.tga', '.svg'];

const read_all_files = (respath) => {
    var pa = fs.readdirSync(respath);
    var filetxt = ""
    pa.forEach((ele) => {
        let child = respath + '/' + ele;
        let info = fs.statSync(child);
        if (info.isDirectory()) {
            let outdirpath = child.replace(imagePath, outPath);
            if (!fs.existsSync(outdirpath)) {
                fs.mkdirSync(outdirpath)
            }
            read_all_files(child);
        } else {
            let ext = path.extname(child);
            if (picEndList.indexOf(ext) == -1) {
                return;
            }
            let tepm_str = `url("file://{images}${child.replace(imagePath, "")}")`;
            filetxt += `.Res_image_${filecount} { background-image:${tepm_str};}\n`;
            filecount++;
        }
    });
    let dirname = respath.substring(respath.lastIndexOf('/') + 1);
    let _outpath = respath.replace(imagePath, outPath)
    let singlefilepath = path.resolve(_outpath, `${dirname}.less`);
    if (filetxt.length > 0) {
        fs.writeFileSync(singlefilepath, filetxt);
        let ss = `@import ".${(_outpath + `/${dirname}.less`).replace(outPath, '/allres_image')}";\n`
        allfileimport += ss;
    }
};



async function output_image_less() {
    filecount = 0;
    allfileimport = "";
    fs.removeSync(outPath);
    if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath)
    }
    // 遍历文件
    read_all_files(imagePath);
    console.log(allfileimport)
    fs.writeFileSync(allres_imagepath, allfileimport);

}



(async () => {

    await output_image_less();

})().catch((error) => {
    console.error(error);
    process.exit(1);
});