// import { GameFunc } from "../../../GameFunc";
// import { KVHelper } from "../../../helper/KVHelper";
// import { LogHelper } from "../../../helper/LogHelper";
// import { PrecacheHelper } from "../../../helper/PrecacheHelper";
// import { TimerHelper } from "../../../helper/TimerHelper";
// import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
// import { ET } from "../../../shared/lib/Entity";
// import { WearableConfig } from "../../System/Wearable/WearableConfig";
// import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
// import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
// import { EWearableItem } from "./EWearableItem";

// @GReloadable
// export class WearableComponent extends ET.Component {
//     readonly sHeroName: string;
//     readonly replaceParticles: { [k: string]: string[] } = {};
//     Slots: { [k: string]: WearableConfig.IUnitWearSlotInfo } = {};
//     prismatic_particles: { [k: string]: any } = {};
//     prismatic: string;
//     bPersona: boolean = false;
//     summon_skin: string;
//     summon_model: { [k: string]: any } = {};
//     new_projectile: string;
//     old_model: string;

//     GetHeroConfig() {
//         let wearSys = GWearableSystem.GetInstance();
//         return wearSys.Allheroes[this.sHeroName];
//     }
//     GetItemConfig(sItemDef: string) {
//         let wearSys = GWearableSystem.GetInstance();
//         return wearSys.Allitems[sItemDef];
//     }
//     onAwake(dotaHeroName: string): void {
//         (this .sHeroName as any)= dotaHeroName;
//         if (dotaHeroName == null || dotaHeroName.length == 0) {
//             return
//         }
//         let wearConfig;
//         let etroot = this.Domain.ETRoot;
//         if (etroot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot")) {
//             wearConfig = etroot.As<IBuildingEntityRoot>().Config().Creature?.AttachWearables;
//         }
//         else if (etroot.AsValid<IEnemyUnitEntityRoot>("EnemyUnitEntityRoot")) {
//             wearConfig = etroot.As<IEnemyUnitEntityRoot>().Config().Creature?.AttachWearables;
//         }
//         if (wearConfig) {
//             for (let k in wearConfig) {
//                 let v = wearConfig[k];
//                 if (v.ItemDef) {
//                     this.Wear(v.ItemDef);
//                 }
//             }
//         }
//         // TimerHelper.addTimer(5, () => {
//         //     this.Wear(21182);
//         //     // this.Wear(4336);
//         //     // this.Wear(4337);
//         //     // this.Wear(4338);
//         // let domain = this.GetDomain<IBaseNpc_Plus>();
//         // domain.NotifyWearablesOfModelChange(true)
//         // }, this)
//         // TimerHelper.addTimer(10, () => {
//         //     this.SwitchPersona(true);
//         //     // this.Wear(4336);
//         //     // this.Wear(4337);
//         //     // this.Wear(4338);
//         // let domain = this.GetDomain<IBaseNpc_Plus>();
//         // domain.NotifyWearablesOfModelChange(true)
//         // },this)
//     }


//     FindModelEntity(modelName: string) {
//         let domain = this.GetDomain<IBaseNpc_Plus>();
//         let model = domain.FirstMoveChild() as CBaseModelEntity;
//         while (model != null) {
//             //  确保获取到的是 dota_item_wearable 的模型
//             if (model != null && model.GetClassname() == "dota_item_wearable") {
//                 if (model.GetModelName() == modelName) {
//                     return model;
//                 }
//             }
//             //  获取下一个模型
//             model = model.NextMovePeer() as CBaseModelEntity;
//         }
//         return null;
//     }

//     WearDefaults(bPersona: boolean) {
//         let hHeroInfo = this.GetHeroConfig();
//         if (hHeroInfo && hHeroInfo.Slots) {
//             for (let sSlotName in hHeroInfo.Slots) {
//                 let hSlot = hHeroInfo.Slots[sSlotName];
//                 let _p = false;
//                 if (bPersona) {
//                     _p = this.IsPersona(sSlotName);
//                 } else {
//                     _p = !this.IsPersona(sSlotName);
//                 }
//                 if (hSlot && hSlot.DefaultItem && _p) {
//                     this.Wear(hSlot.DefaultItem);
//                 }
//             }
//         }
//     }
//     //  是否为身心子槽位
//     IsPersona(sSlotName: string) {
//         return string.sub(sSlotName, -10) == "_persona_1";
//     }

//     SwitchPersona(bPersona: boolean) {
//         for (let sSlotName in this.Slots) {
//             this.TakeOffSlot(sSlotName);
//         }
//         this.WearDefaults(bPersona);
//     }
//     GetSlotName(sItemDef: string | number) {
//         sItemDef = sItemDef + "";
//         let hItem = this.GetItemConfig(sItemDef);
//         let sSlotName = hItem.item_slot;
//         if (hItem.prefab == WearableConfig.EWearableType.taunt) {
//             sSlotName = WearableConfig.EWearableType.taunt;
//         } else if (!sSlotName) {
//             sSlotName = WearableConfig.EWearableType.weapon;
//         }
//         return sSlotName;
//     }
//     GetSlotNameBySlotIndex(nSlotIndex: string | number) {
//         let hHeroInfo = this.GetHeroConfig();
//         if (hHeroInfo) {
//             return hHeroInfo.SlotIndex2Name["" + nSlotIndex];
//         }
//     }

//     GetSlotIndex(sItemDef: string) {
//         let hItem = this.GetItemConfig(sItemDef);
//         let sSlotName = hItem.item_slot;
//         if (hItem.prefab == WearableConfig.EWearableType.taunt) {
//             sSlotName = WearableConfig.EWearableType.taunt;
//         } else if (!sSlotName) {
//             sSlotName = WearableConfig.EWearableType.weapon;
//         }
//         let hHeroInfo = this.GetHeroConfig();
//         return hHeroInfo.Slots[sSlotName].SlotIndex;
//     }
//     IsDisplayInLoadout(sSlotName: string) {
//         let hHeroInfo = this.GetHeroConfig();
//         let heroSlots = hHeroInfo.Slots;
//         let Slot = heroSlots[sSlotName];
//         if (!Slot || Slot.DisplayInLoadout == 0) {
//             return false;
//         }
//         return true;
//     }

//     Wear(sItemDef: string | number, sStyle: string = "0") {
//         sItemDef = sItemDef + "";
//         let wearSys = GWearableSystem.GetInstance();
//         let hItem = wearSys.Allitems["" + sItemDef];
//         let sSlotName = this.GetSlotName(sItemDef);
//         if (this.bPersona && !this.IsPersona(sSlotName) && sSlotName != "persona_selector") {
//             return;
//         }
//         if (hItem.prefab == WearableConfig.EWearableType.bundle) {
//             for (let sSubItemDef of wearSys.Allbundles[sItemDef]) {
//                 this.Wear(sSubItemDef);
//             }
//             return;
//         }
//         this._WearProp(sItemDef, sSlotName, sStyle);

//     }

//     GetPropClass(sItemDef: string) {
//         if (sItemDef == "4810") {
//             //  蝙蝠不良头巾需要物理
//             return "prop_physics";
//         }
//         return "prop_dynamic";
//     }
//     //  修复替换型的特殊周身特效
//     SpecialFixParticles(sItemDef: string, hWear: WearableConfig.IUnitWearSlotInfo, sSlotName: string, sStyle: string = null) {
//         if (sItemDef == "12588") {
//             let particle_name = "particles/econ/items/lanaya/princess_loulan/princess_loulan_weapon.vpcf";
//             this.AddParticle(hWear, particle_name, sSlotName, sStyle);
//         }
//     }
//     SpecialFixAnim(sItemDef: string) {
//         switch (sItemDef) {
//             //  修复猛犸凶残螺旋战盔动作
//             case "9972":
//             //  修复萨尔不朽武器
//             case "12412":
//             //  修复军团不朽战棋
//             case "7930":
//             //  修复沉默不朽武器
//             case "12414":
//             //  修复灵象硝骑
//             case "13530":
//             case "13527":
//             //  修复骨法不朽武器
//             case "12955":
//             //  修复伐木机不朽武器
//             case "7581":
//             //  修复伐木机不朽盘子
//             case "12927":
//             case "13523":
//             //  修复冰魂不朽肩
//             case "9462":
//             //  修复戴泽花月法杖
//             case "12977":
//             //  修复拉比克虚幻之镜法杖
//             case "13266":
//             //  修复尸王蠕行藤曼护体动作
//             case "13483":
//             //  修复帕克不朽翅膀动作
//             case "13767":
//             //  修复修补匠不朽右臂动作
//             case "13777":
//             //  修复美杜莎不朽尾巴动作
//             case "13778":
//             //  修复屠夫千劫神勾动作
//             case "13788":
//             //  修复赏金不仁之猎-飞禽动作
//             case "14283":
//             //  修复先知神明之印动作
//             case "14277":
//             //  修复术士烈影之铭动作
//             case "12956":
//             //  修复飞机不朽导弹动作
//             case "14967":
//             //  修复神谕不朽头动作
//             case "14954":
//             //  修复发条不朽武器动作
//             case "14992":
//             //  修复术士流放到感恩动作
//             case "14000":
//             case "13998":
//             //  修复冰魂释放天启动作
//             case "14163":
//             case "14165":
//             //  修复冥魂大帝不朽武器
//             case "9747":
//             case "12424":
//             //  修复编织者不朽触角
//             case "7810":
//             case "7813":
//             //  修复帕格纳不朽头
//             case "13755":
//             case "14965":
//             //  修复主宰至宝动作 其他动作还没支持
//             case "9059":
//             //  修复小精灵至宝动作 其他动作还没支持
//             case "9235":
//             //  修复虚空不朽武器动作 其他动作还没支持
//             case "7571":
//             //  修复海民不朽企鹅动作 其他动作还没支持
//             case "7375":
//             //  修复血魔不朽头动作 其他动作还没支持
//             case "9241":
//             //  修复沙王不朽手臂动作 其他动作还没支持
//             case "7809":
//             //  修复大树不朽动作 其他动作还没支持
//             case "9196":
//             case "9452":
//             //  修复猛犸凶残螺旋长角动作 其他动作还没支持
//             case "9971":
//             //  修复猛犸凶残螺钻铁槌动作 其他动作还没支持
//             case "9970":
//             //  修复蓝胖不朽背部动作 其他动作还没支持
//             case "7910":
//             //  修复巫妖邪会仪式意念动作 其他动作还没支持
//             case "12792":
//             //  修复巫妖不朽武器动作 其他动作还没支持
//             case "9756":
//             //  修复死灵法不朽武器动作 其他动作还没支持
//             case "9089":
//             //  修复大树霜褐影匿庇护
//             case "9704":
//             //  修复熊战士北辰灭世
//             case "14944":
//             //  修复天怒天神之秘武器动作
//             case "13933":
//             //  修复谜团无限进化护甲动作
//             case "14750":
//             //  修复光法盗贼之王动作
//             case "14449":
//             case "14451":
//             //  修复末日不朽手臂动作 其他动作还没支持 会随机出现受伤状态bug
//             case "9741":
//             //  修复死灵法不朽肩部动作 其他动作还没支持
//             case "7427":
//             case "7508":
//             //  修复屠夫不朽勾 其他动作还没支持 会随机出现受伤状态bug
//             case "8004":
//             case "8038":
//             case "8010":
//             //  修复黑鸟不朽武器 其他动作还没支持
//             case "7509":
//             case "8376":
//             //  修复黑贤不朽手臂 其他动作还没支持
//             case "9740":
//             case "12299":
//             //  修复幽鬼至宝
//             case "9662":
//             //  修复大牛不朽武器
//             case "14242":
//             //  巫医孢父健步
//             case "19155":
//             case "19152":
//             //  飞机玄奥逆变
//             case "18979":
//             case "18974":
//             //  先知大漠奇花
//             case "14900":
//             //  修复潮汐背部不朽
//             case "14960":
//             case "19023":
//                 return "GameActivity_t.ACT_DOTA_IDLE";
//         }
//         switch (this.sHeroName) {
//             //  修复神灵投矛 其他动作还没支持
//             case "npc_dota_hero_huskar":
//             //  修复小鹿投矛 其他动作还没支持
//             case "npc_dota_hero_enchantress":
//                 if (this.GetSlotName(sItemDef) == "weapon") {
//                     return "GameActivity_t.ACT_DOTA_IDLE";
//                 }
//                 break;
//         }
//         return null;
//     }

//     AddParticle(hWear: WearableConfig.IUnitWearSlotInfo, particle_name: string, sSlotName: string, sStyle: string = null) {
//         let hUnit = this.GetDomain<IBaseNpc_Plus>();
//         let wearSys = GWearableSystem.GetInstance();
//         let attach_type = ParticleAttachment_t.PATTACH_CUSTOMORIGIN;
//         let attach_entity = hUnit as CBaseEntity;
//         if (hWear && hWear.model) {
//             attach_entity = hWear.model;
//         }
//         let p_table = wearSys.AllcontrolPoints[particle_name];
//         if (p_table) {
//             if (p_table.attach_type) {
//                 attach_type = WearableConfig.EWearableAttach[p_table.attach_type] as any;
//             }
//             if (p_table.attach_entity == "parent") {
//                 attach_entity = hUnit;
//             }
//         }
//         let p = ParticleManager.CreateParticle(particle_name, attach_type, attach_entity);
//         if (p_table && p_table["control_points"]) {
//             let cps: { [K: string]: any } = p_table["control_points"];
//             for (let cp_table of Object.values(cps)) {
//                 if (!cp_table.style || tostring(cp_table.style) == sStyle) {
//                     let control_point_index = cp_table.control_point_index;
//                     if (cp_table.attach_type == "vector") {
//                         //  控制点设置向量
//                         let vPosition = GFuncVector.StringToVector(cp_table.cp_position);
//                         //  print(p, control_point_index, vPosition)
//                         ParticleManager.SetParticleControl(p, control_point_index, vPosition);
//                     } else {
//                         //  控制点绑定实体
//                         let inner_attach_entity = attach_entity;
//                         let attachment = cp_table.attachment;
//                         if (cp_table.attach_entity == "parent") {
//                             inner_attach_entity = hUnit;
//                         } else if (cp_table.attach_entity == "this" && hWear && hWear.model) {
//                             inner_attach_entity = hWear.model;
//                         }
//                         let position = hUnit.GetAbsOrigin();
//                         if (cp_table.position) {
//                             position = GFuncVector.StringToVector(cp_table.position);
//                         }
//                         attach_type = WearableConfig.EWearableAttach[cp_table.attach_type] as any;
//                         //  绑定饰品模型，且attachment为空饰品没attachment会让特效消失
//                         if (cp_table.attach_entity != "this" || attachment) {
//                             //  print(p, control_point_index, inner_attach_entity, attach_type, attachment, position)
//                             ParticleManager.SetParticleControlEnt(p, control_point_index, inner_attach_entity, attach_type, attachment, position, true);
//                         }
//                     }
//                 }
//             }
//         }
//         if (wearSys.PrismaticParticles[particle_name]) {
//             this.prismatic_particles = this.prismatic_particles || {};
//             if (this.prismatic_particles[particle_name]) {
//                 this.prismatic_particles[particle_name].particle_index = p;
//             } else {
//                 this.prismatic_particles[particle_name] = {
//                     particle_index: p,
//                     slot_name: sSlotName,
//                     style: sStyle,
//                 };
//             }
//             // if (this.prismatic && Wearable.CanPrismatic(particle_name, this.prismatic)) {
//             //     let sHexColor = wearSys.Allprismatics[this.prismatic].hex_color;
//             //     let vColor = HexColor2RGBVector(sHexColor);
//             //     ParticleManager.SetParticleControl(p, 16, Vector(1, 0, 0));
//             //     ParticleManager.SetParticleControl(p, 15, vColor);
//             // }
//         }
//         //  print(particle_name, p)
//         //  虚灵特效没有hWear
//         if (hWear) {
//             hWear.particles[particle_name] = p;
//         }
//         return p;
//     }

//     SetTinyDefaultModel(sItemDef: string) {
//         let nModelIndex = -1;
//         if (sItemDef == "679") {
//             nModelIndex = 1;
//         } else if (sItemDef == "680") {
//             nModelIndex = 2;
//         } else if (sItemDef == "681") {
//             nModelIndex = 3;
//         } else if (sItemDef == "682") {
//             nModelIndex = 4;
//         }
//         let hTiny = this.GetDomain<IBaseNpc_Plus>();
//         if (nModelIndex > 0) {
//             // let sModel = "models/heroes/tiny/tiny_0" + nModelIndex + "/tiny_0" + nModelIndex + ".vmdl"
//             // hTiny["Model" + nModelIndex] = sModel
//             // if ( nModelIndex == hTiny.nModelIndex ) {
//             //     hTiny.SetOriginalModel(sModel)
//             //     hTiny.SetModel(sModel)
//             // }
//         }
//     }
//     SwitchTinyParticles(hTiny: any) {
//         // let nModelIndex = hTiny.nModelIndex
//         // print("SwitchTinyParticles", nModelIndex)
//         // //  PrintTable(hTiny)
//         // for (let i = 1; i <= 4 ; i++) {
//         //     if ( i == nModelIndex && hTiny["Particles" + i] ) {
//         //         for p_name, p_table in pairs(hTiny["Particles" + i]) do
//         //             print("remove", i, nModelIndex, p_name)
//         //             ParticleManager.DestroyParticle(p_table.pid, true)
//         //             ParticleManager.ReleaseParticleIndex(p_table.pid)
//         //             if ( p_table.hWearParticles[p_name] ) {
//         //                 print("recreate", i, p_table.pid, p_name)
//         //                 p_table.pid = p_table.recreate()
//         //             }
//         //         }
//         //     } else {
//         //         for p_name, p_table in pairs(hTiny["Particles" + i]) do
//         //             print("remove", i, nModelIndex, p_table.pid)
//         //             ParticleManager.DestroyParticle(p_table.pid, true)
//         //             ParticleManager.ReleaseParticleIndex(p_table.pid)
//         //         }
//         //     }
//         // }
//     }
//     //   SwitchTinyModel(hTiny, nModelIndex) {
//     //         if ( hTiny.nModelIndex == nModelIndex ) {
//     //             return
//     //         }
//     //         hTiny.nModelIndex = nModelIndex
//     //         let sModel = hTiny["Model" + nModelIndex]
//     //         print("SwitchTinyModel", nModelIndex, sModel)
//     //         hTiny.SetOriginalModel(sModel)
//     //         hTiny.SetModel(sModel)
//     //         Wearable.SwitchTinyParticles(hTiny)
//     //     }

//     SlotWears: { [slot: string]: string[] } = {}


//     GetWearConfig(sItemDef: string) {
//         return KVHelper.KvServerConfig.shipin_config[sItemDef];
//     }
//     public WearOneItem(sItemDef: string, sStyle: string = "0") {
//         if (!sItemDef) {
//             return;
//         }
//         let config = this.GetWearConfig(sItemDef);
//         if (!config) {
//             return;
//         }
//         let wearitem = this.FindWearItemByItemDef(sItemDef);
//         if (wearitem == null) {
//             let type = PrecacheHelper.GetRegClass<typeof EWearableItem>("EWearableItem");
//             wearitem = this.AddChild(type, sItemDef);
//         }
//         // wearitem.dressUp(sStyle)
//     }
//     public FindWearItemByItemDef(sItemDef: string) {
//         if (!sItemDef) {
//             return;
//         }
//         for (let k in this.SlotWears) {
//             let keys = this.SlotWears[k];
//             for (let entityid of keys) {
//                 let entity = this.GetChild<EWearableItem>(entityid);
//                 if (entity && entity.itemDef == sItemDef) {
//                     return entity
//                 }
//             }
//         }
//     }
//     public FindWearItemByModel(modelname: string) {
//         if (!modelname) {
//             return;
//         }
//         for (let k in this.SlotWears) {
//             let keys = this.SlotWears[k];
//             for (let entityid of keys) {
//                 let entity = this.GetChild<EWearableItem>(entityid);
//                 if (entity && entity.model && entity.model.GetModelName() == modelname) {
//                     return entity
//                 }
//             }
//         }
//     }

//     //  通过生成prop_dynamic来换装
//     private _WearProp(sItemDef: string, sSlotName: string, sStyle: string = null) {
//         if (!sItemDef) {
//             return;
//         }
//         if (!sStyle) {
//             sStyle = "0";
//         }
//         let wearSys = GWearableSystem.GetInstance();
//         let hItem = wearSys.Allitems[sItemDef];
//         let hUnit = this.GetDomain<IBaseNpc_Plus>();
//         // if (this.sHeroName == "npc_dota_hero_tiny") {
//         //     this.SetTinyDefaultModel(sItemDef);
//         // }
//         let nModelIndex = -1;
//         let sModel_player = hItem.model_player;
//         let hWear: WearableConfig.IUnitWearSlotInfo = {} as any;
//         hWear.itemDef = sItemDef;
//         hWear.particles = {};
//         hWear.style = sStyle;
//         //  删除原饰品
//         this.TakeOffSlot(sSlotName);
//         for (let hOtherWear of Object.values(this.Slots)) {
//             if (hOtherWear.model_modifiers) {
//                 for (let tModelModifier of Object.values(hOtherWear.model_modifiers)) {
//                     if (sModel_player == tModelModifier.asset) {
//                         sModel_player = tModelModifier.modifier;
//                     }
//                 }
//             }
//         }
//         //  生成饰品模型
//         if (sModel_player) {
//             let hModel = this.FindModelEntity(sModel_player);
//             if (hModel == null) {
//                 let sPropClass = this.GetPropClass(sItemDef);
//                 let sDefaultAnim = this.SpecialFixAnim(sItemDef);
//                 let _proptable: any = {
//                     model: sModel_player,
//                 };
//                 if (sDefaultAnim) {
//                     _proptable["DefaultAnim"] = sDefaultAnim;
//                 }
//                 hModel = SpawnEntityFromTableSynchronous(sPropClass, _proptable) as CBaseModelEntity;
//                 hModel.SetOwner(hUnit);
//                 hModel.SetParent(hUnit, "");
//                 hModel.FollowEntity(hUnit, true);
//                 if (hItem.visuals && hItem.visuals.skin) {
//                     hModel.SetSkin(hItem.visuals.skin);
//                 }
//             }
//             hWear.model = hModel;
//         }
//         let asset_modifiers = hItem.visuals;
//         if (asset_modifiers) {
//             for (let am_name in asset_modifiers) {
//                 let am_table = asset_modifiers[am_name];
//                 if (type(am_table) == "table" && am_table.type == "persona" && am_table.persona == 1) {
//                     this.SwitchPersona(true);
//                     hWear.bPersona = true;
//                     this.bPersona = true;
//                 }
//             }
//             for (let am_name in asset_modifiers) {
//                 let am_table = asset_modifiers[am_name];
//                 if (type(am_table) !== "table") {
//                     continue;
//                 }
//                 if (am_name == "styles") {
//                     //  不同款式设置模型皮肤
//                     let style_table = am_table[sStyle];
//                     if (style_table) {
//                         if (style_table.model_player && style_table.model_player != sModel_player) {
//                             hWear.model.SetModel(style_table.model_player);
//                         }
//                         if (style_table.skin && hWear.model) {
//                             hWear.model.SetSkin(style_table.skin);
//                         }
//                         if (style_table.skin && !hWear.model) {
//                             //  召唤物款式， 目前仅发现德鲁伊熊灵
//                             this.summon_skin = style_table.skin;
//                         }
//                     }
//                 }
//                 else if (am_table.type == "additional_wearable") {
//                     //  print("additional_wearable", am_table.asset)
//                     //  额外模型
//                     if (!hWear.additional_wearable) {
//                         hWear.additional_wearable = [];
//                     }
//                     let sModel = am_table.asset;
//                     let hModel = SpawnEntityFromTableSynchronous("prop_dynamic", { model: sModel }) as CBaseModelEntity;
//                     hModel.SetOwner(hUnit);
//                     hModel.SetParent(hUnit, "");
//                     hModel.FollowEntity(hUnit, true);
//                     hWear.additional_wearable.push(hModel);
//                 } else if (am_table.type == "entity_model") {
//                     //  更换英雄模型
//                     if (this.sHeroName == am_table.asset) {
//                         let sNewModel = am_table.modifier;
//                         if (!this.old_model) {
//                             this.old_model = hUnit.GetModelName();
//                         }
//                         hUnit.SetOriginalModel(sNewModel);
//                         hUnit.SetModel(sNewModel);
//                         hWear.bChangeModel = true;
//                     } else if (this.sHeroName == "npc_dota_hero_tiny") {
//                         // let sModelIndex = string.sub(am_table.asset, -1, -1)
//                         // nModelIndex = tonumber(sModelIndex) + 1
//                         // hUnit["Model" + nModelIndex] = am_table.modifier
//                         // if ( nModelIndex == hUnit.nModelIndex ) {
//                         //     hUnit.SetOriginalModel(am_table.modifier)
//                         //     hUnit.SetModel(am_table.modifier)
//                         // }
//                     } else {
//                         //  更换召唤物模型
//                         this.summon_model = this.summon_model || {};
//                         this.summon_model[am_table.asset] = am_table.modifier;
//                         hWear.bChangeSummon = hWear.bChangeSummon || {};
//                         hWear.bChangeSummon[am_table.asset] = true;
//                         //  召唤物skin写在外面，目前发现骨法金棒子 剑圣金猫
//                         let nSkin = asset_modifiers["skin"];
//                         if (nSkin != null) {
//                             this.summon_skin = nSkin;
//                         }
//                     }
//                 } else if (am_table.type == "hero_model_change") {
//                     //  更换英雄变身模型
//                     //  print("hero_model_change", am_table.asset)
//                     if (!am_table.style || tostring(am_table.style) == sStyle) {
//                         // this.hero_model_change = am_table;
//                     }
//                 } else if (am_table.type == "model") {
//                     //  更换其他饰品模型
//                     //  print("hero_model_change", am_table.asset)
//                     if (!am_table.style || tostring(am_table.style) == sStyle) {
//                         hWear.model_modifiers = hWear.model_modifiers || [];
//                         hWear.model_modifiers.push(am_table);
//                         for (let hSubWear of Object.values(this.Slots)) {
//                             if (hSubWear != hWear && hSubWear.model && hSubWear.model.GetModelName() == am_table.asset) {
//                                 hSubWear.model.SetModel(am_table.modifier);
//                             }
//                         }
//                     }
//                 }
//             }
//             //  一定要在更换模型后面，否则可能找不到attachment
//             for (let am_name in asset_modifiers) {
//                 let am_table = asset_modifiers[am_name];
//                 if (type(am_table) !== "table") {
//                     continue;
//                 }
//                 if (am_table.type == "particle_create") {
//                     //  周身特效
//                     if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.spawn_in_loadout_only) {
//                         let particle_name = am_table.modifier;
//                         let bReplaced = false;
//                         if (!this.IsDisplayInLoadout(sSlotName)) {
//                             //  隐藏槽位查看特效是否已被替换
//                             for (let hSubWear of Object.values(this.Slots)) {
//                                 if (hSubWear.replace_particle_names && hSubWear.replace_particle_names[particle_name]) {
//                                     bReplaced = true;
//                                     hWear.particles[particle_name] = null;
//                                     break;
//                                 }
//                             }
//                         }
//                         if (!bReplaced) {
//                             this.AddParticle(hWear, particle_name, sSlotName, sStyle);
//                         }
//                     }
//                 } else if (am_table.type == "particle") {
//                     //  替换其他饰品的周身特效
//                     if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.spawn_in_loadout_only) {
//                         let default_particle_name = am_table.asset;
//                         let particle_name = am_table.modifier;
//                         for (let hSubWear of Object.values(this.Slots)) {
//                             for (let p_name in hSubWear.particles) {
//                                 let sub_p = hSubWear.particles[p_name];
//                                 if (default_particle_name == p_name) {
//                                     if (sub_p != null) {
//                                         ParticleManager.DestroyParticle(sub_p, true);
//                                         ParticleManager.ReleaseParticleIndex(sub_p);
//                                         hSubWear.particles[p_name] = null;
//                                     }
//                                     break;
//                                 }
//                             }
//                         }
//                         let p = this.AddParticle(hWear, particle_name, sSlotName, sStyle);
//                         hWear.replace_particle_names = hWear.replace_particle_names || {};
//                         hWear.replace_particle_names[default_particle_name] = true;
//                         // if (this.sHeroName == "npc_dota_hero_tiny" && nModelIndex > 0) {
//                         // hUnit["Particles" + nModelIndex][particle_name] = {
//                         //     pid = p,
//                         //     hWearParticles = hWear["particles"],
//                         //     recreate =  () => {
//                         //         return Wearable.AddParticle(hUnit, hWear, particle_name, sSlotName, sStyle)
//                         //     }
//                         // }
//                         // }
//                     }
//                 } else if (am_table.type == "particle_projectile") {
//                     //  更换攻击弹道特效
//                     if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.spawn_in_loadout_only) {
//                         let default_projectile = am_table.asset;
//                         let new_projectile = am_table.modifier;
//                         if (hUnit.GetRangedProjectileName() == default_projectile) {
//                             hWear.default_projectile = default_projectile;
//                         } else {
//                             hWear.default_projectile = am_table.asset;
//                         }
//                         hUnit.SetRangedProjectileName(new_projectile);
//                         this.new_projectile = new_projectile;
//                     }
//                 } else if (am_table.type == "model_skin") {
//                     //  模型皮肤
//                     //  print("model_skin", am_table.skin)
//                     if (!am_table.style || tostring(am_table.style) == sStyle) {
//                         hUnit.SetSkin(am_table.skin);
//                         hWear.bChangeSkin = true;
//                     }
//                 } else if (am_table.type == "activity") {
//                     //  修改动作
//                     //  print("activity", am_table.modifier)
//                     if (!am_table.style || tostring(am_table.style) == sStyle) {
//                         // ActivityModifier.AddWearableActivity(hUnit, am_table.modifier, sItemDef);
//                         hWear.bActivity = true;
//                     }
//                 } else if (am_table.type == "entity_scale") {
//                     //  修改模型大小
//                     //  print("activity", am_table.modifier)
//                     if ((!am_table.style || tostring(am_table.style) == sStyle) && !am_table.asset) {
//                         hUnit.SetModelScale(am_table.scale_size);
//                         hWear.bChangeScale = true;
//                     }
//                 }
//             }
//         }
//         this.Slots[sSlotName] = hWear;
//         this.SpecialFixParticles(sItemDef, hWear, sSlotName, sStyle);
//         // this.RefreshSpecial(hUnit)
//         if (nModelIndex > 0) {
//             // Wearable.SwitchTinyParticles(hUnit)
//         }
//         // if ( DefaultPrismatic && DefaultPrismatic[sItemDef] && !hUnit.prismatic ) {
//         //     let sPrismaticName = DefaultPrismatic[sItemDef]
//         //     Wearable.SwitchPrismatic(hUnit, sPrismaticName)
//         // }
//     }

//     //  脱下饰品
//     TakeOffSlot(sSlotName: string) {
//         let SlotInfo = this.Slots[sSlotName];
//         if (SlotInfo) {
//             let hUnit = this.GetDomain<IBaseNpc_Plus>();
//             if (SlotInfo.particles) {
//                 for (let p_name in SlotInfo.particles) {
//                     let p = SlotInfo.particles[p_name];
//                     if (p != null) {
//                         ParticleManager.DestroyParticle(p, true);
//                         ParticleManager.ReleaseParticleIndex(p);
//                         SlotInfo.particles[p_name] = null;
//                     }
//                     if (this.prismatic_particles && this.prismatic_particles[p_name]) {
//                         this.prismatic_particles[p_name] = null;
//                     }
//                 }
//             }
//             if (SlotInfo.replace_particle_names) {
//                 //  恢复被替换的特效
//                 for (let replace_p_name in SlotInfo.replace_particle_names) {
//                     for (let sSubSlotName in this.Slots) {
//                         let hSubWear = this.Slots[sSubSlotName];
//                         for (let p_name in hSubWear.particles) {
//                             if (replace_p_name == p_name) {
//                                 this.AddParticle(hSubWear, replace_p_name, sSubSlotName);
//                                 break;
//                             }
//                         }
//                     }
//                 }
//             }
//             if (SlotInfo.default_projectile) {
//                 this.new_projectile = null;
//                 hUnit.SetRangedProjectileName(SlotInfo.default_projectile);
//             }
//             if (SlotInfo.additional_wearable) {
//                 for (let prop of SlotInfo.additional_wearable) {
//                     if (prop && IsValidEntity(prop)) {
//                         prop.RemoveSelf();
//                     }
//                 }
//             }
//             if (SlotInfo.model) {
//                 let prop = SlotInfo.model;
//                 if (prop && IsValidEntity(prop)) {
//                     prop.RemoveSelf();
//                 }
//             }
//             if (SlotInfo.bChangeSkin) {
//                 hUnit.SetSkin(0);
//             }
//             if (SlotInfo.bChangeModel) {
//                 hUnit.SetOriginalModel(this.old_model);
//                 hUnit.SetModel(this.old_model);
//             }
//             if (SlotInfo.bChangeSummon) {
//                 for (let sSummonName in SlotInfo.bChangeSummon) {
//                     SlotInfo.bChangeSummon[sSummonName] = false;
//                     this.summon_model[sSummonName] = null;
//                     delete this.summon_model[sSummonName];
//                 }
//             }
//             if (SlotInfo.bActivity) {
//                 // ActivityModifier.RemoveWearableActivity(hUnit, hUnit.Slots[sSlotName].itemDef);
//             }
//             this.summon_skin = null;
//             if (SlotInfo.bPersona) {
//                 this.bPersona = null;
//                 SlotInfo.bPersona = null; //  防止stack overflow
//                 this.SwitchPersona(false);
//             }
//             if (SlotInfo.bChangeScale) {
//                 let nDefaultScale = this.GetHeroConfig().ModelScale;
//                 hUnit.SetModelScale(nDefaultScale);
//             }
//             if (SlotInfo.model_modifiers) {
//                 for (let tModifier of Object.values(SlotInfo.model_modifiers)) {
//                     for (let hSubWear of Object.values(this.Slots)) {
//                         if (hSubWear != SlotInfo && hSubWear.model && hSubWear.model.GetModelName() == tModifier.modifier) {
//                             hSubWear.model.SetModel(tModifier.asset);
//                         }
//                     }
//                 }
//             }
//             this.Slots[sSlotName] = null;
//             delete this.Slots[sSlotName];
//         }
//     }

//     //  复制英雄饰品
//     WearLike(hUnitOrigin: WearableComponent) {
//         if (hUnitOrigin.Slots) {
//             this.Slots = {};
//             for (let hWear of Object.values(hUnitOrigin.Slots)) {
//                 this.Wear(hWear.itemDef, hWear.style);
//             }
//         }
//     }

//     //  显示英雄饰品
//     ShowWearables() {
//         //  print("ShowWearables", hUnit.Slots, IsServer())
//         for (let sSlotName in this.Slots) {
//             let hWear = this.Slots[sSlotName];
//             if (hWear.model) {
//                 hWear.model.RemoveEffects(EntityEffects.EF_NODRAW);
//             }
//             if (hWear.particles) {
//                 for (let p_name in hWear.particles) {
//                     let p = hWear.particles[p_name];
//                     if (this.prismatic_particles && this.prismatic_particles[p_name]) {
//                         this.prismatic_particles[p_name].hidden = false;
//                     }
//                     let new_p = this.AddParticle(hWear, p_name, sSlotName, hWear.style);
//                 }
//             }
//             if (hWear.additional_wearable) {
//                 for (let prop of hWear.additional_wearable) {
//                     if (prop && IsValidEntity(prop)) {
//                         prop.RemoveEffects(EntityEffects.EF_NODRAW);
//                     }
//                 }
//             }
//         }
//     }
//     //  隐藏英雄饰品
//     HideWearables() {
//         //  print("HideWearable", hUnit.Slots, IsServer())
//         for (let hWear of Object.values(this.Slots)) {
//             if (hWear.model) {
//                 hWear.model.AddEffects(EntityEffects.EF_NODRAW);
//             }
//             if (hWear.particles) {
//                 for (let p_name in hWear.particles) {
//                     let p = hWear.particles[p_name];
//                     if (p != null) {
//                         ParticleManager.DestroyParticle(p, true);
//                         ParticleManager.ReleaseParticleIndex(p);
//                     }
//                     if (this.prismatic_particles && this.prismatic_particles[p_name]) {
//                         this.prismatic_particles[p_name].hidden = true;
//                     }
//                 }
//             }
//             if (hWear.additional_wearable) {
//                 for (let prop of hWear.additional_wearable) {
//                     if (prop && IsValidEntity(prop)) {
//                         prop.AddEffects(EntityEffects.EF_NODRAW);
//                     }
//                 }
//             }
//         }
//     }
// }
