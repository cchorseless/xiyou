const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');
const { getAddonName, getDotaPath } = require('./utils');

(async () => {
    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log('No Dota 2 installation found. Addon linking is skipped.');
        return;
    }
    for (const directoryName of ['game', 'content']) {
        const sourcePath = path.resolve(__dirname, '..', directoryName);
        assert(fs.existsSync(sourcePath), `Could not find '${sourcePath}'`);
        const targetRoot = path.join(dotaPath, directoryName, 'dota_addons');
        assert(fs.existsSync(targetRoot), `Could not find '${targetRoot}'`);
        const targetPath = path.join(dotaPath, directoryName, 'dota_addons', getAddonName());
        const isSymbolicLink = fs.lstatSync(sourcePath).isSymbolicLink();
        console.log('sourcePath=>', sourcePath);
        console.log('targetPath=>', targetPath);
        if (fs.existsSync(targetPath)) {
            if (isSymbolicLink) {
                const realpath = fs.realpathSync(sourcePath);
                const isCorrect = realpath.substring(targetRoot.length) == targetPath.substring(targetRoot.length)
                if (isCorrect) {
                    console.log(`Skipping '${sourcePath}' since it is already linked`);
                    continue;
                }
            }
            console.error(`'${getAddonName()}' is already exist,please rename project name`);
            // 移除目标文件夹的所有内容，
            // fs.chmodSync(targetPath, '0755');
            // await rimraf(targetPath, () => {
            //     console.log('removed target path');
            //     fs.copySync(sourcePath, targetPath);
            //     fs.symlinkSync(targetPath, sourcePath, 'junction');
            //     console.log(`Linked ${sourcePath} <==> ${targetPath}`);
            // });
        }
        else {
            if (isSymbolicLink) {
                const realpath = fs.realpathSync(sourcePath);
                console.log(`copySync ${realpath} <==> ${targetPath} ~~~`);
                fs.copySync(realpath, targetPath);
            }
            else {
                fs.moveSync(sourcePath, targetPath);
            }
            fs.symlinkSync(targetPath, sourcePath, 'junction');
            console.log(`Linked ${sourcePath} <==> ${targetPath}`);
        }
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
