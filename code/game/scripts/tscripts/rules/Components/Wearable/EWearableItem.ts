import { GameFunc } from "../../../GameFunc";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { WearableConfig } from "../../System/Wearable/WearableConfig";
import { WearableComponent } from "./WearableComponent";

@registerET()
export class EWearableItem extends ET.Entity {
    bundleId: string;
    readonly itemDef: string;
    style: string;
    model?: CBaseModelEntity;
    particles: { [k: string]: ParticleID };
    additional_wearable?: CBaseModelEntity[];
    default_projectile?: string;
    replace_particle_names?: { [k: string]: any };
    model_modifiers?: any[];
    bChangeSkin?: boolean;
    bChangeSummon?: { [k: string]: any };
    bChangeScale?: boolean;
    bActivity?: boolean;
    bPersona?: boolean;
    onAwake(itemDef: string) {
        (this.itemDef as any) = itemDef;
    }

    getSlot() {
        let comp = this.GetParent<WearableComponent>();
        let config = comp.GetWearConfig(this.itemDef);
        if (config.item_slot && config.item_slot.length > 0) {
            return config.item_slot;
        }
        return WearableConfig.EWearableType.weapon;
    }

    FindModelEntity(modelName: string) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let model = domain.FirstMoveChild() as CBaseModelEntity;
        while (model != null) {
            //  确保获取到的是 dota_item_wearable 的模型
            if (model != null && model.GetClassname() == "dota_item_wearable") {
                if (model.GetModelName() == modelName) {
                    return model;
                }
            }
            //  获取下一个模型
            model = model.NextMovePeer() as CBaseModelEntity;
        }
        return null;
    }
    GetPropClass(sItemDef: string) {
        if (sItemDef == "4810") {
            //  蝙蝠不良头巾需要物理
            return "prop_physics";
        }
        return "prop_dynamic";
    }

    //  修复替换型的特殊周身特效
    SpecialFixParticles(sItemDef: string, hWear: WearableConfig.IUnitWearSlotInfo, sSlotName: string, sStyle: string = null) {
        if (sItemDef == "12588") {
            let particle_name = "particles/econ/items/lanaya/princess_loulan/princess_loulan_weapon.vpcf";
            this.AddParticle(hWear, particle_name, sSlotName, sStyle);
        }
    }
    SpecialFixAnim(sItemDef: string) {
        switch (sItemDef) {
            //  修复猛犸凶残螺旋战盔动作
            case "9972":
            //  修复萨尔不朽武器
            case "12412":
            //  修复军团不朽战棋
            case "7930":
            //  修复沉默不朽武器
            case "12414":
            //  修复灵象硝骑
            case "13530":
            case "13527":
            //  修复骨法不朽武器
            case "12955":
            //  修复伐木机不朽武器
            case "7581":
            //  修复伐木机不朽盘子
            case "12927":
            case "13523":
            //  修复冰魂不朽肩
            case "9462":
            //  修复戴泽花月法杖
            case "12977":
            //  修复拉比克虚幻之镜法杖
            case "13266":
            //  修复尸王蠕行藤曼护体动作
            case "13483":
            //  修复帕克不朽翅膀动作
            case "13767":
            //  修复修补匠不朽右臂动作
            case "13777":
            //  修复美杜莎不朽尾巴动作
            case "13778":
            //  修复屠夫千劫神勾动作
            case "13788":
            //  修复赏金不仁之猎-飞禽动作
            case "14283":
            //  修复先知神明之印动作
            case "14277":
            //  修复术士烈影之铭动作
            case "12956":
            //  修复飞机不朽导弹动作
            case "14967":
            //  修复神谕不朽头动作
            case "14954":
            //  修复发条不朽武器动作
            case "14992":
            //  修复术士流放到感恩动作
            case "14000":
            case "13998":
            //  修复冰魂释放天启动作
            case "14163":
            case "14165":
            //  修复冥魂大帝不朽武器
            case "9747":
            case "12424":
            //  修复编织者不朽触角
            case "7810":
            case "7813":
            //  修复帕格纳不朽头
            case "13755":
            case "14965":
            //  修复主宰至宝动作 其他动作还没支持
            case "9059":
            //  修复小精灵至宝动作 其他动作还没支持
            case "9235":
            //  修复虚空不朽武器动作 其他动作还没支持
            case "7571":
            //  修复海民不朽企鹅动作 其他动作还没支持
            case "7375":
            //  修复血魔不朽头动作 其他动作还没支持
            case "9241":
            //  修复沙王不朽手臂动作 其他动作还没支持
            case "7809":
            //  修复大树不朽动作 其他动作还没支持
            case "9196":
            case "9452":
            //  修复猛犸凶残螺旋长角动作 其他动作还没支持
            case "9971":
            //  修复猛犸凶残螺钻铁槌动作 其他动作还没支持
            case "9970":
            //  修复蓝胖不朽背部动作 其他动作还没支持
            case "7910":
            //  修复巫妖邪会仪式意念动作 其他动作还没支持
            case "12792":
            //  修复巫妖不朽武器动作 其他动作还没支持
            case "9756":
            //  修复死灵法不朽武器动作 其他动作还没支持
            case "9089":
            //  修复大树霜褐影匿庇护
            case "9704":
            //  修复熊战士北辰灭世
            case "14944":
            //  修复天怒天神之秘武器动作
            case "13933":
            //  修复谜团无限进化护甲动作
            case "14750":
            //  修复光法盗贼之王动作
            case "14449":
            case "14451":
            //  修复末日不朽手臂动作 其他动作还没支持 会随机出现受伤状态bug
            case "9741":
            //  修复死灵法不朽肩部动作 其他动作还没支持
            case "7427":
            case "7508":
            //  修复屠夫不朽勾 其他动作还没支持 会随机出现受伤状态bug
            case "8004":
            case "8038":
            case "8010":
            //  修复黑鸟不朽武器 其他动作还没支持
            case "7509":
            case "8376":
            //  修复黑贤不朽手臂 其他动作还没支持
            case "9740":
            case "12299":
            //  修复幽鬼至宝
            case "9662":
            //  修复大牛不朽武器
            case "14242":
            //  巫医孢父健步
            case "19155":
            case "19152":
            //  飞机玄奥逆变
            case "18979":
            case "18974":
            //  先知大漠奇花
            case "14900":
            //  修复潮汐背部不朽
            case "14960":
            case "19023":
                return "GameActivity_t.ACT_DOTA_IDLE";
        }
        let comp = this.GetParent<WearableComponent>();
        switch (comp.sHeroName) {
            //  修复神灵投矛 其他动作还没支持
            case "npc_dota_hero_huskar":
            //  修复小鹿投矛 其他动作还没支持
            case "npc_dota_hero_enchantress":
                // if (this.GetSlotName(sItemDef) == "weapon") {
                //     return "GameActivity_t.ACT_DOTA_IDLE";
                // }
                break;
        }
        return null;
    }

    AddParticle(hWear: WearableConfig.IUnitWearSlotInfo, particle_name: string, sSlotName: string, sStyle: string = null) {
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        let wearSys = GameRules.Addon.ETRoot.WearableSystem();
        let attach_type = ParticleAttachment_t.PATTACH_CUSTOMORIGIN;
        let attach_entity = hUnit as CBaseEntity;
        if (hWear && hWear.model) {
            attach_entity = hWear.model;
        }
        let p_table = wearSys.AllcontrolPoints[particle_name];
        if (p_table) {
            if (p_table.attach_type) {
                attach_type = WearableConfig.EWearableAttach[p_table.attach_type] as any;
            }
            if (p_table.attach_entity == "parent") {
                attach_entity = hUnit;
            }
        }
        let p = ParticleManager.CreateParticle(particle_name, attach_type, attach_entity);
        if (p_table && p_table["control_points"]) {
            let cps: { [K: string]: any } = p_table["control_points"];
            for (let cp_table of Object.values(cps)) {
                if (!cp_table.style || tostring(cp_table.style) == sStyle) {
                    let control_point_index = cp_table.control_point_index;
                    if (cp_table.attach_type == "vector") {
                        //  控制点设置向量
                        let vPosition = GameFunc.VectorFunctions.StringToVector(cp_table.cp_position);
                        //  print(p, control_point_index, vPosition)
                        ParticleManager.SetParticleControl(p, control_point_index, vPosition);
                    } else {
                        //  控制点绑定实体
                        let inner_attach_entity = attach_entity;
                        let attachment = cp_table.attachment;
                        if (cp_table.attach_entity == "parent") {
                            inner_attach_entity = hUnit;
                        } else if (cp_table.attach_entity == "this" && hWear && hWear.model) {
                            inner_attach_entity = hWear.model;
                        }
                        let position = hUnit.GetAbsOrigin();
                        if (cp_table.position) {
                            position = GameFunc.VectorFunctions.StringToVector(cp_table.position);
                        }
                        attach_type = WearableConfig.EWearableAttach[cp_table.attach_type] as any;
                        //  绑定饰品模型，且attachment为空饰品没attachment会让特效消失
                        if (cp_table.attach_entity != "this" || attachment) {
                            //  print(p, control_point_index, inner_attach_entity, attach_type, attachment, position)
                            ParticleManager.SetParticleControlEnt(p, control_point_index, inner_attach_entity, attach_type, attachment, position, true);
                        }
                    }
                }
            }
        }
        if (wearSys.PrismaticParticles[particle_name]) {
            // this.prismatic_particles = this.prismatic_particles || {};
            // if (this.prismatic_particles[particle_name]) {
            //     this.prismatic_particles[particle_name].particle_index = p;
            // } else {
            //     this.prismatic_particles[particle_name] = {
            //         particle_index: p,
            //         slot_name: sSlotName,
            //         style: sStyle,
            //     };
            // }
            // if (this.prismatic && Wearable.CanPrismatic(particle_name, this.prismatic)) {
            //     let sHexColor = wearSys.Allprismatics[this.prismatic].hex_color;
            //     let vColor = HexColor2RGBVector(sHexColor);
            //     ParticleManager.SetParticleControl(p, 16, Vector(1, 0, 0));
            //     ParticleManager.SetParticleControl(p, 15, vColor);
            // }
        }
        //  print(particle_name, p)
        //  虚灵特效没有hWear
        if (hWear) {
            hWear.particles[particle_name] = p;
        }
        return p;
    }
    oldHeroModel: string;
    changeHeroModel(sNewModel: string) {
        if (sNewModel == null) { return }
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        this.oldHeroModel = hUnit.GetModelName();
        hUnit.SetOriginalModel(sNewModel);
        hUnit.SetModel(sNewModel);
    }

    changeModel() {

    }
    changeSkin() {

    }
    // dressUp(sStyle: string = "0") {
    //     if (this.itemDef == null) { return }
    //     let comp = this.GetParent<WearableComponent>();
    //     let config = comp.GetWearConfig(this.itemDef);
    //     let hUnit = this.GetDomain<BaseNpc_Plus>();
    //     let slot = this.getSlot();
    //     let nModelIndex = -1;
    //     let sModel_player = config.model_player;
    //     this.style = sStyle;
    //     //  删除原饰品
    //     comp.TakeOffSlot(slot);
    //     //  生成饰品模型
    //     if (sModel_player) {
    //         let hModel = this.FindModelEntity(sModel_player);
    //         if (hModel == null) {
    //             let sPropClass = this.GetPropClass(this.itemDef);
    //             let sDefaultAnim = this.SpecialFixAnim(this.itemDef);
    //             let _proptable: any = {
    //                 model: sModel_player,
    //             };
    //             if (sDefaultAnim) {
    //                 _proptable["DefaultAnim"] = sDefaultAnim;
    //             }
    //             hModel = SpawnEntityFromTableSynchronous(sPropClass, _proptable) as CBaseModelEntity;
    //             hModel.SetOwner(hUnit);
    //             hModel.SetParent(hUnit, "");
    //             hModel.FollowEntity(hUnit, true);
    //             if (config.skin) {
    //                 hModel.SetSkin(tonumber("" + config.skin));
    //             }
    //         }
    //         this.model = hModel;
    //     }
    //     // 款式
    //     if (config.styles) {
    //         let styleinfo = json.decode(config.styles)[0];
    //         //  不同款式设置模型皮肤
    //         let style_table = styleinfo[sStyle];
    //         if (style_table) {
    //             if (style_table.model_player && style_table.model_player != sModel_player) {
    //                 this.model.SetModel(style_table.model_player);
    //             }
    //             if (style_table.skin && this.model) {
    //                 this.model.SetSkin(style_table.skin);
    //             }
    //             if (style_table.skin && !this.model) {
    //                 //  召唤物款式， 目前仅发现德鲁伊熊灵
    //                 // this.summon_skin = style_table.skin;
    //             }
    //         }
    //     }
    //     if (config.asset_modifier) {
    //         let asset_modifiers: any[] = [];
    //         config.asset_modifier.split("|").forEach(key => {
    //             if (key) {
    //                 asset_modifiers.push(json.decode(key)[0])
    //             }
    //         })
    //         for (let am_table of asset_modifiers) {
    //             if (am_table.type == "persona" && am_table.persona == 1) {
    //                 // this.SwitchPersona(true);
    //                 this.bPersona = true;
    //             }
    //         }
    //         for (let am_table of asset_modifiers) {
    //             if (am_table.type == "additional_wearable") {
    //                 //  额外模型
    //                 if (!this.additional_wearable) {
    //                     this.additional_wearable = [];
    //                 }
    //                 let sModel = am_table.asset;
    //                 let hModel = SpawnEntityFromTableSynchronous("prop_dynamic", { model: sModel }) as CBaseModelEntity;
    //                 hModel.SetOwner(hUnit);
    //                 hModel.SetParent(hUnit, "");
    //                 hModel.FollowEntity(hUnit, true);
    //                 this.additional_wearable.push(hModel);
    //             } else if (am_table.type == "entity_model") {
    //                 //  更换英雄模型
    //                 if (comp.sHeroName == am_table.asset) {
    //                     this.changeHeroModel(am_table.modifier)
    //                 } else if (comp.sHeroName == "npc_dota_hero_tiny") {
    //                     // let sModelIndex = string.sub(am_table.asset, -1, -1)
    //                     // nModelIndex = tonumber(sModelIndex) + 1
    //                     // hUnit["Model" + nModelIndex] = am_table.modifier
    //                     // if ( nModelIndex == hUnit.nModelIndex ) {
    //                     //     hUnit.SetOriginalModel(am_table.modifier)
    //                     //     hUnit.SetModel(am_table.modifier)
    //                     // }
    //                 } else {
    //                     // //  更换召唤物模型
    //                     // this.summon_model = this.summon_model || {};
    //                     // this.summon_model[am_table.asset] = am_table.modifier;
    //                     // hWear.bChangeSummon = hWear.bChangeSummon || {};
    //                     // hWear.bChangeSummon[am_table.asset] = true;
    //                     // //  召唤物skin写在外面，目前发现骨法金棒子 剑圣金猫
    //                     // let nSkin = asset_modifiers["skin"];
    //                     // if (nSkin != null) {
    //                     //     this.summon_skin = nSkin;
    //                     // }
    //                 }
    //             } else if (am_table.type == "hero_model_change") {
    //                 //  更换英雄变身模型
    //                 //  print("hero_model_change", am_table.asset)
    //                 if (!am_table.style || tostring(am_table.style) == sStyle) {
    //                     // this.hero_model_change = am_table;
    //                 }
    //             } else if (am_table.type == "model") {
    //                 //  更换其他饰品模型
    //                 //  print("hero_model_change", am_table.asset)
    //                 // if (!am_table.style || tostring(am_table.style) == sStyle) {
    //                 //     hWear.model_modifiers = hWear.model_modifiers || [];
    //                 //     hWear.model_modifiers.push(am_table);
    //                 //     for (let hSubWear of Object.values(this.Slots)) {
    //                 //         if (hSubWear != hWear && hSubWear.model && hSubWear.model.GetModelName() == am_table.asset) {
    //                 //             hSubWear.model.SetModel(am_table.modifier);
    //                 //         }
    //                 //     }
    //                 // }
    //             }
    //         }
    //         //  一定要在更换模型后面，否则可能找不到attachment
    //         for (let am_table of asset_modifiers) {
    //             if (am_table.type == "particle_create") {
    //                 //  周身特效
    //                 if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.spawn_in_loadout_only) {
    //                     let particle_name = am_table.modifier;
    //                     let bReplaced = false;
    //                     // if (!this.IsDisplayInLoadout(sSlotName)) {
    //                     //     //  隐藏槽位查看特效是否已被替换
    //                     //     for (let hSubWear of Object.values(this.Slots)) {
    //                     //         if (hSubWear.replace_particle_names && hSubWear.replace_particle_names[particle_name]) {
    //                     //             bReplaced = true;
    //                     //             hWear.particles[particle_name] = null;
    //                     //             break;
    //                     //         }
    //                     //     }
    //                     // }
    //                     // if (!bReplaced) {
    //                     //     this.AddParticle(hWear, particle_name, sSlotName, sStyle);
    //                     // }
    //                 }
    //             } else if (am_table.type == "particle") {
    //                 //  替换其他饰品的周身特效
    //                 if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.spawn_in_loadout_only) {
    //                     let default_particle_name = am_table.asset;
    //                     let particle_name = am_table.modifier;
    //                     for (let hSubWear of Object.values(this.Slots)) {
    //                         for (let p_name in hSubWear.particles) {
    //                             let sub_p = hSubWear.particles[p_name];
    //                             if (default_particle_name == p_name) {
    //                                 if (sub_p != null) {
    //                                     ParticleManager.DestroyParticle(sub_p, true);
    //                                     ParticleManager.ReleaseParticleIndex(sub_p);
    //                                     hSubWear.particles[p_name] = null;
    //                                 }
    //                                 break;
    //                             }
    //                         }
    //                     }
    //                     let p = this.AddParticle(hWear, particle_name, sSlotName, sStyle);
    //                     hWear.replace_particle_names = hWear.replace_particle_names || {};
    //                     hWear.replace_particle_names[default_particle_name] = true;
    //                     // if (this.sHeroName == "npc_dota_hero_tiny" && nModelIndex > 0) {
    //                     // hUnit["Particles" + nModelIndex][particle_name] = {
    //                     //     pid = p,
    //                     //     hWearParticles = hWear["particles"],
    //                     //     recreate =  () => {
    //                     //         return Wearable.AddParticle(hUnit, hWear, particle_name, sSlotName, sStyle)
    //                     //     }
    //                     // }
    //                     // }
    //                 }
    //             } else if (am_table.type == "particle_projectile") {
    //                 //  更换攻击弹道特效
    //                 if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.spawn_in_loadout_only) {
    //                     let default_projectile = am_table.asset;
    //                     let new_projectile = am_table.modifier;
    //                     if (hUnit.GetRangedProjectileName() == default_projectile) {
    //                         hWear.default_projectile = default_projectile;
    //                     } else {
    //                         hWear.default_projectile = am_table.asset;
    //                     }
    //                     hUnit.SetRangedProjectileName(new_projectile);
    //                     this.new_projectile = new_projectile;
    //                 }
    //             } else if (am_table.type == "model_skin") {
    //                 //  模型皮肤
    //                 //  print("model_skin", am_table.skin)
    //                 if (!am_table.style || tostring(am_table.style) == sStyle) {
    //                     hUnit.SetSkin(am_table.skin);
    //                     hWear.bChangeSkin = true;
    //                 }
    //             } else if (am_table.type == "activity") {
    //                 //  修改动作
    //                 //  print("activity", am_table.modifier)
    //                 if (!am_table.style || tostring(am_table.style) == sStyle) {
    //                     // ActivityModifier.AddWearableActivity(hUnit, am_table.modifier, sItemDef);
    //                     hWear.bActivity = true;
    //                 }
    //             } else if (am_table.type == "entity_scale") {
    //                 //  修改模型大小
    //                 //  print("activity", am_table.modifier)
    //                 if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.asset) {
    //                     hUnit.SetModelScale(am_table.scale_size);
    //                     hWear.bChangeScale = true;
    //                 }
    //             }
    //         }
    //     }
    //     this.SpecialFixParticles(sItemDef, hWear, sSlotName, sStyle);
    //     // this.RefreshSpecial(hUnit)
    //     if (nModelIndex > 0) {
    //         // Wearable.SwitchTinyParticles(hUnit)
    //     }
    //     // if ( DefaultPrismatic && DefaultPrismatic[sItemDef] && !hUnit.prismatic ) {
    //     //     let sPrismaticName = DefaultPrismatic[sItemDef]
    //     //     Wearable.SwitchPrismatic(hUnit, sPrismaticName)
    //     // }
    // }
    takeOff() {

    }
}