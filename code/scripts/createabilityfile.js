const fs = require('fs-extra');
const keyvalues = require('keyvalues-node');
const old_npc_path = 'game/scripts/dota2_old_npc_heroes.txt';
const old_ability_path = 'game/scripts/dota2_old_npc_abilities.txt';
const old_item_path = 'game/scripts/dota2_old_npc_items.txt';
const building_item_path = 'game/scripts/npc/building/building_item_card.kv';

const ts_path = 'game/scripts/tscripts/npc/abilities/dota/';
const unit_path = 'game/scripts/tscripts/npc/units/dota';
const item_path = 'game/scripts/tscripts/npc/items/dota';
const building_item_ts_path = 'game/scripts/tscripts/npc/items/building';
const unit_item_path = 'game/scripts/tscripts/npc/items/building'

function main() {
    let kv_s = fs.readFileSync(old_npc_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAHeroes;
    let kv_ability = fs.readFileSync(old_ability_path, "utf8");
    let obj_ability = keyvalues.decode(kv_ability);
    let info_ability = obj_ability.DOTAAbilities;
    const _str_start = 'npc_dota_hero_';
    const excludehero = ['npc_dota_hero_base'];
    const file_str = `
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const $0 = $1 ;

@registerAbility()
export class $2 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "$3";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof $0 = $0 ;
}
    `;

    const unit_file_str = `
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

/** dota原英雄数据 */
export const Data_$1 = $0 ;

@registerUnit()
export class $1 extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        PrecacheHelper.precachResByKV(entityKeyValues);
        this.__IN_DOTA_NAME__ = "npc_$1";
        this.__IN_DOTA_DATA__ = Data_$1;
    }
}

    `;

    const unit_item_file_str = `
import { registerAbility } from "../../entityPlus/Base_Plus";
import { item_buildingBase } from "./item_buildingBase";

@registerAbility()
export class $1 extends item_buildingBase {
}
    `

    // 名称枚举
    let enumstr1 = '';
    // 英雄id枚举
    let enumstr2 = '';

    if (!fs.existsSync(unit_path)) fs.mkdirSync(unit_path);
    for (let k in info) {
        if (k.indexOf(_str_start) > -1 && excludehero.indexOf(k) == -1) {
            let dirName = ts_path + k.replace('npc_', '');
            if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);
            for (let i = 1; i <= 25; i++) {
                let abilitykey = 'Ability' + i;
                let Ability = info[k][abilitykey];
                if (Ability && Ability != 'generic_hidden') {
                    let fileName = 'ability' + i + '_' + Ability;
                    let filepath = dirName + '/' + fileName + '.ts';
                    let DataName = 'Data_' + Ability;
                    if (!fs.existsSync(filepath)) {
                        let str_ = file_str.replace('$2', fileName);
                        str_ = str_.replace(/\$0/g, DataName);
                        str_ = str_.replace(/\$3/g, Ability);
                        str_ = str_.replace('$1', JSON.stringify(info_ability[Ability] || {}));
                        fs.writeFileSync(filepath, str_)
                    }
                }
            };
            let _unit_file_name = k.replace('npc_', '');
            let unit_file_path = unit_path + '/' + _unit_file_name + '.ts';
            if (!fs.existsSync(unit_file_path)) {
                let str_1 = unit_file_str.replace(/\$1/g, _unit_file_name);
                str_1 = str_1.replace('$0', JSON.stringify(info[k] || {}));
                fs.writeFileSync(unit_file_path, str_1)
            }
            let _unit_item_name = k.replace(_str_start, 'item_building_');
            let unit_item_file_path = unit_item_path + '/' + _unit_item_name + '.ts';
            if (!fs.existsSync(unit_item_file_path)) {
                let str_2 = unit_item_file_str.replace(/\$1/g, _unit_item_name);
                fs.writeFileSync(unit_item_file_path, str_2)
            }
            // 枚举
            enumstr1 += `${k.replace(_str_start, '')} = "${k}" ,\n`;
            enumstr2 += `${k.replace(_str_start, '')} = ${info[k]['HeroID']} ,\n`;
            console.log(k + ' create file finish  ')
        }
        // 生成枚举文件
        let enum_file_path = unit_path + '/enum_out.ts';
        let enum_out_str = `
        export enum enum_HeroName {
            ${enumstr1}
         };

         export enum enum_HeroID {
            ${enumstr2}
        };

         `
        fs.writeFileSync(enum_file_path, enum_out_str)

    }
}

function itemCreate() {
    let kv_s = fs.readFileSync(old_item_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.DOTAAbilities;
    const _str_start = 'item_';
    const unit_file_str = `
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_$1 = $0 ;

@registerAbility()
export class $1 extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "$3";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_$1 = Data_$1 ;
};

    `
    if (!fs.existsSync(item_path)) fs.mkdirSync(item_path);
    let txt_itemname = '';
    for (let k in info) {
        if (k.indexOf(_str_start) > -1) {
            let _item_file_name = k + '_custom';
            let unit_file_path = item_path + '/' + _item_file_name + '.ts';
            txt_itemname += k + '\n';
            if (!fs.existsSync(unit_file_path)) {
                let str_1 = unit_file_str.replace(/\$1/g, _item_file_name);
                str_1 = str_1.replace('$0', JSON.stringify(info[k] || {}));
                str_1 = str_1.replace('$3', k);
                fs.writeFileSync(unit_file_path, str_1);
                console.log(k + ' create finish')
            }
        }
    }
    let txtpath = item_path + '/txt_itemname.txt';
    fs.writeFileSync(txtpath, txt_itemname);

}

function itembuildingCreate() {
    let kv_s = fs.readFileSync(building_item_path, "utf8");
    let obj = keyvalues.decode(kv_s);
    let info = obj.building_item_card;
    const _str_start = 'item_';
    const unit_file_str = `
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { item_building_base } from "./item_building_base";

@registerAbility()
export class $1 extends item_building_base {
};
    `
    if (!fs.existsSync(building_item_ts_path)) fs.mkdirSync(building_item_ts_path);
    // let txt_itemname = '';
    for (let k in info) {
        if (k.indexOf(_str_start) > -1) {
            let _item_file_name = k ;
            let unit_file_path = building_item_ts_path + '/' + _item_file_name + '.ts';
            // txt_itemname += k + '\n';
            if (!fs.existsSync(unit_file_path)) {
                let str_1 = unit_file_str.replace(/\$1/g, _item_file_name);
                // str_1 = str_1.replace('$0', JSON.stringify(info[k] || {}));
                // str_1 = str_1.replace('$3', k);
                fs.writeFileSync(unit_file_path, str_1);
                console.log(k + ' create finish')
            }
        }
    }
    // let txtpath = item_path + '/txt_itemname.txt';
    // fs.writeFileSync(txtpath, txt_itemname);

}


(async () => {
    // main();
    itembuildingCreate();
})().catch((error) => {
    console.error(error);
    process.exit(1);
});