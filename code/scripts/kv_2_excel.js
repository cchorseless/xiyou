const fs = require('fs-extra');
const keyvalues = require('keyvalues-node');
const program = require('commander');
const chokidar = require('chokidar');
const path = require('path');
const xlsx = require('node-xlsx');
const old_npc_path = 'game/scripts/dota2_old_npc_heroes.txt';
const old_ability_path = 'game/scripts/dota2_old_npc_abilities.txt';
const old_item_path = 'game/scripts/dota2_old_npc_items.txt';
const old_shipin_path = 'game/scripts/dota2_old_npc_shipin.txt';

const old_npc_out_path = 'excels/units/dota_units.xlsx';
const old_ability_out_path = 'excels/abilities/dota_abilities.xlsx';
const old_item_out_path = 'excels/items/dota_items.xlsx';

let shiPinData = null;
const ability_name_new_old = {}

function readDATA() {
    const _str_start = 'npc_dota_hero_';
    const excludehero = ['npc_dota_hero_base'];
    let kv_s = fs.readFileSync(old_npc_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAHeroes;
    for (let k in info) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let npcinfo = info[k];
            for (let npc_key in npcinfo) {
                let value = npcinfo[npc_key];
                switch (npc_key) {
                    case 'Ability1':
                    case 'Ability2':
                    case 'Ability3':
                    case 'Ability4':
                    case 'Ability5':
                    case 'Ability6':
                    case 'Ability7':
                    case 'Ability8':
                    case 'Ability9':
                    case 'Ability10':
                    case 'Ability11':
                    case 'Ability12':
                    case 'Ability13':
                    case 'Ability14':
                    case 'Ability15':
                    case 'Ability16':
                    case 'Ability17':
                        if (value != "generic_hidden") {
                            let abilityname = npc_key.toLowerCase() + '_' + value;
                            ability_name_new_old[value] = abilityname;
                        }
                        break;
                }
            }
        }
    }
    // 饰品数据
    let _shipinobj = JSON.parse(fs.readFileSync(old_shipin_path, "utf8"));
    shiPinData = {}
    for (let k in _shipinobj) {
        let _shipininfo = _shipinobj[k];
        let used_by_heroes = _shipininfo.used_by_heroes;
        if (used_by_heroes == null) { continue }
        for (let heroname in used_by_heroes) {
            shiPinData[heroname] = shiPinData[heroname] || {};
            if (_shipininfo.prefab) {
                shiPinData[heroname][_shipininfo.prefab] = shiPinData[heroname][_shipininfo.prefab] || [];
                shiPinData[heroname][_shipininfo.prefab].push(k)
            }
        }
    }
}

function createNpc() {
    const _str_start = 'npc_dota_hero_';
    const excludehero = ['npc_dota_hero_base'];
    let kv_s = fs.readFileSync(old_npc_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAHeroes;
    if (!fs.existsSync(old_npc_out_path)) { return };
    let sheets = xlsx.parse(old_npc_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_npc_out_path)
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    //空两行
    rows.push([])
    let vscripts_index = keyrow.indexOf('vscripts');
    let BaseClass_index = keyrow.indexOf('BaseClass');
    let shipin_index = keyrow.indexOf('AttachWearables');
    for (let k in info) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let npcinfo = info[k];
            let npc_name = k.replace('npc_', '')
            let newRow = [npc_name];
            newRow[vscripts_index] = `npc/units/dota/${npc_name}.lua`;
            newRow[BaseClass_index] = `npc_dota_creature`;
            for (let npc_key in npcinfo) {
                let value = npcinfo[npc_key];
                switch (typeof value) {
                    case 'string':
                        let index = keyrow.indexOf(npc_key);
                        if (index > -1) {
                            switch (npc_key) {
                                case 'Ability1':
                                case 'Ability2':
                                case 'Ability3':
                                case 'Ability4':
                                case 'Ability5':
                                case 'Ability6':
                                case 'Ability7':
                                case 'Ability8':
                                case 'Ability9':
                                case 'Ability10':
                                case 'Ability11':
                                case 'Ability12':
                                case 'Ability13':
                                case 'Ability14':
                                case 'Ability15':
                                case 'Ability16':
                                case 'Ability17':
                                    if (value != "generic_hidden") {
                                        newRow[index] = npc_key.toLowerCase() + '_' + value;
                                    }
                                    break;
                                default:
                                    newRow[index] = value;
                                    break;
                            }

                        }
                        break
                    case 'object':
                        let start = 0;
                        let allindex = [];
                        let index1 = rows_param[1].indexOf(npc_key, start)
                        while (index1 > -1) {
                            allindex.push(index1)
                            start = index1 + 1;
                            index1 = rows_param[1].indexOf(npc_key, start)
                        }
                        allindex.forEach(
                            (index) => {
                                let trueIndex = rows[0].indexOf(rows_param[0][index])
                                let all_ks = Object.keys(value);
                                switch ((rows_param[2][index])) {
                                    case 'K&':
                                    case 'V&':
                                        let k_str_ = '';
                                        let v_str_ = '';
                                        for (let i = 0; i < all_ks.length; i++) {
                                            k_str_ += all_ks[i];
                                            v_str_ += value[all_ks[i]]
                                            if (i < all_ks.length - 1) {
                                                k_str_ += '\n';
                                                v_str_ += '\n';
                                            };
                                        }
                                        if ((rows_param[2][index]) == 'K&') {
                                            newRow[trueIndex] = k_str_;
                                        }
                                        else {
                                            newRow[trueIndex] = v_str_;
                                        }
                                        break
                                }

                            }
                        )
                        break
                }
            }
            // 饰品数据  默认饰品
            if (shiPinData[k] && shiPinData[k]['default_item']) {
                let shipin = shiPinData[k]['default_item'];
                for (let jj = 0; jj < shipin.length; jj++) {
                    newRow[shipin_index + jj] = shipin[jj]
                }
            }
            rows.push(newRow);
            console.log(k)
        }
    }
    fs.writeFileSync(old_npc_out_path, xlsx.build(sheets))
}


function createAbility() {
    const _str_start = 'npc_dota_hero_';
    const excludehero = ['npc_dota_hero_base'];
    let kv_s = fs.readFileSync(old_npc_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAHeroes;

    let kv_ability = fs.readFileSync(old_ability_path, "utf8");
    let obj_ability = keyvalues.decode(kv_ability);
    let info_ability = obj_ability.DOTAAbilities;
    if (!fs.existsSync(old_ability_out_path)) { return };
    let sheets = xlsx.parse(old_ability_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_ability_out_path)
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    //空两行
    rows.push([])
    let vscripts_index = keyrow.indexOf('ScriptFile');
    let BaseClass_index = keyrow.indexOf('BaseClass');
    for (let k in info) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let npcinfo = info[k];
            for (let npc_key in npcinfo) {
                let value = npcinfo[npc_key];
                switch (npc_key) {
                    case 'Ability1':
                    case 'Ability2':
                    case 'Ability3':
                    case 'Ability4':
                    case 'Ability5':
                    case 'Ability6':
                    case 'Ability7':
                    case 'Ability8':
                    case 'Ability9':
                    case 'Ability10':
                    case 'Ability11':
                    case 'Ability12':
                    case 'Ability13':
                    case 'Ability14':
                    case 'Ability15':
                    case 'Ability16':
                    case 'Ability17':
                        if (value != "generic_hidden") {
                            let abilityname = npc_key.toLowerCase() + '_' + value;
                            let abilityinfo = info_ability[value];
                            if (abilityinfo) {
                                let newRow = [abilityname];
                                newRow[vscripts_index] = `npc/abilities/dota/${k.replace('npc_', '')}/${abilityname}`;
                                newRow[BaseClass_index] = `ability_lua`;
                                for (let ability_k in abilityinfo) {
                                    let ab_info = abilityinfo[ability_k];
                                    switch (typeof ab_info) {
                                        case 'string':
                                            let index = keyrow.indexOf(ability_k);
                                            if (index > -1) {
                                                newRow[index] = ab_info;
                                            }
                                            break
                                        case 'object':
                                            if (ability_k == 'AbilitySpecial') {
                                                for (let index_kk in ab_info) {
                                                    let _kk = index_kk + '>K&';
                                                    let _VV = index_kk + '>V&';
                                                    let _k_str = '';
                                                    let _v_str = ''
                                                    let temp_index_kk = rows_param[2].indexOf(_kk)
                                                    let temp_index_vv = rows_param[2].indexOf(_VV)
                                                    let trueIndex_kk = rows[0].indexOf(rows_param[0][temp_index_kk])
                                                    let trueIndex_vv = rows[0].indexOf(rows_param[0][temp_index_vv])
                                                    let obj_keys = Object.keys(ab_info[index_kk]);
                                                    for (let i = 0; i < obj_keys.length; i++) {
                                                        let trueK = obj_keys[i];
                                                        let temp_v_str = null;
                                                        if (trueK == 'LinkedSpecialBonus' || trueK == 'ad_linked_ability') {
                                                            temp_v_str = ability_name_new_old[ab_info[index_kk][trueK]];
                                                        }
                                                        else {
                                                            temp_v_str = ab_info[index_kk][trueK];
                                                        }
                                                        if (temp_v_str != null) {
                                                            _k_str += trueK
                                                            _v_str += temp_v_str
                                                        }
                                                        if (i < obj_keys.length - 1) {
                                                            _k_str += '\n';
                                                            _v_str += '\n';
                                                        }
                                                    }
                                                    newRow[trueIndex_kk] = _k_str
                                                    newRow[trueIndex_vv] = _v_str
                                                }
                                            }
                                            break
                                    }

                                };
                                rows.push(newRow)
                                console.log(abilityname)
                            }

                        }
                        break;

                }
            }
        }
    }
    fs.writeFileSync(old_ability_out_path, xlsx.build(sheets))
}


function createItem() {
    const _str_start = 'item_';
    const excludehero = [];
    let kv_item = fs.readFileSync(old_item_path, "utf8");
    let obj_item = keyvalues.decode(kv_item);
    let info_item = obj_item.DOTAAbilities;
    if (!fs.existsSync(old_item_out_path)) { return };
    let sheets = xlsx.parse(old_item_out_path);
    if (sheets.length < 2) {
        console.error("缺少参数表:", old_item_out_path)
        return;
    }
    let sheet = sheets[0];
    let rows = sheet.data;
    let nrows = rows.length;
    let keyrow = rows[1];
    let sheet_param = sheets[1];
    let rows_param = sheet_param.data;
    rows.push([])
    let vscripts_index = keyrow.indexOf('ScriptFile');
    let BaseClass_index = keyrow.indexOf('BaseClass');
    for (let k in info_item) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let abilityinfo = info_item[k];
            let itemname = k + '_custom';
            let newRow = [itemname];
            newRow[vscripts_index] = `npc/items/dota/${itemname}`;
            newRow[BaseClass_index] = `item_lua`;
            for (let ability_k in abilityinfo) {
                let ab_info = abilityinfo[ability_k];
                switch (typeof ab_info) {
                    case 'string':
                        let index = keyrow.indexOf(ability_k);
                        if (index > -1) {
                            newRow[index] = ab_info;
                        }
                        break
                    case 'object':
                        if (ability_k == 'AbilitySpecial') {
                            for (let index_kk in ab_info) {
                                let _kk = index_kk + '>K&';
                                let _VV = index_kk + '>V&';
                                let _k_str = '';
                                let _v_str = ''
                                let temp_index_kk = rows_param[2].indexOf(_kk)
                                let temp_index_vv = rows_param[2].indexOf(_VV)
                                let trueIndex_kk = rows[0].indexOf(rows_param[0][temp_index_kk])
                                let trueIndex_vv = rows[0].indexOf(rows_param[0][temp_index_vv])
                                let obj_keys = Object.keys(ab_info[index_kk]);
                                for (let i = 0; i < obj_keys.length; i++) {
                                    let trueK = obj_keys[i]
                                    _k_str += trueK
                                    if (trueK == 'LinkedSpecialBonus' || trueK == 'ad_linked_ability') {
                                        _v_str += ability_name_new_old[ab_info[index_kk][trueK]];
                                    }
                                    else {
                                        _v_str += ab_info[index_kk][trueK];
                                    }
                                    if (i < obj_keys.length - 1) {
                                        _k_str += '\n';
                                        _v_str += '\n';
                                    }
                                }
                                newRow[trueIndex_kk] = _k_str
                                newRow[trueIndex_vv] = _v_str
                            }
                        }
                        else if (ability_k == 'ItemRequirements') {
                            let obj_keys = Object.keys(ab_info);
                            let _k_str = '';
                            let _v_str = '';
                            let trueIndex_kk = rows[0].indexOf('合成需要_k')
                            let trueIndex_vv = rows[0].indexOf('合成需要_v')
                            for (let i = 0; i < obj_keys.length; i++) {
                                let trueK = obj_keys[i]
                                _k_str += trueK;
                                let _tmp_ = []
                                ab_info[trueK].split(';').forEach(
                                    (s) => {
                                        if (s.indexOf('*') > -1) {
                                            _tmp_.push(s.replace('*', '_custom*'))
                                        }
                                        else {
                                            _tmp_.push(s + '_custom')
                                        }
                                    }
                                )
                                _v_str += _tmp_.join(';');
                                if (i < obj_keys.length - 1) {
                                    _k_str += '\n';
                                    _v_str += '\n';
                                }
                            }
                            newRow[trueIndex_kk] = _k_str
                            newRow[trueIndex_vv] = _v_str
                        }
                        break
                }

            };
            rows.push(newRow)
            console.log(itemname)
        }
    }
    fs.writeFileSync(old_item_out_path, xlsx.build(sheets))

}


(async () => {
    var args = process.argv.splice(2)
    readDATA();
    // createNpc()
    // createAbility()
    // createItem()
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
