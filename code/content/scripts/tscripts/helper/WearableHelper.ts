
export module WearableHelper {
    export enum EAttach_map {
        customorigin = ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
        PATTACH_CUSTOMORIGIN = ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
        point_follow = ParticleAttachment_t.PATTACH_POINT_FOLLOW,
        PATTACH_POINT_FOLLOW = ParticleAttachment_t.PATTACH_POINT_FOLLOW,
        absorigin_follow = ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
        PATTACH_ABSORIGIN_FOLLOW = ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
        rootbone_follow = ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW,
        PATTACH_ROOTBONE_FOLLOW = ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW,
        renderorigin_follow = ParticleAttachment_t.PATTACH_RENDERORIGIN_FOLLOW,
        PATTACH_RENDERORIGIN_FOLLOW = ParticleAttachment_t.PATTACH_RENDERORIGIN_FOLLOW,
        absorigin = ParticleAttachment_t.PATTACH_ABSORIGIN,
        PATTACH_ABSORIGIN = ParticleAttachment_t.PATTACH_ABSORIGIN,
        customorigin_follow = ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
        PATTACH_CUSTOMORIGIN_FOLLOW = ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
        worldorigin = ParticleAttachment_t.PATTACH_WORLDORIGIN,
        PATTACH_WORLDORIGIN = ParticleAttachment_t.PATTACH_WORLDORIGIN,
    }
    const PrismaticParticles = {};
    const DefaultPrismatic = {};
    const EtherealParticles = {};
    const EtherealParticle2Names = {};
    let asset_modifier: { [k: string]: any } = {};
    let control_points: { [k: string]: any } = {};
    let respawn_items: { [k: string]: any } = {};
    const Allheroes: { [k: string]: IHeroInfo } = {};
    const Allitems: { [k: string]: any } = {}; //  所有饰品信息
    const Allbundles: { [k: string]: number[] } = {}; //  捆绑包
    const Allcouriers: { [k: string]: any } = {}; //  信使
    const Allwards: { [k: string]: any } = {}; //  守卫
    const Allprismatics: { [k: string]: any } = {}; //  棱彩宝石

    interface IItemSlot {
        SlotName?: string;
        SlotText?: string;
        SlotIndex?: number;
        DisplayInLoadout?: number;
        ItemDefs?: number[];
        DefaultItem?: number;
        styles?: any;
    }
    interface IHeroInfo {
        Bundles?: number[]; // 捆绑包
        ModelScale?: number;
        Slots?: { [k: string]: IItemSlot };
        SlotIndex2Name?: { [k: string]: string };
    }


    // export function RequestParticles(response) {
    //     Http.RequestParticles((sBody) => {
    //         if (!sBody) {
    //             response(false);
    //             return;
    //         }
    //         let hBody = JSON.decode(sBody);
    //         //  PrintTable(hBody)
    //         PrismaticParticles = hBody.PrismaticParticles || PrismaticParticles;
    //         DefaultPrismatic = hBody.DefaultPrismatic || DefaultPrismatic;
    //         EtherealParticles = hBody.EtherealParticles || EtherealParticles;
    //         //  虚灵宝石
    //         let EtherealParticleKeys = {};
    //         for (let sEtherealParticle of EtherealParticles) {
    //             EtherealParticleKeys[sEtherealName] = 1;
    //             EtherealParticle2Names[sEtherealParticle] = sEtherealName;
    //             PrismaticParticles[sEtherealParticle] = 1;
    //         }

    //         CustomNetTables.SetTableValue("gems", "prismatics", Wearable.prismatics);
    //         CustomNetTables.SetTableValue("gems", "ethereals", EtherealParticleKeys);
    //         Wearable.PrismaticParticles = PrismaticParticles;
    //         response(true);
    //     });
    // }

    // export function ShowItemdefs() {
    //     let hPlayer = Convars.GetCommandClient();
    //     CustomGameEventManager.Send_ServerToPlayer(hPlayer, "ShowItemdefs", {});
    // }


    // //  重生单位，或者重生模式复制单位时，添加非重生饰品时使用
    //  WearAfterRespawn(hUnit, hNewWears) {
    //     hUnit.Slots = {}
    //     for (let hNewWear of ( hNewWears)) {

    //         let sItemDef = hNewWear.sItemDef
    //         if ( Wearable.respawn_items[sItemDef] == 1 && GameRules.herodemo.m_bRespawnWear ) {
    //             //  重生模型设置重生饰品table
    //             let hWear = {}
    //             hWear["itemDef"] = sItemDef
    //             hWear["bRespawnItem"] : true
    //             hWear["particles"] = {}
    //             hUnit.Slots[sSlotName] = hWear

    //             let asset_modifiers = Wearable.asset_modifier[sItemDef]
    //             if ( asset_modifiers ) {
    //                 for (let am_table of ( asset_modifiers )) {

    //                     if ( type(am_table) == "table" && am_table.type == "activity" ) {
    //                         //  修改动作
    //                         //  print("activity", am_table.modifier)
    //                         if ( !am_table.style || tostring(am_table.style) == sStyle ) {
    //                             ActivityModifier.AddWearableActivity(hUnit, am_table.modifier, sItemDef)
    //                             hWear["activity"] : true
    //                         }
    //                     } else if ( type(am_table) == "table" && am_table.type == "particle_projectile" ) {
    //                         //  更换攻击弹道特效
    //                         //  print("particle_projectile", am_table.modifier)
    //                         if (
    //                             ((!am_table.style) || tostring(am_table.style) == sStyle) &&
    //                                 (!am_table.spawn_in_loadout_only)
    //                          ) {
    //                             let default_projectile = am_table.asset
    //                             let new_projectile = am_table.modifier
    //                             if ( hUnit.GetRangedProjectileName() == default_projectile ) {
    //                                 //  print("new_projectile", new_projectile)
    //                                 hWear["default_projectile"] = default_projectile
    //                             } else {
    //                                 hWear["default_projectile"] = am_table.asset
    //                             }
    //                             hUnit.SetRangedProjectileName(new_projectile)
    //                             hUnit.new_projectile = new_projectile
    //                             print(hUnit, "new_projectile", hUnit.new_projectile)
    //                         }
    //                     } else if ( type(am_table) == "table" && am_table.type == "entity_model" ) {
    //                         //  print("entity_model", am_table.asset)
    //                         //  更换召唤物模型
    //                         hUnit.summon_model = hUnit.summon_model || {}
    //                         hUnit.summon_model[am_table.asset] = am_table.modifier
    //                         hWear["bChangeSummon"] = hWear["bChangeSummon"] || {}
    //                         hWear["bChangeSummon"][am_table.asset] : true

    //                         //  召唤物skin写在外面，目前发现骨法金棒子 剑圣金猫
    //                         let nSkin = asset_modifiers["skin"]
    //                         if ( nSkin != null ) {
    //                             hUnit.summon_skin = nSkin
    //                         }
    //                     }
    //                 }
    //             }

    //             if ( DefaultPrismatic && DefaultPrismatic[sItemDef] && !hUnit.prismatic ) {
    //                 let sPrismaticName = DefaultPrismatic[sItemDef]
    //                 Wearable.SwitchPrismatic(hUnit, sPrismaticName)
    //             }
    //         } else {
    //             //  重生模式穿非重生饰品，或者非重生模式穿任意饰品
    //             Wearable._WearProp(hUnit, sItemDef, sSlotName, "0")
    //         }
    //     }

    //     if ( hUnit.prismatic ) {
    //         Wearable.SwitchPrismatic(hUnit, hUnit.prismatic)
    //     }

    //     if ( hUnit.ethereals ) {
    //         for (let old_p_index of ( hUnit.ethereals)) {

    //             if ( old_p_index != false ) {
    //                 ParticleManager.DestroyParticle(old_p_index, true)
    //                 ParticleManager.ReleaseParticleIndex(old_p_index)
    //                 let particle_name = EtherealParticles[sEtherealName]
    //                 let p_index = Wearable.AddParticle(hUnit, null, particle_name, null, "0")
    //                 if ( hUnit.prismatic && Wearable.CanPrismatic(particle_name, hUnit.prismatic) ) {
    //                     let sHexColor = Wearable.prismatics[hUnit.prismatic].hex_color
    //                     let vColor = HexColor2RGBVector(sHexColor)
    //                     ParticleManager.SetParticleControl(p_index, 16, Vector(1, 0, 0))
    //                     ParticleManager.SetParticleControl(p_index, 15, vColor)
    //                 }
    //                 hUnit.ethereals[sEtherealName] = p_index
    //             }
    //         }
    //     }

    //     let unit_index = hUnit.GetEntityIndex()
    //     CustomNetTables.SetTableValue("hero_wearables", tostring(unit_index), hUnit.Slots)
    // }

    // //  通过重生带饰品的新单位来换多件饰品
    //  _WearItemsRespawn(hUnitOrigin, hNewWears) {
    //     let nUnitIndexOld = hUnitOrigin.nOriginID || hUnitOrigin.GetEntityIndex()

    //     let sUnitName = hUnitOrigin.sUnitName
    //     let sUnitNameWithWear = sUnitName

    //     let hBundle = {}
    //     for (let hNewWear of ( hNewWears)) {

    //         let sSubItemDef = hNewWear.sItemDef
    //         let sSubItemStyle = hNewWear.sStyle
    //         let hSubItem = {
    //             unit : nUnitIndexOld,
    //             itemDef : sSubItemDef,
    //             itemStyle : sSubItemStyle,
    //             slotName : sSubSlotName
    //         }
    //         table.insert(hBundle, hSubItem)
    //     }

    //     if ( GameRules.herodemo.m_bRespawnWear ) {
    //         sUnitNameWithWear = Wearable.GetRepawnUnitName(hUnitOrigin.sHeroName, hNewWears)
    //     }
    //     //  非重生模式时，需要重生一个默认单位，单位名不变

    //     let hPlayer = hUnitOrigin.GetPlayerOwner()
    //     let nPlayerID = hPlayer.GetPlayerID()
    //     let hPlayerHero = PlayerResource.GetSelectedHeroEntity(nPlayerID)

    //     let position = hUnitOrigin.GetAbsOrigin()
    //     let forward = hUnitOrigin.GetForwardVector()
    //     print("_WearItemsRespawn", sUnitNameWithWear)

    //     CreateUnitByNameAsync(
    //         sUnitNameWithWear,
    //         position,
    //         true,
    //         null,
    //         null,
    //         hUnitOrigin.GetTeam(),
    //          (hUnitNew) => {
    //             table.insert(GameRules.herodemo.m_tAlliesList, hUnitNew)
    //             CustomNetTables.SetTableValue(
    //                 "hero_prismatic",
    //                 tostring(hUnitNew.GetEntityIndex()),
    //                 CustomNetTables.GetTableValue("hero_prismatic", tostring(hUnitOrigin.GetEntityIndex()))
    //             )
    //             CustomNetTables.SetTableValue(
    //                 "hero_ethereals",
    //                 tostring(hUnitNew.GetEntityIndex()),
    //                 CustomNetTables.GetTableValue("hero_ethereals", tostring(hUnitOrigin.GetEntityIndex()))
    //             )

    //             CustomNetTables.SetTableValue("hero_wearables", tostring(hUnitOrigin.GetEntityIndex()), null)
    //             CustomNetTables.SetTableValue("hero_prismatic", tostring(hUnitOrigin.GetEntityIndex()), null)
    //             CustomNetTables.SetTableValue("hero_ethereals", tostring(hUnitOrigin.GetEntityIndex()), null)

    //             hUnitNew.nOriginID = nUnitIndexOld
    //             hUnitNew.prismatic = hUnitOrigin.prismatic
    //             hUnitNew.ethereals = hUnitOrigin.ethereals
    //             hUnitOrigin.RemoveSelf()
    //             hUnitNew.SetOwner(hPlayerHero)
    //             hUnitNew.SetControllableByPlayer(nPlayerID, false)
    //             //  hUnitNew.SetRespawnPosition(hPlayerHero.GetAbsOrigin())
    //             FindClearSpaceForUnit(hUnitNew, position, false)
    //             hUnitNew.SetForwardVector(forward)
    //             hUnitNew.Hold()
    //             hUnitNew.SetIdleAcquire(false)
    //             hUnitNew.SetAcquisitionRange(0)
    //             hUnitNew.AddNewModifier(hUnit, null, "no_health_bar", null)
    //             hUnitNew.sUnitName = sUnitName
    //             hUnitNew.sHeroName = string.gsub(sUnitName, "npc_dota_unit", "npc_dota_hero")
    //             Wearable.WearAfterRespawn(hUnitNew, hNewWears)
    //             CustomGameEventManager.Send_ServerToPlayer(
    //                 hPlayer,
    //                 "RespawnWear",
    //                 {
    //                     old_unit = nUnitIndexOld,
    //                     new_unit = hUnitNew.GetEntityIndex(),
    //                     bundle = hBundle
    //                 }
    //             )
    //         }
    //     )
    // }







    //  RefreshSpectreArcana(hUnit, sStyle) {
    //     if ( hUnit.GetModelName() == "models/items/spectre/spectre_arcana/spectre_arcana_base.vmdl" ) {
    //         //  幽鬼至宝，把五把刀设置出来
    //         hUnit.SetBodygroupByName("blade_01", 1)
    //         hUnit.SetBodygroupByName("blade_02", 1)
    //         hUnit.SetBodygroupByName("blade_03", 1)
    //         hUnit.SetBodygroupByName("blade_04", 1)
    //         hUnit.SetBodygroupByName("blade_05", 1)
    //     }

    //     for (let hWear of ( hUnit.Slots)) {

    //         if ( hWear["model"] ) {
    //             if ( sStyle == "1" ) {
    //                 hWear["model"]:SetBodygroupByName("arcana", 2)
    //             } else {
    //                 hWear["model"]:SetBodygroupByName("arcana", 0)
    //             }
    //         }
    //     }
    // }

    //  RefreshSpecial(hUnit) {
    //     for (let hWear of ( hUnit.Slots)) {

    //         if ( hWear.itemDef == "9662" ) {
    //             Wearable.RefreshSpectreArcana(hUnit, hWear.style)
    //             return
    //         }
    //     }
    // }





    //  WearCourier(hUnit, sItemDef, sStyle, bFlying, bDire) {
    //     print("WearCourier", hUnit, sItemDef, sStyle, type(sItemDef), type(sStyle), bFlying, bDire)
    //     let hItem = Wearable.items[sItemDef]

    //     if ( type(sItemDef) != "string" ) {
    //         sItemDef = tostring(sItemDef)
    //     }

    //     if ( !sStyle ) {
    //         sStyle = "0"
    //     } else if ( type(sStyle) != "string" ) {
    //         sStyle = tostring(sStyle)
    //     }

    //     //  删除原有特效
    //     hUnit.skin = 0
    //     if ( hUnit["particles"] ) {
    //         for p_name, p in pairs(hUnit["particles"]) do
    //             if ( p != false ) {
    //                 ParticleManager.DestroyParticle(p, true)
    //                 ParticleManager.ReleaseParticleIndex(p)
    //             }
    //             if ( hUnit["prismatic_particles"] && hUnit["prismatic_particles"][p_name] ) {
    //                 hUnit["prismatic_particles"][p_name] = null
    //             }
    //             hUnit["particles"][p_name] = null
    //         }
    //     }

    //     let asset_modifiers = Wearable.asset_modifier[sItemDef]
    //     if ( asset_modifiers ) {
    //         if ( asset_modifiers["skin"] ) {
    //             //  设置模型皮肤
    //             hUnit.skin = asset_modifiers["skin"]
    //         }
    //         for (let am_table of ( asset_modifiers)) {

    //             if ( am_name == "styles" ) {
    //                 //  不同款式设置模型皮肤
    //                 let style_table = am_table[sStyle]
    //                 if ( style_table && style_table.skin ) {
    //                     hUnit.skin = style_table.skin
    //                 }
    //             } else if (
    //                 type(am_table) == "table" &&
    //                     ((bDire && am_table.asset == "dire") || ((!bDire) && am_table.asset == "radiant"))
    //              ) {
    //                 if (
    //                     ((!bFlying) && type(am_table) == "table" && am_table.type == "courier") ||
    //                         (bFlying && type(am_table) == "table" && am_table.type == "courier_flying")
    //                  ) {
    //                     if ( ((!am_table.style) || tostring(am_table.style) == sStyle) ) {
    //                         let sNewModel = am_table.modifier
    //                         print(sNewModel)
    //                         hUnit.SetOriginalModel(sNewModel)
    //                         hUnit.SetModel(sNewModel)
    //                     }
    //                 }
    //             }
    //         }

    //         hUnit.SetSkin(hUnit.skin)

    //         for (let am_table of ( asset_modifiers)) {

    //             if ( type(am_table) == "table" && am_table.type == "particle_create" ) {
    //                 //  周身特效
    //                 if ( ((!am_table.style) || tostring(am_table.style) == sStyle) ) {
    //                     if ( (!am_table.flying_courier_only) || bFlying ) {
    //                         if ( ((!am_table.radiant_only) || (!bDire)) && ((!am_table.dire_only) || bDire) ) {
    //                             let particle_name = am_table.modifier
    //                             let p = Wearable.AddParticle(hUnit, hWear, particle_name, sSlotName, sStyle)
    //                             hUnit.particles = hUnit.particles || {}
    //                             hUnit.particles[particle_name] = p
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     if ( bFlying && (!hUnit.HasModifier("flying")) ) {
    //         hUnit.AddNewModifier(hUnit, null, "flying", {})
    //     } else if ( (!bFlying) && hUnit.HasModifier("flying") ) {
    //         hUnit.RemoveModifierByName("flying")
    //     }
    // }

    //  WearWard(hUnit, sItemDef, sStyle) {
    //     print("WearWard", hUnit, sItemDef, sStyle)
    //     let hItem = Wearable.items[sItemDef]

    //     if ( !sStyle ) {
    //         sStyle = "0"
    //     } else if ( type(sStyle) != "string" ) {
    //         sStyle = tostring(sStyle)
    //     }

    //     //  删除原有特效
    //     if ( hUnit["particles"] ) {
    //         for p_name, p in pairs(hUnit["particles"]) do
    //             if ( p != false ) {
    //                 ParticleManager.DestroyParticle(p, true)
    //                 ParticleManager.ReleaseParticleIndex(p)
    //             }
    //             if ( hUnit["prismatic_particles"] && hUnit["prismatic_particles"][p_name] ) {
    //                 hUnit["prismatic_particles"][p_name] = null
    //             }
    //             hUnit["particles"][p_name] = null
    //         }
    //     }

    //     let asset_modifiers = Wearable.asset_modifier[sItemDef]
    //     if ( asset_modifiers ) {
    //         for (let am_table of ( asset_modifiers)) {

    //             if ( am_name == "styles" ) {
    //                 //  不同款式设置模型皮肤
    //                 let style_table = am_table[sStyle]
    //                 if ( style_table && style_table.skin ) {
    //                     hUnit.skin = style_table.skin
    //                 }
    //             } else if (
    //                 type(am_table) == "table" && am_table.type == "entity_model" && hUnit.GetUnitName() == am_table.asset
    //              ) {
    //                 if ( ((!am_table.style) || tostring(am_table.style) == sStyle) ) {
    //                     let sNewModel = am_table.modifier
    //                     print(sNewModel)
    //                     hUnit.SetOriginalModel(sNewModel)
    //                     hUnit.SetModel(sNewModel)
    //                 }
    //             }
    //         }

    //         for (let am_table of ( asset_modifiers)) {

    //             if ( type(am_table) == "table" && am_table.type == "particle_create" ) {
    //                 //  周身特效
    //                 if ( ((!am_table.style) || tostring(am_table.style) == sStyle) ) {
    //                     let particle_name = am_table.modifier
    //                     let p = Wearable.AddParticle(hUnit, hWear, particle_name, sSlotName, sStyle)
    //                     hUnit.particles = hUnit.particles || {}
    //                     hUnit.particles[particle_name] = p
    //                 }
    //             }
    //         }
    //     }
    // }



    //  CanPrismatic(sParticle, sPrismatic) {
    //     if ( sParticle == "particles/econ/courier/courier_trail_lava/courier_trail_lava.vpcf" && sPrismatic == "unusual_red") {
    //         return false
    //     }
    //     return true
    // }

    // //  切换棱彩宝石，如果切换的是已有的则去除
    //  SwitchPrismatic(hUnit, sPrismaticName) {
    //     print("SwitchPrismatic", hUnit.prismatic, sPrismaticName)
    //     if ( hUnit.prismatic == sPrismaticName ) {
    //         Wearable.RemovePrismatic(hUnit)
    //         return
    //     }

    //     let projectile = hUnit.GetRangedProjectileName()
    //     if (
    //         !hUnit["prismatic_particles"] && !PrismaticParticles[projectile] &&
    //             !(hUnit.Slots && hUnit.Slots["summon"] && hUnit.Slots["summon"]["itemDef"] == "7380")
    //      ) {
    //         Notifications.BottomToAll(
    //             {
    //                 text : "NoPrismaticParticle",
    //                 duration : 3,
    //                 style : {
    //                     color : "white",
    //                     ["font-size"] : "30px",
    //                     ["background-color"] : "rgb(136, 34, 34)",
    //                     opacity : "0.5"
    //                 }
    //             }
    //         )

    //         return
    //     }

    //     hUnit.prismatic = sPrismaticName
    //     let sHexColor = Wearable.prismatics[sPrismaticName].hex_color
    //     let vColor = HexColor2RGBVector(sHexColor)

    //     if ( hUnit["prismatic_particles"] ) {
    //         for particle_name, p_table in pairs(hUnit["prismatic_particles"]) do
    //             if ( !p_table.hidden ) {
    //                 let particle_index = p_table.particle_index
    //                 let sSlotName = p_table.slot_name
    //                 let sStyle = p_table.style
    //                 let hWear = null
    //                 if ( hUnit.Slots ) {
    //                     hWear = hUnit.Slots[sSlotName]
    //                 }
    //                 //  if ( hWear["model"] ) {
    //                 //      hWear["model"]:SetRenderColor(vColor.x, vColor.y, vColor.z)
    //                 //  }
    //                 if ( particle_index != false ) {
    //                     ParticleManager.DestroyParticle(particle_index, true)
    //                     ParticleManager.ReleaseParticleIndex(particle_index)
    //                 }
    //                 let new_p_index = Wearable.AddParticle(hUnit, hWear, particle_name, sSlotName, sStyle)

    //                 if ( Wearable.CanPrismatic(particle_name, sPrismaticName) ) {
    //                     ParticleManager.SetParticleControl(new_p_index, 16, Vector(1, 0, 0))
    //                     ParticleManager.SetParticleControl(new_p_index, 15, vColor)
    //                 }

    //                 p_table.particle_index = new_p_index
    //                 if ( hWear ) {
    //                     hWear["particles"][particle_name] = new_p_index
    //                 }

    //                 let sEtherealName = EtherealParticle2Names[particle_name]
    //                 if ( sEtherealName ) {
    //                     hUnit.ethereals[sEtherealName] = new_p_index
    //                 }
    //             }
    //         }
    //     }

    //     CustomNetTables.SetTableValue("hero_prismatic", tostring(hUnit.GetEntityIndex()), {prismatic_name = sPrismaticName})
    // }

    // //  移除棱彩宝石
    //  RemovePrismatic(hUnit) {
    //     print("RemovePrismatic")
    //     hUnit.prismatic = null

    //     if ( hUnit["prismatic_particles"] ) {
    //         for particle_name, p_table in pairs(hUnit["prismatic_particles"]) do
    //             let particle_index = p_table.particle_index
    //             let sSlotName = p_table.slot_name
    //             let sStyle = p_table.style
    //             let hWear = null
    //             if ( hUnit.Slots ) {
    //                 hWear = hUnit.Slots[sSlotName]
    //             }
    //             if ( particle_index != false ) {
    //                 ParticleManager.DestroyParticle(particle_index, true)
    //                 ParticleManager.ReleaseParticleIndex(particle_index)
    //             }
    //             let new_p_index = Wearable.AddParticle(hUnit, hWear, particle_name, sSlotName, sStyle)

    //             p_table.particle_index = new_p_index
    //             if ( hWear ) {
    //                 hWear["particles"][particle_name] = new_p_index
    //             }

    //             let sEtherealName = EtherealParticle2Names[particle_name]
    //             if ( sEtherealName ) {
    //                 hUnit.ethereals[sEtherealName] = new_p_index
    //             }
    //         }
    //     }

    //     CustomNetTables.SetTableValue("hero_prismatic", tostring(hUnit.GetEntityIndex()), {prismatic_name = null})
    // }

    // //  开关虚灵宝石
    //  ToggleEthereal(hUnit, sEtherealName) {
    //     print("ToggleEthereal", hUnit, sEtherealName)
    //     hUnit.ethereals = hUnit.ethereals || {}
    //     let particle_name = EtherealParticles[sEtherealName]
    //     if ( !hUnit.ethereals[sEtherealName] ) {
    //         let p_index = Wearable.AddParticle(hUnit, null, particle_name, null, "0")
    //         if ( hUnit.prismatic && Wearable.CanPrismatic(particle_name, hUnit.prismatic) ) {
    //             let sHexColor = Wearable.prismatics[hUnit.prismatic].hex_color
    //             let vColor = HexColor2RGBVector(sHexColor)
    //             ParticleManager.SetParticleControl(p_index, 16, Vector(1, 0, 0))
    //             ParticleManager.SetParticleControl(p_index, 15, vColor)
    //         }
    //         hUnit.ethereals[sEtherealName] = p_index
    //     } else {
    //         let p_index = hUnit.ethereals[sEtherealName]
    //         if ( p_index != false ) {
    //             ParticleManager.DestroyParticle(p_index, true)
    //             ParticleManager.ReleaseParticleIndex(p_index)
    //         }
    //         hUnit.ethereals[sEtherealName] : false
    //         hUnit["prismatic_particles"][particle_name] = null
    //     }

    //     CustomNetTables.SetTableValue("hero_ethereals", tostring(hUnit.GetEntityIndex()), hUnit.ethereals)
    // }

    // //  重置宝石
    //  ResetGems(hUnit) {
    //     if ( !hUnit.ethereals ) {
    //         return
    //     }
    //     for (let p_index of ( hUnit.ethereals)) {

    //         if ( p_index ) {
    //             Wearable.ToggleEthereal(hUnit, sEtherealName)
    //         }
    //     }
    //     Wearable.RemovePrismatic(hUnit)
    // }

    // //  预读取单位饰品
    //  UICacheAvailableItems(sUnitName) {
    //     let sHeroName = string.gsub(sUnitName, "npc_dota_unit", "npc_dota_hero")
    //     if ( !CustomNetTables.GetTableValue("hero_available_items", sUnitName) ) {
    //         CustomNetTables.SetTableValue("hero_available_items", sUnitName, Wearable.heroes[sHeroName])
    //     }
    //     //  PrintTable(CustomNetTables.GetTableValue("hero_available_items", sUnitName))
    // }

    // //  预读取信使饰品
    //  UICacheAvailableCouriers() {
    //     if ( !CustomNetTables.GetTableValue("other_available_items", "courier") ) {
    //         CustomNetTables.SetTableValue("other_available_items", "courier", Wearable.couriers)
    //     }
    //     //  PrintTable(CustomNetTables.GetTableValue("other_available_items", "courier"))
    // }

    // //  预读取守卫饰品
    //  UICacheAvailableWards() {
    //     if ( !CustomNetTables.GetTableValue("other_available_items", "ward") ) {
    //         CustomNetTables.SetTableValue("other_available_items", "ward", Wearable.wards)
    //     }
    //     //  PrintTable(CustomNetTables.GetTableValue("other_available_items", "courier"))
    // }







    // //  换装搭配
    //  WearCombination(hUnit, sSectId) {
    //     let sHeroName = hUnit.sHeroName
    //     if ( !type(sSectId) == "string" ) {
    //         sSectId = tostring(sSectId)
    //     }
    //     let hCombination = Wearable.combination[sSectId]
    //     let nHeroID = DOTAGameManager.GetHeroIDByName(hUnit.sHeroName)
    //     if ( nHeroID != tonumber(hCombination.heroID) ) {
    //         return
    //     }
    //     if ( Wearable.ShouldRespawnForCombination(hUnit, hCombination) ) {
    //         let hNewWears = {}

    //         for (let nSlotIndex = 0; nSlotIndex <= 10 ; nSlotIndex++) {
    //             let nItemDef = hCombination["itemDef" + nSlotIndex]
    //             let sStyle = hCombination["style" + nSlotIndex]
    //             let sSlotName = Wearable.GetSlotNameBySlotIndex(sHeroName, nSlotIndex)
    //             if ( sSlotName && nItemDef != 0 && nItemDef != "0" ) {
    //                 hNewWears[sSlotName] = {sItemDef = tostring(nItemDef), sStyle = sStyle}
    //             }
    //         }
    //         Wearable._WearItemsRespawn(hUnit, hNewWears)
    //     } else {
    //         for (let nSlotIndex = 0; nSlotIndex <= 10 ; nSlotIndex++) {
    //             let nItemDef = hCombination["itemDef" + nSlotIndex]
    //             let sStyle = hCombination["style" + nSlotIndex]
    //             let sSlotName = Wearable.GetSlotNameBySlotIndex(sHeroName, nSlotIndex)
    //             if ( sSlotName && nItemDef != 0 && nItemDef != "0" ) {
    //                 Wearable._WearProp(hUnit, tostring(nItemDef), sSlotName, sStyle)
    //             }
    //         }
    //         let unit_index = hUnit.GetEntityIndex()
    //         CustomNetTables.SetTableValue("hero_wearables", tostring(unit_index), hUnit.Slots)
    //     }
    // }

    // //  缓存搭配
    //  CacheCombination(hCombination) {
    //     hCombination.SectId = tostring(hCombination.SectId)
    //     Wearable.combination[hCombination.SectId] = hCombination
    // }

    //  CacheCombinationPage(hPage) {
    //     for (let hCombination of ( hPage )) {

    //         Wearable.CacheCombination(hCombination)
    //     }
    // }












}
