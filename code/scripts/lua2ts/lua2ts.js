const fs = require('fs-extra');
const path = require('path');
const inputPath = 'scripts/lua2ts/' + '_input.txt';
const outputPath = 'scripts/lua2ts/' + '_output.txt';
const walk = require("walk");
const keyvalues = require('keyvalues-node');

function luatots(content) {
    let r;
    let reg_str;
    reg_str = /--\[\[((.*\n)*?.*?)\]\]/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str);
        let _t = r.exec(ss);
        if (_t) {
            return `/*${_t[1]}*/`
        }
    });
    // 	local tInfo = {
    // 	Ability = self,
    // 	vSpawnOrigin = tHashtable.vStartPosition,
    // 	vVelocity = vDirection * tHashtable.hook_speed,
    // 	fDistance = tHashtable.hook_distance,
    // 	fStartRadius = tHashtable.hook_width,
    // 	fEndRadius = tHashtable.hook_width,
    // 	Source = tHashtable.hCaster,
    // 	iUnitTargetTeam = DOTA_UNIT_TARGET_TEAM_ENEMY,
    // 	iUnitTargetType = DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC,
    // 	iUnitTargetFlags = DOTA_UNIT_TARGET_FLAG_NONE,
    // 	ExtraData = {
    // 		hashtable_index = GetHashtableIndex(tHashtable),
    // 	}
    // }
    let _info = [];
    reg_str = /\b\w+\n*\t*\s*[=|,|\(]\s*{/g;
    content = content.replace(reg_str, (...ss) => {
        let startIndex = ss[ss.length - 2] + ss[0].length - 1;
        let index = startIndex;
        let count = 0;
        while (true) {
            let _ss = content.substr(index, 1)
            if (_ss == '{') {
                count += 1
            }
            else if (_ss == '}') {
                count -= 1
            }
            index += 1;
            if (_ss == '}' && count == 0) {
                break;
            }
        }
        let substr = content.substr(startIndex, index - startIndex);
        substr = substr.replace(/=/g, ':')
        _info.push([startIndex, index, substr])
        // content = content.substr(0, startIndex) + substr + content.substr(index);
        return ss[0]
    });
    reg_str = /\b\w+\s*=\s*{/g;
    content = content.replace(reg_str, (...ss) => {
        let startIndex = ss[ss.length - 2] + ss[0].length - 1;
        let index = startIndex;
        let count = 0;
        while (true) {
            let _ss = content.substr(index, 1)
            if (_ss == '{') {
                count += 1
            }
            else if (_ss == '}') {
                count -= 1
            }
            index += 1;
            if (_ss == '}' && count == 0) {
                break;
            }
        }
        let substr = content.substr(startIndex, index - startIndex);
        substr = substr.replace(/=/g, ':')
        _info.push([startIndex, index, substr])
        // content = content.substr(0, startIndex) + substr + content.substr(index);
        return ss[0]
    });
    for (let i of _info) {
        let startIndex = i[0];
        let index = i[1];
        let substr = i[2];
        content = content.substr(0, startIndex) + substr + content.substr(index);
    }

    content = content.replace(/--/g, "// ");
    // //  and / or / not / .. / ~= / //
    content = content.replace(/\n\t*\band\b/g, "&&");
    content = content.replace(/\sand\s/g, " && ");
    content = content.replace(/\n\t*\bor\b/g, "||");
    content = content.replace(/\sor\s/g, " || ");
    content = content.replace(/\bnot /g, "!");
    content = content.replace(/\.\./g, "+");
    content = content.replace(/~=/g, "!=");
    reg_str = /#((\w|\.)*)/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str);
        let _t = r.exec(ss);
        if (_t) {
            return `${_t[1]}.length`
        }
    });
    //  if / then / else
    content = content.replace(/\bif\b/g, "if (");
    content = content.replace(/\bthen\b/g, ") {");
    content = content.replace(/\belse\b/g, "} else {");
    content = content.replace(/\bend\b/g, "}");
    content = content.replace(/\belseif/g, "} else if (");
    //  : -> .
    content = content.replace(/\b\:\b/g, ".");
    //  local -> let
    content = content.replace(/\blocal\b/g, "let");

    // function
    reg_str = /\bfunction\s+(\w+)\s*\.\s*(\w+)\s*\((.*)\)/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str)
        let _t = r.exec(ss);
        if (_t) {
            return ` ${_t[2]}(${_t[3]}) {`
        }
    }
    );
    // 匿名函数
    reg_str = /\bfunction\s*\((.*)\)/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str)
        let _t = r.exec(ss);
        if (_t) {
            return ` (${_t[1]}) => {`
        }
    }
    );

    // ():
    reg_str = /\)\s*:\s*(\w)/g;
    content = content.replace(reg_str, (ss) => {
        return ss.replace(':', '.')
    }
    );
    // for i = tHashtable.tVictim.length, 1, -1 do
    reg_str = /\bfor\s+(\S+)\s*=\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s+do\b/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str)
        let _t = r.exec(ss);
        if (_t) {
            if (_t[4] == '1') {
                return `for (let ${_t[1]} = ${_t[2]}; ${_t[1]} <= ${_t[3]}; ${_t[1]}++) {`
            }
            else if (_t[4] == '-1') {
                return `for (let ${_t[1]} = ${_t[2]}; ${_t[1]} >= ${_t[3]}; ${_t[1]}--) {`
            }
        }
    }
    );
    //  for i = 0, extra_count - 1 do
    reg_str = /\bfor\s+(\w+)\s*=\s*(\w+),\s*(.+)\s*do\b/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str)
        let _t = r.exec(ss);
        if (_t) {
            return `for (let ${_t[1]} = ${_t[2]}; ${_t[1]} <= ${_t[3]}; ${_t[1]}++) {`
        }
    });
    //  for _, v in ipairs|pairs
    reg_str = /\bfor\s+(_)\s*,\s*(\w+)\s+in\s+(ipairs|pairs)\s*\(([\w._\(\)]+)\)\s+do\b/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str)
        let _t = r.exec(ss);
        if (_t) {
            return `for (let ${_t[2]} of ( ${_t[4]} )) {\n`
        }
    });
    //  for k, _ in ipairs|pairs
    reg_str = /\bfor\s+(\w+)\s*,\s*(_)\s+in\s+(ipairs|pairs)\s*\(([\w._\(\)]+)\)\s+do\b/g;
    content = content.replace(
        reg_str,
        (ss) => {
            r = new RegExp(reg_str)
            let _t = r.exec(ss);
            if (_t) {
                return `for (let ii of Object.keys( ${_t[4]})){`
            }
        }
    );
    //  for ipairs|pairs
    reg_str = /\bfor\s+(\w+)\s*,\s*(\w+)\s+in\s+(ipairs|pairs)\s*\(([\w._\(\)]+)\)\s+do\b/g;
    content = content.replace(
        reg_str,
        (ss) => {
            r = new RegExp(reg_str)
            let _t = r.exec(ss);
            if (_t) {
                return `for (let ${_t[2]} of ( ${_t[4]})) {\n\t \n`
            }
        }
    );
    //  while xxx do
    reg_str = /\bwhile\s+(.+)\s+do\b/g;
    content = content.replace(
        reg_str,
        (ss) => {
            r = new RegExp(reg_str)
            let _t = r.exec(ss);
            if (_t) {
                return `while ( ${_t[1]} ){ `
            }
        }
    );
    //  nil -> null
    content = content.replace(/\bnil\b/g, "null");
    //  self -> this
    content = content.replace(/\bself\b/g, "this");
    //  print -> console.log
    // content = content.replace(/\bprint\b/g, "LogHelper.print");
    //  class.new(params) -> new class(params)
    reg_str = /\b(\w+)\s*.\s*new\s*\(/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str)
        let _t = r.exec(ss);
        if (_t) {
            return `new ${_t[1]}(`
        }
    });
    return content
}

function todota2ts(content) {
    let r;
    let reg_str;

    content = content.replace(/\bSpawner.FindMissingInRadius\(/g, "AoiHelper.FindEntityInRadius(");
    content = content.replace(/\bFindUnitsInRadiusByModifierName\(/g, "AoiHelper.FindUnitsInRadiusByModifierName(");
    content = content.replace(/\bGetAOEMostTargetsPosition\(/g, "AoiHelper.GetAOEMostTargetsPosition(");
    content = content.replace(/\bAssetModifiers./g, "ResHelper.");
    content = content.replace(/\bApplyDamage/g, "BattleHelper.GoApplyDamage");
    content = content.replace(/GetAbilitySpecialValueFor/g, "GetSpecialValueFor");
    content = content.replace(/\.GetParent\(\)/g, ".GetParentPlus()");
    content = content.replace(/\.GetCaster\(\)/g, ".GetCasterPlus()");
    content = content.replace(/\.GetAbility\(\)/g, ".GetAbilityPlus()");
    content = content.replace(/DOTA_UNIT_TARGET_FLAG_/g, "DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_");
    content = content.replace(/DOTA_UNIT_TARGET_TEAM_/g, "DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_");
    content = content.replace(/FIND_ANY_ORDER/g, "FindOrder.FIND_ANY_ORDER");
    content = content.replace(/FIND_CLOSEST/g, "FindOrder.FIND_CLOSEST");
    content = content.replace(/FIND_FARTHEST/g, "FindOrder.FIND_FARTHEST");
    content = content.replace(/GetValidTalentValue/g, "GetTalentValue");
    content = content.replace(/\(params\)/g, "(params: ModifierTable)");
    content = content.replace(/\bMODIFIER_PROPERTY_/g, "@registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.");
    content = content.replace(/\MODIFIER_EVENT_/g, "@registerEvent(Enum_MODIFIER_EVENT.");
    content = content.replace(/\bEOM_MODIFIER_PROPERTY_/g, "@registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.");
    content = content.replace(/\bGetModifier/g, "Get");
    content = content.replace(/\bUF_SUCCESS/g, " UnitFilterResult.UF_SUCCESS");
    content = content.replace(/\bLOCAL_PARTICLE_MODIFIER_DURATION/g, " BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION");
    content = content.replace(/\bPRD/g, " GameFunc.mathUtil.PRD");
    content = content.replace(/\(iLevel\)/g, "(iLevel:number)");
    content = content.replace(/\(hTarget\)\n/g, "(hTarget:BaseNpc_Plus)\n");
    content = content.replace(/\(hTarget, vLocation, ExtraData\)/g, "(hTarget:BaseNpc_Plus, vLocation:Vector, ExtraData:any)");
    content = content.replace(/\(me, dt\)/g, "(me:BaseNpc_Plus, dt:number)");
    content = content.replace(/\] = true/g, "] : true");
    content = content.replace(/\] = false/g, "] : false");

    content = content.replace(/DOTA_UNIT_TARGET_[^FT]/g,
        (ss) => {
            return "DOTA_UNIT_TARGET_TYPE." + ss;
        }
    );
    content = content.replace(/([^\.])PATTACH_/g, (...ss) => {
        return ss[1] + "ParticleAttachment_t.PATTACH_"
    });
    content = content.replace(/([^\.])EF_NODRAW\b/g,
        (...ss) => {
            return ss[1] + "EntityEffects.EF_NODRAW"
        });
    content = content.replace(/([^\.])ACT_/g,
        (...ss) => {
            return ss[1] + "GameActivity_t.ACT_"
        }
    );
    content = content.replace(/([^\.])DOTA_UNIT_ORDER_/g,
        (...ss) => {
            return ss[1] + "dotaunitorder_t.DOTA_UNIT_ORDER_"
        }
    );
    content = content.replace(/([^\.])MODIFIER_STATE_/g,
        (...ss) => {
            return ss[1] + "modifierstate.MODIFIER_STATE_"
        }
    );
    content = content.replace(/([^\.])IsValid\(/g,
        (...ss) => {
            return ss[1] + "GameFunc.IsValid("
        }
    );
    content = content.replace(/([^\.])IsValidTalent\(/g,
        (...ss) => {
            return ss[1] + "EntityHelper.HasTalent("
        }
    );
    content = content.replace(/([^\.])MODIFIER_ATTRIBUTE_/g,
        (...ss) => {
            return ss[1] + "DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_"
        }
    );
    content = content.replace(/([^\.])DAMAGE_TYPE_/g,
        (...ss) => {
            return ss[1] + "DAMAGE_TYPES.DAMAGE_TYPE_"
        }
    );
    content = content.replace(/([^\.])EOM_DAMAGE_FLAG_/g,
        (...ss) => {
            return ss[1] + "BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_"
        }
    );
    content = content.replace(/([^\.])DOTA_DAMAGE_FLAG_/g,
        (...ss) => {
            return ss[1] + "DOTADamageFlag_t.DOTA_DAMAGE_FLAG_"
        }
    );
    content = content.replace(/([^\.])OVERHEAD_ALERT_/g,
        (...ss) => {
            return ss[1] + "DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_"
        }
    );
    content = content.replace(/([^\.])AI_TIMER_TICK_TIME_HERO/g,
        (...ss) => {
            return ss[1] + "GameSetting.AI_TIMER_TICK_TIME_HERO"
        }
    );
    content = content.replace(/([^\.])ATTACK_STATE_/g,
        (...ss) => {
            return ss[1] + "BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_"
        }
    );
    content = content.replace(/([^\.])DOTA_ABILITY_BEHAVIOR_/g,
        (...ss) => {
            return ss[1] + "DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_"
        }
    );
    // modifier_windrunner_3
    // @registerModifier()
    // export class modifier_windrunner_3 extends BaseModifier_Plus {
    content = content.replace(/\n(.*) = eom_modifier\({}\)/g,
        (...ss) => {
            return '\n@registerModifier()\n' + 'export class ' + ss[1] + " extends BaseModifier_Plus {"
        }
    );
    content = content.replace(/\n(.*) = eom_modifier\({}, null, ParticleModifier\(\)\)/g,
        (...ss) => {
            return '\n@registerModifier()\n' + 'export class ' + ss[1] + " extends modifier_particle {"
        }
    );
    content = content.replace(/\n(.*) = eom_modifier\({}, null, ParticleModifierThinker\(\)\)/g,
        (...ss) => {
            return '\n@registerModifier()\n' + 'export class ' + ss[1] + " extends modifier_particle_thinker {"
        }
    );

    content = content.replace(/\bthis\.BaseClass/g, "super");
    content = content.replace(/\[1\]/g, "[0]");
    content = content.replace(/\(vLocation, hTarget\)/g, "(vLocation:Vector, hTarget:BaseNpc_Plus)");
    content = content.replace(/\(hTarget, vLocation\)/g, "(hTarget:BaseNpc_Plus, vLocation:Vector)");


    return content
}

function tots() {
    let str = fs.readFileSync(inputPath, { encoding: "utf8" });
    let out_str = luatots(str);
    out_str = todota2ts(out_str);
    fs.writeFileSync(outputPath, out_str, { encoding: "utf8" });
}


const filepath = 'game/scripts/tscripts/npc/abilities/dota';
const walker = walk.walk(filepath);

// ParticleManager.CreateParticle(
function dealts(content) {
    let r;
    let reg_str;
    reg_str = /\bParticleManager.CreateParticle\((.+)/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str);
        let _t = r.exec(ss);
        if (_t && _t[1]) {
            let s = _t[1].substr(0, _t[1].length - 1);
            s = s.replace('ResHelper.GetParticleReplacement(', '').replace('),', ',');
            let s_arr = s.split(',')
            console.log(s)
            if (s_arr.length == 4) {
                return `ResHelper.CreateParticle({
                    resPath: ${s_arr[0]},
                    resNpc:  ${s_arr[1]},
                    iAttachment:  ${s_arr[2]},
                    owner: ${s_arr[3]}
                });\n`
            }
            else if (s_arr.length == 3) {
                return `ResHelper.CreateParticle({
                    resPath: ${s_arr[0]},
                    resNpc: null,
                    iAttachment:  ${s_arr[1]},
                    owner: ${s_arr[2]}
                });\n`
            }
            else {
                throw new Error('arr is err: ' + ss)
            }
        }
    });
    return content
}
// hCaster.AddNewModifier(hCaster, this, "modifier_brewmaster_6_buff", { duration: duration })
function dealts_2(content) {
    let r;
    let reg_str;
    reg_str = /\b(.+)\.AddNewModifier\((.+)/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str);
        let _t = r.exec(ss);
        if (_t && _t[1]) {
            console.log(_t)
            let s = _t[2]
            let s_arr = s.split(',')
            // if (s_arr[2].indexOf('"') == -1 && s_arr[2].indexOf("'") == -1) {
            //     throw new Error('arr is err: ' + ss)
            // }
            let m = s_arr[2].replace(/"/g, "").replace(/'/g, "");
            if (_t[1].indexOf('=') == -1) {
                return `${m}.apply( ${_t[1]} , ${s.replace(s_arr[2] + ',', '')} `
            }
            else {
                let sss_arr = _t[1].split('=');
                return `${sss_arr[0]} = ${m}.apply( ${sss_arr[1]} , ${s.replace(s_arr[2] + ',', '')} `
            }
            // let s = _t[1].substr(0, _t[1].length - 1);
            // s = s.replace('ResHelper.GetParticleReplacement(', '').replace('),', ',');
            // let s_arr = s.split(',')
            // console.log(s)
            // if (s_arr.length == 4) {
            //     return `ResHelper.CreateParticle({
            //         resPath: ${s_arr[0]},
            //         resNpc:  ${s_arr[1]},
            //         iAttachment:  ${s_arr[2]},
            //         owner: ${s_arr[3]}
            //     });\n`
            // }
            // else if (s_arr.length == 3) {
            //     return `ResHelper.CreateParticle({
            //         resPath: ${s_arr[0]},
            //         resNpc: null,
            //         iAttachment:  ${s_arr[1]},
            //         owner: ${s_arr[2]}
            //     });\n`
            // }
            // else {
            //     throw new Error('arr is err: ' + ss)
            // }
        }
    });
    return content
}
// let hAbility1 = hCaster.FindAbilityByName("abyssal_underlord_1")
// let hModifier1 = hCaster.FindModifierByName("modifier_clinkz_1_buff")
// caster.RemoveModifierByName("modifier_monkey_king_1_buff")
// if (hCaster.HasModifier("modifier_night_stalker_2_form")) {

function dealts_3(content) {
    let r;
    let reg_str;
    reg_str = /\bif \((.+)\.HasModifier\((.+)/g;
    content = content.replace(reg_str, (ss) => {
        r = new RegExp(reg_str);
        let _t = r.exec(ss);
        if (_t && _t[1]) {
            console.log(_t)
            let s = _t[2]
            let s_index = s.indexOf(')')
            let substr1 = s.substring(0, s_index);
            let substr2 = s.substring(s_index);
            // if (s_arr[2].indexOf('"') == -1 && s_arr[2].indexOf("'") == -1) {
            // }
            let ssss;
            let m = substr1.replace(/"/g, "").replace(/'/g, "");
            if (_t[1].indexOf('&&') != -1) {
                let _t_arr = _t[1].split('&&');
                let target = _t_arr[_t_arr.length - 1];
                if (target.indexOf('!') == -1) {
                    ssss = `if ( ${_t[1].replace(target, '')} ${m}.exist( ${target} `
                }
                else {
                    ssss = `if ( ${_t[1].replace(target, '')} !${m}.exist( ${target[1].replace('!', '')} `
                }

                if (substr2) {
                    ssss += substr2
                }
                console.log(ssss)
                return ssss
            }
            else {
                if (_t[1].indexOf('!') == -1) {
                    ssss = `if ( ${m}.exist( ${_t[1]} `
                }
                else {
                    ssss = `if (! ${m}.exist( ${_t[1].replace('!', '')} `
                }
                if (substr2) {
                    ssss += substr2
                }
                console.log(ssss)
                return ssss
            }

        }
    });
    return content
}
// OnCreated(params: ModifierTable) {
function dealts_4(content) {
    let reg_str;
    reg_str = /OnCreated\(params: ModifierTable\) {\r\n(.+)\r\n/g;
    content = content.replace(reg_str, (ss) => {
        let r = new RegExp(reg_str);
        let _t = r.exec(ss);
        if (_t && _t[1]) {
            console.log(_t[1])
            if (_t[1].indexOf('super') == -1) {
                return _t[0].replace(_t[1], '        super.OnCreated(params);\n' + _t[1])
            }
            else {
                return _t[0]
            }
        }
    });
    let reg_str2 = /OnRefresh\(params: ModifierTable\) {\r\n(.+)\r\n/g;
    content = content.replace(reg_str2, (ss) => {
        let r = new RegExp(reg_str2);
        let _t = r.exec(ss);
        if (_t && _t[1]) {
            console.log(_t[1])
            if (_t[1].indexOf('super') == -1) {
                return _t[0].replace(_t[1], '        super.OnRefresh(params);\n' + _t[1])
            }
            else {
                return _t[0]
            }
        }
    });
    let reg_str3 = /OnDestroy\(\) {\r\n(.+)\r\n/g;
    content = content.replace(reg_str3, (ss) => {
        let r = new RegExp(reg_str3);
        let _t = r.exec(ss);
        if (_t && _t[1]) {
            console.log(_t[1])
            if (_t[1].indexOf('super') == -1) {
                return _t[0].replace(_t[1], '        super.OnDestroy();\n' + _t[1])
            }
            else {
                return _t[0]
            }
        }
    });
    return content
}

let kvConfig;
const walker2 = walk.walk('game/scripts/tmp');
function GetConfig() {
    if (kvConfig == null) {
        kvConfig = {}
        walker2.on("file", (root, fileStats, next) => {
            const fileName = path.join(root, fileStats.name);
            let data = keyvalues.decode(fs.readFileSync(fileName, 'utf-8'));
            for (let k in data) {
                for (let kk in data[k]) {
                    kvConfig[kk] = data[k][kk];
                }
            }
            next()
        });
        walker2.on('end', () => {
            changets()
            // console.log(kvConfig)
        })
    }
    else {
        changets()
    }
}

function dealts_5(root, filename, content) {
    content = content.replace(/\bInit\(\) {/g, "Init_old() {");

    // kvConfig = kvConfig || keyvalues.decode(fs.readFileSync('game/scripts/heroes_abilities.kv', 'utf-8')).KeyValue;
    let ssssss = filename.split('_')[0]
    if (ssssss != "ability1" && ssssss != "ability2" && ssssss != "ability3" && ssssss != "ability6") { return };
    let root_arr = root.split('\\');
    let hero_name = root_arr[root_arr.length - 1].replace('dota_hero_', '').replace('dota_unit_', '');
    let key;
    switch (ssssss) {
        case 'ability1':
            key = hero_name + '_1'
            break;
        case 'ability2':
            key = hero_name + '_2'
            break
        case 'ability3':
            key = hero_name + '_4'
            break
        case 'ability6':
            key = hero_name + '_3'
            break
    };
    if (key && kvConfig[key]) {
        let spv = kvConfig[key]['AbilitySpecial'];
        let r_str = '';
        for (let k in spv) {
            let v = spv[k];
            delete v["var_type"]
            let kk_arr = Object.keys(v);
            let kk = kk_arr[0];
            let vv = v[kk];
            if (vv.indexOf(' ') > -1) {
                let vv_str = vv.replace(/ /g, ',');
                vv = `[${vv_str}]`
            }
            else {
                vv = Number(vv)
            }
            r_str += `        this.SetDefaultSpecialValue("${kk}", ${vv});\n`
        }
        let rr_str = `\n    Init() {
        ${r_str}
        }\n`
        let reg_str;
        reg_str = /__IN_DOTA_DATA__: typeof (.+)/g;
        content = content.replace(reg_str, (ss) => {
            let r = new RegExp(reg_str);
            let _t = r.exec(ss);
            if (_t && _t[0]) {
                if (r_str.length > 0) {
                    console.log(rr_str)
                    return _t[0] + rr_str
                }
                else {
                    return _t[0]
                }
            }
        })
    }
    return content

}
function changets() {
    let n = 0
    walker.on("file", (root, fileStats, next) => {
        const fileName = path.join(root, fileStats.name);
        let str = fs.readFileSync(fileName, { encoding: "utf8" });
        let out_str = dealts_5(root, fileStats.name, str);
        // n += 1
        out_str && fs.writeFileSync(fileName, out_str, { encoding: "utf8" });
        console.log('finish =>  ' + fileStats.name)
        if (n < 60) {
            next()
        }
    });

    walker.on('end', async () => {
    })
}

(async () => {
    tots()
    // GetConfig()
    // changets()
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
