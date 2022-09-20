import { GameFunc } from "../../../GameFunc";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { WearableConfig } from "../../System/Wearable/WearableConfig";
import { WearableComponent } from "./WearableComponent";

@registerET()
export class EWearableItem extends ET.Entity {
    bundleId: string;
    readonly isDressUp: boolean = false;
    readonly itemDef: string;
    readonly replaceParticles: { [k: string]: string } = {};
    readonly replaceSounds: { [k: string]: string } = {};
    readonly replaceAbilityIcon: { [k: string]: string } = {};
    readonly createParticles: { [k: string]: ParticleID } = {};
    // 未改变模型，召唤物或者英雄变身
    readonly replaceModel: { [k: string]: string } = {};
    // 已经改变
    readonly alreadyReplaceModel: { [k: string]: string } = {};
    // 英雄模型
    oldHeroModel: string;
    style: string;
    // 子槽位
    bPersona?: boolean;
    bActivity?: boolean;
    model?: CBaseModelEntity;
    additional_wearable?: CBaseModelEntity[];
    addBuff?: CDOTA_Buff[];
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
    AddParticle(particle_name: string, sStyle: string = null) {
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        let comp = this.GetParent<WearableComponent>();
        let config = comp.GetWearConfig(this.itemDef);
        let attach_type = ParticleAttachment_t.PATTACH_CUSTOMORIGIN;
        let attach_entity = hUnit as CBaseEntity;
        if (this.model) {
            attach_entity = this.model;
        }
        let pointinfo: any;
        if (config.control_point) {
            let control_point: any[] = [];
            config.control_point.split("|").forEach(key => {
                if (key) {
                    control_point.push(json.decode(key)[0])
                }
            });
            for (let _pointinfo of control_point) {
                if (_pointinfo.system == particle_name) {
                    pointinfo = _pointinfo;
                    break;
                }
            }
            if (pointinfo) {
                if (pointinfo.attach_type) {
                    attach_type = WearableConfig.EWearableAttach[pointinfo.attach_type] as any;
                }
                if (pointinfo.attach_entity == "parent") {
                    attach_entity = hUnit;
                }
            }

        }
        let p = ParticleManager.CreateParticle(particle_name, attach_type, attach_entity);
        this.createParticles[particle_name] = p;
        if (pointinfo && pointinfo["control_points"]) {
            let cps: { [K: string]: any } = pointinfo["control_points"];
            for (let cp_table of Object.values(cps)) {
                if (!cp_table.style || tostring(cp_table.style) == sStyle) {
                    let control_point_index = cp_table.control_point_index;
                    if (cp_table.attach_type == "vector") {
                        //  控制点设置向量
                        let vPosition = GameFunc.VectorFunctions.StringToVector(cp_table.cp_position);
                        ParticleManager.SetParticleControl(p, control_point_index, vPosition);
                    }
                    else {
                        //  控制点绑定实体
                        let inner_attach_entity = attach_entity;
                        let attachment = cp_table.attachment;
                        if (cp_table.attach_entity == "parent") {
                            inner_attach_entity = hUnit;
                        } else if (cp_table.attach_entity == "this" && this.model) {
                            inner_attach_entity = this.model;
                        }
                        let position = hUnit.GetAbsOrigin();
                        if (cp_table.position) {
                            position = GameFunc.VectorFunctions.StringToVector(cp_table.position);
                        }
                        attach_type = WearableConfig.EWearableAttach[cp_table.attach_type] as any;
                        //  绑定饰品模型，且attachment为空饰品没attachment会让特效消失
                        if (cp_table.attach_entity != "this" || attachment) {
                            ParticleManager.SetParticleControlEnt(p, control_point_index, inner_attach_entity, attach_type, attachment, position, true);
                        }
                    }
                }
            }
        }
    }
    AddParticle2(hWear: WearableConfig.IUnitWearSlotInfo, particle_name: string, sSlotName: string, sStyle: string = null) {
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
    private changeHeroModel(sNewModel: string) {
        if (sNewModel == null) { return }
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        this.oldHeroModel = hUnit.GetModelName();
        hUnit.SetOriginalModel(sNewModel);
        hUnit.SetModel(sNewModel);
    }
    private oldSkin: number = 0;
    private bChangeSkin: boolean = false;
    private changeSkin(newSkin: number) {
        if (newSkin == null) { return }
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        hUnit.SetSkin(newSkin);
        this.bChangeSkin = true;
    }
    private oldScale: number;
    private changeModelScale(scale: number) {
        if (scale == null) { return }
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        this.oldScale = hUnit.GetModelScale();
        hUnit.SetModelScale(scale);
    }
    dressUp(sStyle: string = "0") {
        if (this.itemDef == null) { return }
        if (this.isDressUp) { return }
        let comp = this.GetParent<WearableComponent>();
        let config = comp.GetWearConfig(this.itemDef);
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        let slot = this.getSlot();
        comp.TakeOffSlot(slot);
        (this.isDressUp as any) = true;
        let sModel_player = config.model_player;
        this.style = sStyle;
        //  生成饰品模型
        if (sModel_player && this.model == null) {
            let hModel = this.FindModelEntity(sModel_player);
            if (hModel == null) {
                let sPropClass = this.GetPropClass(this.itemDef);
                let sDefaultAnim = this.SpecialFixAnim(this.itemDef);
                let _proptable: any = {
                    model: sModel_player,
                };
                if (sDefaultAnim) {
                    _proptable["DefaultAnim"] = sDefaultAnim;
                }
                hModel = SpawnEntityFromTableSynchronous(sPropClass, _proptable) as CBaseModelEntity;
                hModel.SetOwner(hUnit);
                hModel.SetParent(hUnit, "");
                hModel.FollowEntity(hUnit, true);
                if (config.skin) {
                    this.oldSkin = tonumber("" + config.skin)
                    hModel.SetSkin(this.oldSkin);
                }
            }
            this.model = hModel;
        }
        this.model.RemoveEffects(EntityEffects.EF_NODRAW);
        // 款式
        if (config.styles) {
            let styleinfo = json.decode(config.styles)[0];
            //  不同款式设置模型皮肤
            let style_table = styleinfo[sStyle];
            if (style_table) {
                if (style_table.model_player && style_table.model_player != sModel_player) {
                    this.model.SetModel(style_table.model_player);
                }
                if (style_table.skin && this.model) {
                    this.model.SetSkin(tonumber(style_table.skin));
                }
                if (style_table.skin && !this.model) {
                    //  召唤物款式， 目前仅发现德鲁伊熊灵
                    // this.summon_skin = style_table.skin;
                }
            }
        }
        if (config.asset_modifier) {
            let asset_modifiers: any[] = [];
            config.asset_modifier.split("|").forEach(key => {
                if (key) {
                    asset_modifiers.push(json.decode(key)[0])
                }
            })
            for (let am_table of asset_modifiers) {
                if (am_table.type == "persona" && am_table.persona == 1) {
                    // this.SwitchPersona(true);
                    this.bPersona = true;
                }
            }
            for (let am_table of asset_modifiers) {
                if (am_table.type == "additional_wearable") {
                    //  额外模型
                    if (!this.additional_wearable) {
                        this.additional_wearable = [];
                    }
                    let sModel = am_table.asset;
                    let hModel: CBaseModelEntity;
                    for (let _additionalentity of this.additional_wearable) {
                        if (_additionalentity.GetModelName() == sModel) {
                            hModel = _additionalentity;
                            break;
                        }
                    }
                    if (hModel) {
                        hModel.RemoveEffects(EntityEffects.EF_NODRAW);
                    }
                    else {
                        hModel = SpawnEntityFromTableSynchronous("prop_dynamic", { model: sModel }) as CBaseModelEntity;
                        hModel.SetOwner(hUnit);
                        hModel.SetParent(hUnit, "");
                        hModel.FollowEntity(hUnit, true);
                        this.additional_wearable.push(hModel);
                    }
                }
                else if (am_table.type == "entity_model") {
                    //  更换英雄模型
                    if (comp.sHeroName == am_table.asset) {
                        this.changeHeroModel(am_table.modifier)
                    }
                    else if (comp.sHeroName == "npc_dota_hero_tiny") {
                        // let sModelIndex = string.sub(am_table.asset, -1, -1)
                        // nModelIndex = tonumber(sModelIndex) + 1
                        // hUnit["Model" + nModelIndex] = am_table.modifier
                        // if ( nModelIndex == hUnit.nModelIndex ) {
                        //     hUnit.SetOriginalModel(am_table.modifier)
                        //     hUnit.SetModel(am_table.modifier)
                        // }
                    }
                    else {
                        //   更换召唤物模型
                        if (am_table.asset && am_table.modifier) {
                            this.replaceModel[am_table.asset] = am_table.modifier;
                        }
                    }
                }
                else if (am_table.type == "hero_model_change") {
                    //  更换英雄变身模型
                    if (!am_table.style || tostring(am_table.style) == sStyle) {
                        if (am_table.asset && am_table.modifier) {
                            this.replaceModel[am_table.asset] = am_table.modifier;
                        }
                    }
                }
                else if (am_table.type == "model") {
                    //  更换其他饰品模型
                    if (!am_table.style || tostring(am_table.style) == sStyle) {
                        let entity = comp.FindWearItemByModel(am_table.asset);
                        entity.model.SetModel(am_table.modifier);
                        this.alreadyReplaceModel[am_table.asset] = am_table.modifier;
                    }
                }
            }
            //  一定要在更换模型后面，否则可能找不到attachment
            for (let am_table of asset_modifiers) {
                if (am_table.type == "particle") {
                    let old_particle = am_table.asset;
                    let particle_name = am_table.modifier;
                    if (old_particle && particle_name) {
                        this.replaceParticles[old_particle] = particle_name;
                    }
                }
                else if (am_table.type == "particle_create") {
                    //  周身特效
                    if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.spawn_in_loadout_only) {
                        let particle_name = am_table.modifier;
                        this.AddParticle(particle_name, sStyle);
                    }
                } else if (am_table.type == "model_skin") {
                    //  模型皮肤
                    if (!am_table.style || tostring(am_table.style) == sStyle) {
                        this.changeSkin(tonumber(am_table.skin));
                    }
                } else if (am_table.type == "entity_scale") {
                    //  修改模型大小
                    if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.asset) {
                        this.changeModelScale(tonumber(am_table.scale_size));
                    }
                } else if (am_table.type == "activity") {
                    //  修改动作
                    if (!am_table.style || tostring(am_table.style) == sStyle) {
                        // ActivityModifier.AddWearableActivity(hUnit, am_table.modifier, sItemDef);
                    }
                }
                else if (am_table.type == "sound") {
                    //  修改音效
                    let old_sound = am_table.asset;
                    let new_sound = am_table.modifier;
                    if (old_sound && new_sound) {
                        this.replaceSounds[old_sound] = new_sound;
                    }
                }
                else if (am_table.type == "ability_icon") {
                    //  修改音效
                    let old_ = am_table.asset;
                    let new_ = am_table.modifier;
                    if (old_ && new_) {
                        this.replaceAbilityIcon[old_] = new_;
                    }
                } else if (am_table.type == "buff_modifier") {
                    //  添加BUFF
                    let new_ = am_table.modifier;
                    if (new_) {
                        let buff = hUnit.AddNewModifier(hUnit, null, new_, {});
                        this.addBuff = this.addBuff || [];
                        this.addBuff.push(buff);
                    }
                }
            }
        }
        // this.RefreshSpecial(hUnit)
        // if (nModelIndex > 0) {
        // Wearable.SwitchTinyParticles(hUnit)
        // }
    }
    takeOff() {
        if (!this.isDressUp) {
            return
        }
        (this.isDressUp as any) = false;
        let comp = this.GetParent<WearableComponent>();
        let hUnit = this.GetDomain<BaseNpc_Plus>();
        for (let p_name in this.createParticles) {
            let p = this.createParticles[p_name];
            if (p != null) {
                ParticleManager.DestroyParticle(p, true);
                ParticleManager.ReleaseParticleIndex(p);
            }
        }
        for (let oldmodel in this.alreadyReplaceModel) {
            let newmodel = this.alreadyReplaceModel[oldmodel];
            let entity = comp.FindWearItemByModel(newmodel);
            entity.model.SetModel(oldmodel);
        }
        (this.alreadyReplaceModel as any) = {};
        (this.createParticles as any) = {};
        (this.replaceParticles as any) = {};
        (this.replaceSounds as any) = {};
        (this.replaceAbilityIcon as any) = {};
        (this.replaceModel as any) = {};
        if (this.additional_wearable) {
            for (let prop of this.additional_wearable) {
                if (prop && IsValidEntity(prop)) {
                    prop.AddEffects(EntityEffects.EF_NODRAW);
                }
            }
        }
        if (this.model) {
            let prop = this.model;
            if (prop && IsValidEntity(prop)) {
                prop.AddEffects(EntityEffects.EF_NODRAW);
            }
        }
        if (this.bChangeSkin) {
            hUnit.SetSkin(this.oldSkin);
            this.bChangeSkin = false;
        }
        if (this.oldHeroModel) {
            hUnit.SetOriginalModel(this.oldHeroModel);
            hUnit.SetModel(this.oldHeroModel);
            this.oldHeroModel = null;
        }
        if (this.oldScale) {
            hUnit.SetModelScale(this.oldScale);
            this.oldScale = null;
        }
        if (this.bActivity) {
            // ActivityModifier.RemoveWearableActivity(hUnit, hUnit.Slots[sSlotName].itemDef);
        }
        if (this.bPersona) {
            this.bPersona = false;
            // SlotInfo.bPersona = null; //  防止stack overflow
        }
        if (this.addBuff) {
            this.addBuff.forEach(buff => { buff.Destroy() });
            this.addBuff = null;
        }
    }
}