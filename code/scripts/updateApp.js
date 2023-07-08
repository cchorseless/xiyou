const fs = require("fs-extra");
const keyvalues = require('keyvalues-node');
const { getAddonName, getDotaPath } = require('./utils');
(async () => {
    const dotaPath = await getDotaPath();
    const steamappPath = dotaPath.replace('\\common\\dota 2 beta', '').replace('/common/dota 2 beta', '')
    const appworkshop_570 = steamappPath + '\\workshop\\appworkshop_570.acf';
    let argv = process.argv;
    const appid = argv[2];
    if (appid == null) {
        throw new Error('no appid')
    }
    const apppath = steamappPath + '\\workshop\\content\\570\\' + appid;
    if (!fs.existsSync(appworkshop_570)) { return }
    let cfg = keyvalues.decode(fs.readFileSync(appworkshop_570, 'utf-8'))
    if (cfg) {
        let _installinfo = cfg.AppWorkshop.WorkshopItemsInstalled;
        if (_installinfo) {
            console.log(_installinfo[appid])
            // let size = cfg.AppWorkshop.SizeOnDisk;
            // cfg.AppWorkshop.SizeOnDisk = '' + (Number(size) - Number(_installinfo[appid].size))
            delete _installinfo[appid]

        }
        // let _ItemDetails = cfg.AppWorkshop.WorkshopItemDetails;
        // if (_ItemDetails) {
        //     console.log(_ItemDetails[appid])
        //     delete _ItemDetails[appid]
        // }
        // fs.writeFileSync(appworkshop_570, keyvalues.encode(cfg))
    }
    if (fs.existsSync(apppath)) {
        fs.removeSync(apppath)
    }
    console.log("update app finish")
})().catch((error) => {
    console.error(error);
    process.exit(1);
});