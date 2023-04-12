const fs = require("fs-extra");
const keyvalues = require("keyvalues-node");
const program = require("commander");
const chokidar = require("chokidar");
const path = require("path");
const xlsx = require("node-xlsx");
const old_npc_path = "game/scripts/dota2_old_npc_heroes.txt";
const old_ability_path = "game/scripts/dota2_old_npc_abilities.txt";
const old_item_path = "game/scripts/dota2_old_npc_items.txt";
const old_shipin_path = "game/scripts/dota2_shipin_all.txt";
const old_sound_path = "game/scripts/custom_sounds.txt";

const old_npc_out_path = "excels/dota/dota_units.xlsx";
const old_ability_out_path = "excels/dota/dota_abilities.xlsx";
const old_item_out_path = "excels/dota/dota_items.xlsx";
const old_shipin_out_path = "excels/dota/dota_shipin.xlsx";
const old_sound_out_path = "excels/sounds/custom_sounds.xlsx";
const old_unit_path = "game/scripts/dota2_old_npc_units.txt";

let shiPinData = null;
const ability_name_new_old = {};

function readDATA() {
    const _str_start = "npc_dota_hero_";
    const excludehero = ["npc_dota_hero_base"];
    let kv_s = fs.readFileSync(old_npc_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAHeroes;
    for (let k in info) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let npcinfo = info[k];
            for (let npc_key in npcinfo) {
                let value = npcinfo[npc_key];
                switch (npc_key) {
                    case "Ability1":
                    case "Ability2":
                    case "Ability3":
                    case "Ability4":
                    case "Ability5":
                    case "Ability6":
                    case "Ability7":
                    case "Ability8":
                    case "Ability9":
                    case "Ability10":
                    case "Ability11":
                    case "Ability12":
                    case "Ability13":
                    case "Ability14":
                    case "Ability15":
                    case "Ability16":
                    case "Ability17":
                        if (value != "generic_hidden") {
                            let abilityname = npc_key.toLowerCase() + "_" + value;
                            ability_name_new_old[value] = abilityname;
                        }
                        break;
                }
            }
        }
    }
    // 饰品数据

    let _shipinobj = keyvalues.decode(fs.readFileSync(old_shipin_path, "utf8"));
    shiPinData = {};
    let shipininfo = _shipinobj.items_game.items
    for (let k in shipininfo) {
        let _shipininfo = shipininfo[k];
        let used_by_heroes = _shipininfo.used_by_heroes;
        if (used_by_heroes == null) {
            continue;
        }
        for (let heroname in used_by_heroes) {
            shiPinData[heroname] = shiPinData[heroname] || {};
            if (_shipininfo.prefab) {
                shiPinData[heroname][_shipininfo.prefab] = shiPinData[heroname][_shipininfo.prefab] || [];
                let kkk = _shipininfo.prefab
                if (_shipininfo.item_slot && _shipininfo.item_slot.includes("persona")) {
                    kkk += "_persona";
                }
                shiPinData[heroname][kkk].push(k);
            }
        }
    }
}

function createNpc() {
    const _str_start = "npc_dota_hero_";
    const excludehero = ["npc_dota_hero_base"];
    let kv_s = fs.readFileSync(old_npc_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAHeroes;
    if (!fs.existsSync(old_npc_out_path)) {
        return;
    }
    let sheets = xlsx.parse(old_npc_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_npc_out_path);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    //空两行
    rows.push([]);
    let vscripts_index = keyrow.indexOf("vscripts");
    let BaseClass_index = keyrow.indexOf("BaseClass");
    let shipin_index = keyrow.indexOf("AttachWearables");
    for (let k in info) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let npcinfo = info[k];
            let npc_name = k.replace("npc_", "");
            let newRow = [npc_name];
            newRow[vscripts_index] = `npc/units/dota/${npc_name}.lua`;
            newRow[BaseClass_index] = `npc_dota_creature`;
            for (let npc_key in npcinfo) {
                let value = npcinfo[npc_key];
                switch (typeof value) {
                    case "string":
                        let index = keyrow.indexOf(npc_key);
                        if (index > -1) {
                            switch (npc_key) {
                                case "Ability1":
                                case "Ability2":
                                case "Ability3":
                                case "Ability4":
                                case "Ability5":
                                case "Ability6":
                                case "Ability7":
                                case "Ability8":
                                case "Ability9":
                                case "Ability10":
                                case "Ability11":
                                case "Ability12":
                                case "Ability13":
                                case "Ability14":
                                case "Ability15":
                                case "Ability16":
                                case "Ability17":
                                    if (value != "generic_hidden") {
                                        newRow[index] = npc_key.toLowerCase() + "_" + value;
                                    }
                                    break;
                                default:
                                    newRow[index] = value;
                                    break;
                            }
                        }
                        break;
                    case "object":
                        let start = 0;
                        let allindex = [];
                        let index1 = rows_param[1].indexOf(npc_key, start);
                        while (index1 > -1) {
                            allindex.push(index1);
                            start = index1 + 1;
                            index1 = rows_param[1].indexOf(npc_key, start);
                        }
                        allindex.forEach((index) => {
                            let trueIndex = rows[0].indexOf(rows_param[0][index]);
                            let all_ks = Object.keys(value);
                            switch (rows_param[2][index]) {
                                case "K&":
                                case "V&":
                                    let k_str_ = "";
                                    let v_str_ = "";
                                    for (let i = 0; i < all_ks.length; i++) {
                                        k_str_ += all_ks[i];
                                        v_str_ += value[all_ks[i]];
                                        if (i < all_ks.length - 1) {
                                            k_str_ += "\n";
                                            v_str_ += "\n";
                                        }
                                    }
                                    if (rows_param[2][index] == "K&") {
                                        newRow[trueIndex] = k_str_;
                                    } else {
                                        newRow[trueIndex] = v_str_;
                                    }
                                    break;
                            }
                        });
                        break;
                }
            }
            // 饰品数据  默认饰品
            if (shiPinData[k] && shiPinData[k]["default_item"]) {
                let shipin = shiPinData[k]["default_item"];
                for (let jj = 0; jj < shipin.length; jj++) {
                    newRow[shipin_index + jj] = shipin[jj];
                }
            }
            rows.push(newRow);
            console.log(k);
        }
    }
    fs.writeFileSync(old_npc_out_path, xlsx.build(sheets));
}

function createAbility() {
    const _str_start = "npc_dota_hero_";
    const excludehero = ["npc_dota_hero_base"];
    let kv_s = fs.readFileSync(old_npc_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAHeroes;

    let kv_ability = fs.readFileSync(old_ability_path, "utf8");
    let obj_ability = keyvalues.decode(kv_ability);
    let info_ability = obj_ability.DOTAAbilities;
    if (!fs.existsSync(old_ability_out_path)) {
        return;
    }
    let sheets = xlsx.parse(old_ability_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_ability_out_path);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    //空两行
    rows.push([]);
    let vscripts_index = keyrow.indexOf("ScriptFile");
    let BaseClass_index = keyrow.indexOf("BaseClass");
    for (let k in info) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let npcinfo = info[k];
            for (let npc_key in npcinfo) {
                let value = npcinfo[npc_key];
                switch (npc_key) {
                    case "Ability1":
                    case "Ability2":
                    case "Ability3":
                    case "Ability4":
                    case "Ability5":
                    case "Ability6":
                    case "Ability7":
                    case "Ability8":
                    case "Ability9":
                    case "Ability10":
                    case "Ability11":
                    case "Ability12":
                    case "Ability13":
                    case "Ability14":
                    case "Ability15":
                    case "Ability16":
                    case "Ability17":
                        if (value != "generic_hidden") {
                            let abilityname = npc_key.toLowerCase() + "_" + value;
                            let abilityinfo = info_ability[value];
                            if (abilityinfo) {
                                let newRow = [abilityname];
                                newRow[vscripts_index] = `npc/abilities/dota/${k.replace("npc_", "")}/${abilityname}`;
                                newRow[BaseClass_index] = `ability_lua`;
                                for (let ability_k in abilityinfo) {
                                    let ab_info = abilityinfo[ability_k];
                                    switch (typeof ab_info) {
                                        case "string":
                                            let index = keyrow.indexOf(ability_k);
                                            if (index > -1) {
                                                newRow[index] = ab_info;
                                            }
                                            break;
                                        case "object":
                                            if (ability_k == "AbilitySpecial") {
                                                for (let index_kk in ab_info) {
                                                    let _kk = index_kk + ">K&";
                                                    let _VV = index_kk + ">V&";
                                                    let _k_str = "";
                                                    let _v_str = "";
                                                    let temp_index_kk = rows_param[2].indexOf(_kk);
                                                    let temp_index_vv = rows_param[2].indexOf(_VV);
                                                    let trueIndex_kk = rows[0].indexOf(rows_param[0][temp_index_kk]);
                                                    let trueIndex_vv = rows[0].indexOf(rows_param[0][temp_index_vv]);
                                                    let obj_keys = Object.keys(ab_info[index_kk]);
                                                    for (let i = 0; i < obj_keys.length; i++) {
                                                        let trueK = obj_keys[i];
                                                        let temp_v_str = null;
                                                        if (trueK == "LinkedSpecialBonus" || trueK == "ad_linked_ability") {
                                                            temp_v_str = ability_name_new_old[ab_info[index_kk][trueK]];
                                                        } else {
                                                            temp_v_str = ab_info[index_kk][trueK];
                                                        }
                                                        if (temp_v_str != null) {
                                                            _k_str += trueK;
                                                            _v_str += temp_v_str;
                                                        }
                                                        if (i < obj_keys.length - 1) {
                                                            _k_str += "\n";
                                                            _v_str += "\n";
                                                        }
                                                    }
                                                    newRow[trueIndex_kk] = _k_str;
                                                    newRow[trueIndex_vv] = _v_str;
                                                }
                                            }
                                            break;
                                    }
                                }
                                rows.push(newRow);
                                console.log(abilityname);
                            }
                        }
                        break;
                }
            }
        }
    }
    fs.writeFileSync(old_ability_out_path, xlsx.build(sheets));
}

function createItem() {
    const _str_start = "item_";
    const excludehero = [];
    let kv_item = fs.readFileSync(old_item_path, "utf8");
    let obj_item = keyvalues.decode(kv_item);
    let info_item = obj_item.DOTAAbilities;
    if (!fs.existsSync(old_item_out_path)) {
        return;
    }
    let sheets = xlsx.parse(old_item_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_item_out_path);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    rows.push([]);
    let vscripts_index = keyrow.indexOf("ScriptFile");
    let BaseClass_index = keyrow.indexOf("BaseClass");
    for (let k in info_item) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let abilityinfo = info_item[k];
            let itemname = k + "_custom";
            let newRow = [itemname];
            newRow[vscripts_index] = `npc/items/dota/${itemname}`;
            newRow[BaseClass_index] = `item_lua`;
            for (let ability_k in abilityinfo) {
                let ab_info = abilityinfo[ability_k];
                switch (typeof ab_info) {
                    case "string":
                        let index = keyrow.indexOf(ability_k);
                        if (index > -1) {
                            newRow[index] = ab_info;
                        }
                        break;
                    case "object":
                        if (ability_k == "AbilitySpecial") {
                            for (let index_kk in ab_info) {
                                let _kk = index_kk + ">K&";
                                let _VV = index_kk + ">V&";
                                let _k_str = "";
                                let _v_str = "";
                                let temp_index_kk = rows_param[2].indexOf(_kk);
                                let temp_index_vv = rows_param[2].indexOf(_VV);
                                let trueIndex_kk = rows[0].indexOf(rows_param[0][temp_index_kk]);
                                let trueIndex_vv = rows[0].indexOf(rows_param[0][temp_index_vv]);
                                let obj_keys = Object.keys(ab_info[index_kk]);
                                for (let i = 0; i < obj_keys.length; i++) {
                                    let trueK = obj_keys[i];
                                    _k_str += trueK;
                                    if (trueK == "LinkedSpecialBonus" || trueK == "ad_linked_ability") {
                                        _v_str += ability_name_new_old[ab_info[index_kk][trueK]];
                                    } else {
                                        _v_str += ab_info[index_kk][trueK];
                                    }
                                    if (i < obj_keys.length - 1) {
                                        _k_str += "\n";
                                        _v_str += "\n";
                                    }
                                }
                                newRow[trueIndex_kk] = _k_str;
                                newRow[trueIndex_vv] = _v_str;
                            }
                        } else if (ability_k == "ItemRequirements") {
                            let obj_keys = Object.keys(ab_info);
                            let _k_str = "";
                            let _v_str = "";
                            let trueIndex_kk = rows[0].indexOf("合成需要_k");
                            let trueIndex_vv = rows[0].indexOf("合成需要_v");
                            for (let i = 0; i < obj_keys.length; i++) {
                                let trueK = obj_keys[i];
                                _k_str += trueK;
                                let _tmp_ = [];
                                ab_info[trueK].split(";").forEach((s) => {
                                    if (s.indexOf("*") > -1) {
                                        _tmp_.push(s.replace("*", "_custom*"));
                                    } else {
                                        _tmp_.push(s + "_custom");
                                    }
                                });
                                _v_str += _tmp_.join(";");
                                if (i < obj_keys.length - 1) {
                                    _k_str += "\n";
                                    _v_str += "\n";
                                }
                            }
                            newRow[trueIndex_kk] = _k_str;
                            newRow[trueIndex_vv] = _v_str;
                        }
                        break;
                }
            }
            rows.push(newRow);
            console.log(itemname);
        }
    }
    fs.writeFileSync(old_item_out_path, xlsx.build(sheets));
}

function createSound() {
    const excludehero = [];
    let kv_item = fs.readFileSync(old_sound_path, "utf8");
    let obj_item = keyvalues.decode(kv_item);
    let info_item = obj_item.custom_sounds;
    if (!fs.existsSync(old_sound_out_path)) {
        return;
    }
    let sheets = xlsx.parse(old_sound_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_sound_out_path);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    rows.push([]);
    for (let k in info_item) {
        if (excludehero.indexOf(k) == -1) {
            let abilityinfo = info_item[k];
            let itemname = k;
            let newRow = [itemname];
            for (let ability_k in abilityinfo) {
                let ab_info = abilityinfo[ability_k];
                switch (typeof ab_info) {
                    case "number":
                    case "string":
                        let index = keyrow.indexOf(ability_k);
                        if (index > -1) {
                            newRow[index] = ab_info;
                        }
                        break;
                    // default:
                    //     let index2 = keyrow.indexOf(ability_k);
                    //     if (index2 > -1) {
                    //         newRow[index2] = "" + ab_info;
                    //     }
                    //     break;
                }
                if (ability_k == "vsnd_files") {
                    let index = keyrow.indexOf(ability_k);
                    newRow[index] = "";
                    let vsndinfo = ab_info.filter((ss) => {
                        return ss != ",";
                    });
                    for (let index_kk of vsndinfo) {
                        newRow[index] += index_kk;
                        if (vsndinfo.indexOf(index_kk) != vsndinfo.length - 1) {
                            newRow[index] += "\n";
                        }
                    }
                }
            }
            rows.push(newRow);
            console.log(itemname);
        }
    }
    fs.writeFileSync(old_sound_out_path, xlsx.build(sheets));
}

function createShiPin() {
    let kv_s = fs.readFileSync(old_shipin_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.items_game.items;
    let _controlPoints = obj.items_game.attribute_controlled_attached_particles;
    let new_controlPoints = {};
    for (let k in _controlPoints) {
        let _controlPointsInfo = _controlPoints[k];
        if (_controlPointsInfo.system) {
            new_controlPoints[_controlPointsInfo.system] = _controlPointsInfo;
        }
    }
    if (!fs.existsSync(old_shipin_out_path)) {
        return;
    }
    let sheets = xlsx.parse(old_shipin_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_shipin_out_path);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    //空两行
    if (nrows > 2) {
        rows.splice(2, nrows - 2)
    }
    let nameMap = {};
    for (let k in info) {
        let npcinfo = info[k];
        if (npcinfo["name"] == null) {
            continue;
        }
        nameMap[npcinfo["name"]] = k;
    }
    for (let k in info) {
        let npcinfo = info[k];
        if (npcinfo["used_by_heroes"] == null) {
            continue;
        }
        let newRow = [k];
        for (let npc_key in npcinfo) {
            let value = npcinfo[npc_key];
            let index = keyrow.indexOf(npc_key);
            switch (npc_key) {
                case "bundle":
                    if (value != null && index > -1 && typeof value == "object") {
                        let idlist = [];
                        Object.keys(value).forEach(__key => {
                            if (nameMap[__key]) {
                                idlist.push(nameMap[__key]);
                            }
                        })
                        newRow[index] = idlist.join("|");
                    }
                    break;
                case "used_by_heroes":
                    if (value != null && index > -1 && typeof value == "object") {
                        newRow[index] = Object.keys(value).join("|");
                    }
                    break;
                case "visuals":
                    if (value != null && typeof value == "object") {
                        for (let modefi_k in value) {
                            let modefi_v = value[modefi_k];
                            if (modefi_k == "skin") {
                                newRow[keyrow.indexOf("skin")] = modefi_v;
                            } else if (modefi_k == "skip_model_combine") {
                                newRow[keyrow.indexOf("skip_model_combine")] = modefi_v;
                            } else if (modefi_k == ("styles")) {
                                newRow[keyrow.indexOf("styles")] = JSON.stringify(modefi_v);
                            } else if (modefi_k.includes("asset_modifier")) {
                                let index_asset_modifier = keyrow.indexOf("asset_modifier")
                                newRow[index_asset_modifier] = newRow[index_asset_modifier] || "";
                                if (newRow[index_asset_modifier].length > 0) {
                                    newRow[index_asset_modifier] += "|";
                                }
                                newRow[index_asset_modifier] += JSON.stringify(modefi_v);
                                // 控制点
                                if (modefi_v.type == "particle_create" && modefi_v.modifier) {
                                    let control_point_info = new_controlPoints[modefi_v.modifier]
                                    if (control_point_info) {
                                        let index_control_point = keyrow.indexOf("control_point")
                                        newRow[index_control_point] = newRow[index_control_point] || "";
                                        if (newRow[index_control_point].length > 0) {
                                            newRow[index_control_point] += "|";
                                        }
                                        newRow[index_control_point] += JSON.stringify(control_point_info);
                                    }
                                }

                            }
                        }
                    }
                    break;
                default:
                    if (value != null && index > -1 && typeof value == "string") {
                        newRow[index] = value;
                    }
                    break;
            }
        }
        rows.push(newRow);
        console.log(k);
    }
    fs.writeFileSync(old_shipin_out_path, xlsx.build(sheets));
}

const imbabasepath = "E:/project/dota_project/dota_imba-master/game/scripts/npc/";
const imbaabilitypath = imbabasepath + "npc_abilities_custom.txt";
const imbaabilityOutPath = "excels/abilities/imba_abilities.xlsx";

function createImbaAbility() {
    const abilitystr = fs.readFileSync(imbaabilitypath, "utf8");
    const lines = abilitystr.split("\n");
    let abilitys = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#base")) {
            let _kvpath = imbabasepath + lines[i].substring(6);
            if (fs.existsSync(_kvpath)) {
                abilitys.push(fs.readFileSync(_kvpath, "utf8"));
            }
        }
        if (lines[i].includes("DOTAAbilities")) {
            let newlines = lines.slice(i, lines.length - 1);
            abilitys.push(newlines.join("\n"));
            break;
        }
    }

    const _str_start = "imba_";
    const excludehero = ["npc_dota_hero_base"];
    if (!fs.existsSync(imbaabilityOutPath)) {
        return;
    }
    let sheets = xlsx.parse(imbaabilityOutPath);
    if (sheets.length < 2) {
        console.error("缺少参数表:", imbaabilityOutPath);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    //空两行
    rows.push([]);
    let vscripts_index = keyrow.indexOf("ScriptFile");
    let BaseClass_index = keyrow.indexOf("BaseClass");
    for (let str of abilitys) {
        let obj = keyvalues.decode(str);
        let info_ability = obj.DOTAAbilities;
        if (!info_ability) {
            continue;
        }
        for (let abilityname in info_ability) {
            if (abilityname.includes(_str_start) && excludehero.indexOf(abilityname) == -1) {
                let abilityinfo = info_ability[abilityname];
                let newRow = [abilityname];
                newRow[vscripts_index] = ``;
                newRow[BaseClass_index] = `ability_lua`;
                for (let ability_k in abilityinfo) {
                    let ab_info = abilityinfo[ability_k];
                    switch (typeof ab_info) {
                        case "string":
                            let index = keyrow.indexOf(ability_k);
                            if (index > -1) {
                                newRow[index] = ab_info;
                            }
                            break;
                        case "object":
                            if (ability_k == "AbilitySpecial") {
                                for (let index_kk in ab_info) {
                                    let _kk = index_kk + ">K&";
                                    let _VV = index_kk + ">V&";
                                    let _k_str = "";
                                    let _v_str = "";
                                    let temp_index_kk = rows_param[2].indexOf(_kk);
                                    let temp_index_vv = rows_param[2].indexOf(_VV);
                                    let trueIndex_kk = rows[0].indexOf(rows_param[0][temp_index_kk]);
                                    let trueIndex_vv = rows[0].indexOf(rows_param[0][temp_index_vv]);
                                    let obj_keys = Object.keys(ab_info[index_kk]);
                                    for (let i = 0; i < obj_keys.length; i++) {
                                        let trueK = obj_keys[i];
                                        let temp_v_str = null;
                                        if (trueK == "LinkedSpecialBonus" || trueK == "ad_linked_ability") {
                                            temp_v_str = ability_name_new_old[ab_info[index_kk][trueK]];
                                        } else {
                                            temp_v_str = ab_info[index_kk][trueK];
                                        }
                                        if (temp_v_str != null) {
                                            _k_str += trueK;
                                            _v_str += temp_v_str;
                                        }
                                        if (i < obj_keys.length - 1) {
                                            _k_str += "\n";
                                            _v_str += "\n";
                                        }
                                    }
                                    newRow[trueIndex_kk] = _k_str;
                                    newRow[trueIndex_vv] = _v_str;
                                }
                            }
                            break;
                    }
                }
                rows.push(newRow);
                console.log(abilityname);
            }
        }
    }
    fs.writeFileSync(imbaabilityOutPath, xlsx.build(sheets));
}


const imbanpcpath = imbabasepath + "npc_heroes_custom.txt";
const imbanpcexcelPath = "excels/abilities/npcability.xlsx";

function createImbaNpc() {
    const abilitystr = fs.readFileSync(imbanpcpath, "utf8");
    const lines = abilitystr.split("\n");
    let npcs = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#base")) {
            let _kvpath = imbabasepath + lines[i].substring(6);
            if (fs.existsSync(_kvpath)) {
                npcs.push(fs.readFileSync(_kvpath, "utf8"));
            }
        }
        if (lines[i].includes("DOTAHeroes")) {
            let newlines = lines.slice(i, lines.length - 1);
            npcs.push(newlines.join("\n"));
            break;
        }
    }
    const _str_start = "npc_dota_";
    const excludehero = ["npc_dota_hero_base"];
    if (!fs.existsSync(imbanpcexcelPath)) {
        return;
    }
    let sheets = xlsx.parse(imbanpcexcelPath);
    let sheet = sheets[0];
    let rows = sheet.data;
    for (let str of npcs) {
        let obj = keyvalues.decode(str);
        let info_ability = obj.DOTAHeroes;
        if (!info_ability) {
            continue;
        }
        for (let abilityname in info_ability) {
            if (abilityname.includes(_str_start) && excludehero.indexOf(abilityname) == -1) {
                let abilityinfo = info_ability[abilityname];
                let newRow = [abilityname];
                for (let j = 1; j < 20; j++) {
                    if (abilityinfo["Ability" + j]) {
                        newRow[j] = abilityinfo["Ability" + j];
                    }
                }
                rows.push(newRow);
                console.log(abilityname);
            }
        }
    }
    fs.writeFileSync(imbanpcexcelPath, xlsx.build(sheets));
}

const imbaunitpath = imbabasepath + "npc_units_custom.txt";
const imbaunitexcelPath = "excels/units/imba_units.xlsx";

function createImbaUnit() {
    const abilitystr = fs.readFileSync(old_unit_path, "utf8");
    const lines = abilitystr.split("\n");
    let npcs = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#base")) {
            let _kvpath = imbabasepath + lines[i].substring(6);
            if (fs.existsSync(_kvpath)) {
                npcs.push(fs.readFileSync(_kvpath, "utf8"));
            }
        }
        if (lines[i].includes("DOTAUnits")) {
            let newlines = lines.slice(i, lines.length - 1);
            npcs.push(newlines.join("\n"));
            break;
        }
    }
    const _str_start = "npc_imba_";
    const excludehero = ["Version"];
    if (!fs.existsSync(imbaunitexcelPath)) {
        return;
    }
    let sheets = xlsx.parse(imbaunitexcelPath);
    if (sheets.length < 2) {
        console.error("缺少参数表:", imbaunitexcelPath);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    //空两行
    rows.push([]);
    let vscripts_index = keyrow.indexOf("vscripts");
    let BaseClass_index = keyrow.indexOf("BaseClass");
    let shipin_index = keyrow.indexOf("AttachWearables");
    for (let str of npcs) {
        let obj = keyvalues.decode(str);
        let info = obj.DOTAUnits || obj.DOTAHeroes;
        if (!info) {
            continue;
        }
        for (let k in info) {
            if (k.indexOf(_str_start) == -1 && excludehero.indexOf(k) == -1) {
                let npcinfo = info[k];
                let npc_name = k;
                let newRow = [npc_name];
                // newRow[vscripts_index] = `npc/units/imba/${npc_name}`;
                // newRow[BaseClass_index] = `npc_dota_creature`;
                for (let npc_key in npcinfo) {
                    let value = npcinfo[npc_key];
                    switch (typeof value) {
                        case "string":
                            let index = keyrow.indexOf(npc_key);
                            if (index > -1) {
                                switch (npc_key) {
                                    case "Ability1":
                                    case "Ability2":
                                    case "Ability3":
                                    case "Ability4":
                                    case "Ability5":
                                    case "Ability6":
                                    case "Ability7":
                                    case "Ability8":
                                    case "Ability9":
                                    case "Ability10":
                                    case "Ability11":
                                    case "Ability12":
                                    case "Ability13":
                                    case "Ability14":
                                    case "Ability15":
                                    case "Ability16":
                                    case "Ability17":
                                        if (value != "generic_hidden") {
                                            newRow[index] = npc_key.toLowerCase() + "_" + value;
                                        }
                                        break;
                                    default:
                                        newRow[index] = value;
                                        break;
                                }
                            }
                            break;
                        case "object":
                            let start = 0;
                            let allindex = [];
                            let index1 = rows_param[1].indexOf(npc_key, start);
                            while (index1 > -1) {
                                allindex.push(index1);
                                start = index1 + 1;
                                index1 = rows_param[1].indexOf(npc_key, start);
                            }
                            allindex.forEach((index) => {
                                let trueIndex = rows[0].indexOf(rows_param[0][index]);
                                let all_ks = Object.keys(value);
                                switch (rows_param[2][index]) {
                                    case "K&":
                                    case "V&":
                                        let k_str_ = "";
                                        let v_str_ = "";
                                        for (let i = 0; i < all_ks.length; i++) {
                                            k_str_ += all_ks[i];
                                            v_str_ += value[all_ks[i]];
                                            if (i < all_ks.length - 1) {
                                                k_str_ += "\n";
                                                v_str_ += "\n";
                                            }
                                        }
                                        if (rows_param[2][index] == "K&") {
                                            newRow[trueIndex] = k_str_;
                                        } else {
                                            newRow[trueIndex] = v_str_;
                                        }
                                        break;
                                }
                            });
                            break;
                    }
                }
                // 饰品数据  默认饰品
                // if (shiPinData[k] && shiPinData[k]["default_item"]) {
                //     let shipin = shiPinData[k]["default_item"];
                //     for (let jj = 0; jj < shipin.length; jj++) {
                //         newRow[shipin_index + jj] = shipin[jj];
                //     }
                // }
                rows.push(newRow);
                console.log(k);
            }
        }
    }
    fs.writeFileSync(imbaunitexcelPath, xlsx.build(sheets));
}

const imbakvtmpPath = "excels/abilities/1.xlsx";

function addkvvaluetoexcel() {
    const checkreg = /[A-Z]/g;
    const exkey = ["LinkedSpecialBonus", "var_type", "CalculateSpellDamageTooltip"]
    const abilitystr = fs.readFileSync(old_ability_path, "utf8");
    let dotaobj = keyvalues.decode(abilitystr).DOTAAbilities;
    const imbastr = fs.readFileSync("game/scripts/npc/abilities/imba_abilities.kv", "utf8");
    let imbaobj = keyvalues.decode(imbastr).imbaAbility;
    let sheets = xlsx.parse(imbaabilityOutPath);
    let sheet = sheets[0];
    let rows = sheet.data;

    let excelnameobj = {};
    for (let i = 1; i < rows.length; i++) {
        excelnameobj[rows[i][0]] = i;
    }
    for (let abilityname in imbaobj) {
        let imbainfo = imbaobj[abilityname];
        let imbaspe = {};
        let imbaAbilitySpecial = imbainfo.AbilitySpecial;
        if (imbaAbilitySpecial) {
            for (let index in imbaAbilitySpecial) {
                let imbaAbilitySpecialinfo = imbaAbilitySpecial[index];
                for (let kkk in imbaAbilitySpecialinfo) {
                    if (exkey.indexOf(kkk) == -1) {
                        imbaspe[kkk] = imbaAbilitySpecialinfo[kkk];
                    }
                }
            }
        }

        let kk = abilityname.replace("imba_", "");
        if (dotaobj[kk]) {
            let extraspe = {};
            let AbilityValues = dotaobj[kk].AbilityValues;
            if (AbilityValues) {
                for (let k in AbilityValues) {
                    if (imbaspe[k] == null && !checkreg.test(k)) {
                        let v = typeof AbilityValues[k] == "object" ? AbilityValues[k].value : AbilityValues[k];
                        if (v != null) extraspe[k] = v;
                    }
                }
            }
            let AbilitySpecial = dotaobj[kk].AbilitySpecial;
            if (AbilitySpecial) {
                for (let index in AbilitySpecial) {
                    let AbilitySpecialinfo = AbilitySpecial[index];
                    for (let kkk in AbilitySpecialinfo) {
                        if (exkey.indexOf(kkk) == -1 && kkk != "var_type" && !checkreg.test(kkk)) {
                            if (imbaspe[kkk] == null) {
                                extraspe[kkk] = AbilitySpecialinfo[kkk];
                            }
                        }
                    }
                }
            }
            let index = excelnameobj[abilityname];
            if (Object.keys(extraspe).length > 0 && index != null) {
                let beginindex = 30;
                while (rows[index][beginindex] != null) {
                    beginindex++;
                }
                for (let k in extraspe) {
                    rows[index][beginindex] = k;
                    rows[index][beginindex + 1] = extraspe[k];
                    beginindex += 2;
                }
            }
        }
    }
    fs.writeFileSync(imbaabilityOutPath, xlsx.build(sheets));

}

const imba_itemkv_path = imbabasepath + "npc_items_custom.txt";
;
const imba_itemexcel_Path = "excels/items/imba_items.xlsx";

function createImbaItem() {
    const _str_start = "item_";
    const excludehero = [];
    let kv_item = fs.readFileSync(imba_itemkv_path, "utf8");
    let obj_item = keyvalues.decode(kv_item);
    let info_item = obj_item.DOTAAbilities;
    if (!fs.existsSync(imba_itemexcel_Path)) {
        return;
    }
    let sheets = xlsx.parse(imba_itemexcel_Path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", imba_itemexcel_Path);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    rows.push([]);
    let vscripts_index = keyrow.indexOf("ScriptFile");
    let BaseClass_index = keyrow.indexOf("BaseClass");
    for (let k in info_item) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let abilityinfo = info_item[k];
            let itemname = k;
            let newRow = [itemname];
            // newRow[vscripts_index] = `npc/items/dota/${itemname}`;
            newRow[BaseClass_index] = `item_lua`;
            for (let ability_k in abilityinfo) {
                let ab_info = abilityinfo[ability_k];
                switch (typeof ab_info) {
                    case "string":
                        let index = keyrow.indexOf(ability_k);
                        if (index > -1) {
                            newRow[index] = ab_info;
                        }
                        break;
                    case "object":
                        if (ability_k == "AbilitySpecial") {
                            for (let index_kk in ab_info) {
                                let _kk = index_kk + ">K&";
                                let _VV = index_kk + ">V&";
                                let _k_str = "";
                                let _v_str = "";
                                let temp_index_kk = rows_param[2].indexOf(_kk);
                                let temp_index_vv = rows_param[2].indexOf(_VV);
                                let trueIndex_kk = rows[0].indexOf(rows_param[0][temp_index_kk]);
                                let trueIndex_vv = rows[0].indexOf(rows_param[0][temp_index_vv]);
                                let obj_keys = Object.keys(ab_info[index_kk]);
                                for (let i = 0; i < obj_keys.length; i++) {
                                    let trueK = obj_keys[i];
                                    _k_str += trueK;
                                    if (trueK == "LinkedSpecialBonus" || trueK == "ad_linked_ability") {
                                        _v_str += ability_name_new_old[ab_info[index_kk][trueK]];
                                    } else {
                                        _v_str += ab_info[index_kk][trueK];
                                    }
                                    if (i < obj_keys.length - 1) {
                                        _k_str += "\n";
                                        _v_str += "\n";
                                    }
                                }
                                newRow[trueIndex_kk] = _k_str;
                                newRow[trueIndex_vv] = _v_str;
                            }
                        } else if (ability_k == "ItemRequirements") {
                            let obj_keys = Object.keys(ab_info);
                            let _k_str = "";
                            let _v_str = "";
                            let trueIndex_kk = rows[0].indexOf("合成需要_k");
                            let trueIndex_vv = rows[0].indexOf("合成需要_v");
                            for (let i = 0; i < obj_keys.length; i++) {
                                let trueK = obj_keys[i];
                                _k_str += trueK;
                                let _tmp_ = [];
                                ab_info[trueK].split(";").forEach((s) => {
                                    if (s.indexOf("*") > -1) {
                                        _tmp_.push(s.replace("*", "_custom*"));
                                    } else {
                                        _tmp_.push(s + "_custom");
                                    }
                                });
                                _v_str += _tmp_.join(";");
                                if (i < obj_keys.length - 1) {
                                    _k_str += "\n";
                                    _v_str += "\n";
                                }
                            }
                            newRow[trueIndex_kk] = _k_str;
                            newRow[trueIndex_vv] = _v_str;
                        }
                        break;
                }
            }
            rows.push(newRow);
            console.log(itemname);
        }
    }
    fs.writeFileSync(imba_itemexcel_Path, xlsx.build(sheets));
}

function createImbaAbility2() {
    const exkey = ["LinkedSpecialBonus", "RequiresScepter", "var_type", "CalculateSpellDamageTooltip"]
    const imbastr = fs.readFileSync("game/scripts/npc/abilities/imba_abilities.kv", "utf8");
    let imbaobj = keyvalues.decode(imbastr).imbaAbility;
    let oldSpecial = {};
    let newSpecial = {};
    for (let k in imbaobj) {
        oldSpecial[k] = {};
        if (imbaobj[k].AbilitySpecial) {
            for (let kk in imbaobj[k].AbilitySpecial) {
                for (let kkk in imbaobj[k].AbilitySpecial[kk]) {
                    oldSpecial[k][kkk] = imbaobj[k].AbilitySpecial[kk][kkk];
                }
            }
        }
    }

    const abilitystr = fs.readFileSync(imbaabilitypath, "utf8");
    const lines = abilitystr.split("\n");
    let abilitys = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#base")) {
            let _kvpath = imbabasepath + lines[i].substring(6);
            if (fs.existsSync(_kvpath)) {
                abilitys.push(fs.readFileSync(_kvpath, "utf8"));
            }
        }
        if (lines[i].includes("DOTAAbilities")) {
            let newlines = lines.slice(i, lines.length - 1);
            abilitys.push(newlines.join("\n"));
            break;
        }
    }

    const _str_start = "_";
    const excludehero = ["npc_dota_hero_base"];
    if (!fs.existsSync(imbakvtmpPath)) {
        return;
    }
    let sheets = xlsx.parse(imbakvtmpPath);
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;

    //空两行
    rows.push([]);
    for (let str of abilitys) {
        let obj = keyvalues.decode(str);
        let info_ability = obj.DOTAAbilities;
        if (!info_ability) {
            continue;
        }
        for (let abilityname in info_ability) {
            if (abilityname.includes(_str_start) && excludehero.indexOf(abilityname) == -1) {
                if (oldSpecial[abilityname] == null) {
                    continue;
                }
                let abilityinfo = info_ability[abilityname];
                if (abilityinfo.AbilitySpecial) {
                    for (let kk in abilityinfo.AbilitySpecial) {
                        for (let kkk in abilityinfo.AbilitySpecial[kk]) {
                            if (oldSpecial[abilityname][kkk] == null && !exkey.includes(kkk)) {
                                newSpecial[abilityname] = newSpecial[abilityname] || {};
                                newSpecial[abilityname][kkk] = abilityinfo.AbilitySpecial[kk][kkk];
                            }
                        }
                    }
                }

            }
        }
    }
    for (let k in newSpecial) {
        let newRow = [k];
        for (let kk in newSpecial[k]) {
            newRow.push(kk);
            newRow.push(newSpecial[k][kk]);
        }
        rows.push(newRow);
        console.log(k);
    }
    fs.writeFileSync(imbakvtmpPath, xlsx.build(sheets));
}

function makeOnePropExcel(props = [
    "AbilityBehavior",
    "AbilityType",
    "AbilityUnitTargetTeam",
    "AbilityUnitTargetType",
    "AbilityDamage",
    "AbilityUnitDamageType",
    "SpellImmunityType",
    "SpellDispellableType",
    "FightRecapLevel",
    "AbilitySound",
    "AbilityCastAnimation",
    "AbilityCastGestureSlot",
    "AbilityCastPoint",
    "AbilityCastRange",
    "AbilityDuration",
    "AbilityCooldown",
    "AbilityChannelTime",
    "AbilityManaCost"]) {
    let sheets = xlsx.parse(imbaabilityOutPath);
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let kv = {};
    let sp_k_index = {}
    for (let prop of props) {
        sp_k_index[prop] = rows[1].indexOf(prop)
    }
    console.log(sp_k_index);
    for (let i = 2; i < nrows; i++) {
        let row = rows[i];
        let abilityname = row[0];
        kv[abilityname] = row;
    }
    const abilitystr = fs.readFileSync(old_ability_path, "utf8");
    const lines = abilitystr.split("\n");
    let abilitys = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#base")) {
            let _kvpath = imbabasepath + lines[i].substring(6);
            if (fs.existsSync(_kvpath)) {
                abilitys.push(fs.readFileSync(_kvpath, "utf8"));
            }
        }
        if (lines[i].includes("DOTAAbilities")) {
            let newlines = lines.slice(i, lines.length - 1);
            abilitys.push(newlines.join("\n"));
            break;
        }
    }
    for (let str of abilitys) {
        let obj = keyvalues.decode(str);
        let info_ability = obj.DOTAAbilities;
        if (!info_ability) {
            continue;
        }
        for (let abilityname in info_ability) {
            let imbaname = "imba_" + abilityname;
            if (kv[imbaname] == null) {
                continue;
            }
            let abilityinfo = info_ability[abilityname];
            let excel_abilityinfo = kv[imbaname];
            for (let prop of props) {
                let propindex = sp_k_index[prop];
                if (excel_abilityinfo[propindex] == null && abilityinfo[prop] != null && abilityinfo[prop] != "") {
                    excel_abilityinfo[propindex] = abilityinfo[prop];
                }
            }
            let imbaname2 = "imba_" + abilityname + '_723';
            if (kv[imbaname2] == null) {
                continue;
            }
            let excel_abilityinfo2 = kv[imbaname2];
            for (let prop of props) {
                let propindex = sp_k_index[prop];
                if (excel_abilityinfo2[propindex] == null && abilityinfo[prop] != null && abilityinfo[prop] != "") {
                    excel_abilityinfo2[propindex] = abilityinfo[prop];
                }
            }

        }
    }
    fs.writeFileSync(imbaabilityOutPath, xlsx.build(sheets));

}

const lang_path = "game/scripts/dota2_abilities_schinese.txt";
const imba_lang_path = "game/scripts/imba_addon_schinese.txt";

function createabilityLang() {
    let sheets = xlsx.parse(imbakvtmpPath);
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    rows.push([]);
    const lanstr = fs.readFileSync(lang_path, "utf8");
    // let obj = keyvalues.decode(lanstr);
    // let Tokens = obj.Tokens;
    let lines = lanstr.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("Tokens")) {
            lines = lines.slice(i, lines.length - 1);
            break;
        }
    }
    let outkeys = {}
    for (let i = 0; i < lines.length - 1; i++) {
        let line = lines[i];
        // line = line.replace("dota_tooltip_", "DOTA_Tooltip_")
        if (!line.includes('DOTA_Tooltip_') && !line.includes('dota_tooltip_')) {
            continue;
        }
        let strlist = line.split('"');
        let key = line.split('"')[1].replace("_Ability_", "_ability_").replace("_description", "_Description").replace("_lore", "_Lore").replace("_note0", "_Note0").replace("_note1", "_Note1");
        key = key.replace("_note2", "_Note2").replace("_note3", "_Note3").replace("_note4", "_Note4").replace("_note5", "_Note5").replace("_note6", "_Note6");
        ;
        // let isbasekey = lines[i + 1].includes("key");
        let value = ""
        if (strlist.length > 4) {
            value = strlist[3];
        } else {
            value = lines[i + 1].split('"')[1];
        }
        outkeys[key] = value;
    }
    let allbasekey = {};
    let keys = Object.keys(outkeys);
    for (let k of keys) {
        if (keys.includes(k + "_Description") || keys.includes(k + "_Lore") || keys.includes(k + "_Note0")
            || keys.includes(k + "_imbafication_1")
        ) {
            allbasekey[k] = {};
        }
    }
    for (let k in allbasekey) {
        for (let i = 0, len = keys.length; i < len; i++) {
            let kk = keys[i];
            if (kk == k) {
                keys.splice(i, 1);
                i--;
                len--;
                continue;
            }
            if (kk.includes(k)) {
                allbasekey[k][kk.replace(k + "_", "")] = outkeys[kk];
                keys.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    const extrakeylist = ["Description",
        "Lore",
        "scepter_description",
        "abilitydraft_note",
        "Note0",
        "Note1",
        "Note2",
        "Note3",
        "Note4",
        "Note5",
        "Note6",
    ]
    for (let k in allbasekey) {
        let lineinfo = allbasekey[k];
        let newRow = [k,
            outkeys[k],
        ];
        for (let extrak of extrakeylist) {
            newRow.push(lineinfo[extrak])
            delete lineinfo[extrak];
        }
        for (let kk in lineinfo) {
            if (kk.includes("imbafication")) {
                let des = newRow[2] || "";
                des += "\n\n" + lineinfo[kk];
            } else {
                newRow.push(kk);
                newRow.push(lineinfo[kk]);
            }

        }
        rows.push(newRow);
    }
    rows.push([]);
    rows.push([]);
    for (let k of keys) {
        rows.push([k, outkeys[k]]);
    }
    fs.writeFileSync(imbakvtmpPath, xlsx.build(sheets));
}


function clearAbilitySameSpecial() {
    let sheets = xlsx.parse(imbaabilityOutPath);
    if (sheets.length < 2) {
        console.error("缺少参数表:", imba_itemexcel_Path);
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let startindex = 0;
    for (let i = 0; i < nrows; i++) {
        let row = rows[i];
        if (i < 2) {
            if (row.includes("AbilitySpecial")) {
                startindex = row.indexOf("AbilitySpecial");
                console.log("startindex", startindex);
            }
            continue;
        }
        let allkeys = {};
        for (let i = startindex; i < row.length; i += 2) {
            if (row[i] == null || allkeys[row[i]]) {
                row.splice(i, 2);
                i -= 2;
                continue;
            }
            allkeys[row[i]] = true;
        }

    }
    fs.writeFileSync(imbaabilityOutPath, xlsx.build(sheets));
}

function clearUnitPersonItemSlot() {
    const imbakvtmpPath2 = "excels/abilities/2.xlsx";
    let sheets = xlsx.parse(imbakvtmpPath2);
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    const shipin_config = "excels/kvConfig/shipin_config.xlsx";
    let sheets2 = xlsx.parse(shipin_config);
    let sheet2 = sheets2[2];
    let rows2 = sheet2.data;
    let nrows2 = rows2.length;
    let kv = {}
    let item_slot_index = rows2[1].indexOf("item_slot");
    if (item_slot_index == -1) {
        throw new Error("缺少item_slot字段")
    }
    for (let i = 2; i < nrows2; i++) {
        let row = rows2[i];
        kv[row[0]] = row;
    }
    console.log(nrows2)
    for (let i = 2; i < nrows; i++) {
        let len = rows[i].length;
        for (let j = 0; j < len; j++) {
            if (rows[i][j] != null) {
                let findinfo = kv[rows[i][j] + ""];
                if (findinfo) {
                    if (findinfo[item_slot_index] && findinfo[item_slot_index].includes("person")) {
                        rows[i].splice(j, 1);
                        j--;
                        len--;
                    }
                } else {
                    console.log("找不到", rows[i][j]);
                }
            }
        }
    }
    fs.writeFileSync(imbakvtmpPath2, xlsx.build(sheets));
}

(async () => {
    // var args = process.argv.splice(2);
    // readDATA();
    // createNpc()
    // createShiPin()
    // createItem()
    // createSound();
    // createImbaUnit();
    // makeOnePropExcel();
    createabilityLang()
    // clearUnitPersonItemSlot();
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
