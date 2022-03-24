// 编译地图用
const { execFile } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const { getAddonName, getDotaPath } = require('./utils');

(async () => {
    const dotaPath = await getDotaPath();
    const win64 = path.join(dotaPath, 'game', 'bin', 'win64');
    const exePath = path.join(win64, "resourcecompiler.exe")
    let addon_name = getAddonName();
    let map_name;
    let argv = process.argv;
    for (let i in argv) {
        let mm = argv[i];
        let cm = argv[Number(i) + 1];
        if (mm == '--m') map_name = cm;
        if (mm == '--a') addon_name = cm;
    }
    if (addon_name == getAddonName() && map_name == null) { console.error('you can use launch options\n--m map_name \n--a addon'); return; }
    // "C:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\bin\win64\resourcecompiler.exe" -fshallow -maxtextureres 256 -dxlevel 110 -quiet -html -unbufferedio -noassert -i "c:/program files (x86)/steam/steamapps/common/dota 2 beta/content/dota_addons/project6/maps/td.vmap"  -world -phys -vis -gridnav -breakpad  -nompi  -nop4 -outroot "C:\Users\15100\AppData\Local\Temp\valve\hammermapbuild\game"
    const mapPath = path.join(dotaPath, 'content', 'dota_addons', addon_name, "maps", map_name + ".vmap")
    /**临时文件夹 */
    const outtemproot = path.join(os.tmpdir(), 'valve', 'hammermapbuild', "game")
    /**临时文件 */
    const outFilePath = path.join(outtemproot, "dota_addons", addon_name, "maps", map_name + '.vpk');
    const outroot = path.join(dotaPath, 'game', 'dota_addons', addon_name, "maps")
    const outFileroot = path.join(outroot, map_name + '.vpk')
    const args = ['-fshallow', '-maxtextureres 256', '-dxlevel 110', "-quiet", "-html", "-unbufferedio", "-noassert", '-i', mapPath, "-world", "-phys", "-vis", "-gridnav", "-breakpad", "-nompi", "-nop4", "-outroot", outtemproot];
    console.log('exePath =>', exePath);
    console.log('outroot =>', outtemproot);
    console.log('begin to BUILD MAP =>', mapPath);
    console.log('=============================编译过程中，请稍等========================================');
    execFile(exePath, args, { detached: true, cwd: win64 }, (error, stdout, stderr) => {
        if (error) { console.error(error); return; }
        // console.log(stdout);
        console.error(stderr);
        // 复制地图
        if (fs.existsSync(outFilePath)) {
            if (!fs.existsSync(outroot)) fs.mkdirSync(outroot);
            fs.copyFileSync(outFilePath, outFileroot)
            console.log(`==============project：${addon_name} |map_name：${map_name} 编译成功================================`);
        }
        else {
            console.log(`==============project：${addon_name} |map_name：${map_name} 编译失败================================`);
        }
    });
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
