import { NetTablesHelper } from "./helper/NetTablesHelper";
import { ResHelper } from "./helper/ResHelper";
import { GameServiceConfig } from "./shared/GameServiceConfig";

export module GameFunc {


    export function ToRadians(degrees: number) {
        return degrees * math.pi / 180

    }

    export function ToDegrees(radians: number) {
        return radians * 180 / math.pi
    }

    export function Pair<T>(obj: { [k: string]: T }): [string, T][] {
        let arr: [string, T][] = [];
        let keys = Object.keys(obj);
        keys.sort();
        for (const key of keys) {
            const element = obj[key];
            arr.push([key, element]);
        }
        return arr;
    }

    export function iPair<T>(obj: T[]): [number, T][] {
        let arr: [number, T][] = [];
        if (obj) {
            for (let i = 0, len = obj.length; i < len; i++) {
                const element = obj[i];
                arr.push([i, element]);
            }
        }
        return arr;
    }


    export function GetCount(obj: any[]): number {
        return obj.length
    }


    export function HasBit(n: number, a: number): boolean {
        return IncludeArgs(n, a)[0]
    }
    /**
     * 位运算判断参数是否包含
     * @param n
     * @param arg
     * @returns
     */
    export function IncludeArgs(n: number, ...arg: Array<number>) {
        n = n | 0; // 将浮点数n转化为正整数
        let pad = 0;
        let arr: Array<number> = []; // 用于保存结果的数组
        while (n > 0) {
            if ((n & 1) > 0) arr.push(1 << pad);
            pad++;
            n >>= 1;
        }
        let r: Array<boolean> = [];
        arg.forEach((_a) => {
            r.push(arr.indexOf(_a) > -1);
        });
        return r;
    }
    /**
     * 获取全局唯一UUID
     * @returns
     */
    function GenerateUUID2() {
        let d = GameRules.GetGameTime();
        let t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        t = string.gsub(t, "x", (c: string) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        })[0];
        t = string.gsub(t, "y", (c: string) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        })[0];
        return t;
    }
    function GenerateUUID1() {
        let S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }

    let uuidCount: number = 0;
    function GenerateUUID() {
        uuidCount++;
        return DoUniqueString("" + RandomInt(1, 10000)) + uuidCount + "@";
    }
    /**
     * 获取服务器serverKey
     * @returns
     */
    export function GetServerKey() {
        if (IsServer()) {
            return (_G as any).__ServerKeyV2__;
        } else {
            return NetTablesHelper.GetData(GameServiceConfig.ENetTables.common, "encrypt_key")._ || "";
        }
    }
    /**
     * 实例扩充方法
     * @param instance 实例
     * @param table 类
     */
    export function _BindInstanceToCls(_instance: any, table: new () => any) {
        if (_instance instanceof table) { return }
        let instance = getmetatable(_instance).__index as any;
        let { prototype } = table;
        while (prototype) {
            for (const key in prototype) {
                // Using hasOwnProperty to ignore methods from metatable added by ExtendInstance
                // https://github.com/SteamDatabase/GameTracking-Dota2/blob/7edcaa294bdcf493df0846f8bbcd4d47a5c3bd57/game/core/scripts/vscripts/init.lua#L195
                if (!instance.hasOwnProperty(key)) {
                    instance[key] = prototype[key];
                }
            }
            prototype = getmetatable(prototype);
        }
    }
    export function BindInstanceToCls(_instance: any, table: new () => any, bforce = false) {
        if (!bforce && _instance instanceof table) { return }
        Object.assign(getmetatable(_instance).__index, table.prototype);
    }
    /**
     * 获取对象原表索引数据
     * @param s
     * @returns
     */
    export function GetmetatableIndex(s: Object) {
        return getmetatable(s).__index as Object;
    }

    /**测量对象内存大小 todo */
    export function memSize(o: any) {
        collectgarbage("stop");
        let before = collectgarbage("count");
        let after = collectgarbage("count");
        return (after - before) * 1024;
    }


    export function Init() {

    }
}




export module FuncEntity {



    export function Custom_HasAnyAvailableInventorySpace(unit: IBaseNpc_Plus) {
        if (unit.IsHero()) {
            return unit.HasAnyAvailableInventorySpace();
        }
        else {
            for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i += 1) {
                let item = unit.GetItemInSlot(i);
                if (!item) {
                    return true;
                }
            }
            return false;
        }
    }
    export function Custom_IsTree(unit: IBaseNpc_Plus) {
        if (Custom_IsRegularTree(unit) || Custom_IsTempTree(unit)) {
            return true;
        }
        return false;
    }
    export function Custom_IsRegularTree(unit: IBaseNpc_Plus) {
        if ((unit as any as CDOTA_MapTree).CutDown) {
            return true;
        }
        return false;
    }
    export function Custom_IsTempTree(unit: IBaseNpc_Plus) {
        if (unit.GetClassname() == "dota_temp_tree") {
            return true;
        }
        return false;
    }


    export function Blink(unit: IBaseNpc_Plus, position: Vector, bTeamOnlyParticle: boolean, bPlaySound = true) {
        if (unit.IsNull()) {
            return;
        }
        if (bPlaySound == true) {
            EmitSoundOn("DOTA_Item.BlinkDagger.Activate", unit);
        }
        let blink_pfx;
        let blink_pfx_name = "particles/items_fx/blink_dagger_start.vpcf";
        if (bTeamOnlyParticle == true) {
            blink_pfx = ParticleManager.CreateParticleForTeam(blink_pfx_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, unit.GetTeamNumber(),);
            ParticleManager.SetParticleControl(blink_pfx, 0, unit.GetAbsOrigin());
        } else {
            blink_pfx = ResHelper.CreateParticleEx(blink_pfx_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined,);
            ParticleManager.SetParticleControl(blink_pfx, 0, unit.GetAbsOrigin());
        }
        ParticleManager.ReleaseParticleIndex(blink_pfx);
        FindClearSpaceForUnit(unit, position, true);
        ProjectileManager.ProjectileDodge(unit);
        let blink_end_pfx;
        let blink_end_pfx_name = "particles/items_fx/blink_dagger_end.vpcf";
        if (bTeamOnlyParticle == true) {
            blink_end_pfx = ParticleManager.CreateParticleForTeam(blink_end_pfx_name, ParticleAttachment_t.PATTACH_ABSORIGIN, unit, unit.GetTeamNumber(),);
        } else {
            blink_end_pfx = ResHelper.CreateParticleEx(blink_end_pfx_name, ParticleAttachment_t.PATTACH_ABSORIGIN, unit,);
        }
        ParticleManager.ReleaseParticleIndex(blink_end_pfx);
        if (bPlaySound == true) {
            EmitSoundOn("DOTA_Item.BlinkDagger.NailedIt", unit);
        }
    }

    export function ChangeAttackProjectileImba(unit: IBaseNpc_Plus) {
        let particle_deso = "particles/items_fx/desolator_projectile.vpcf";
        let particle_skadi = "particles/items2_fx/skadi_projectile.vpcf";
        let particle_lifesteal = "particles/item/lifesteal_mask/lifesteal_particle.vpcf";
        let particle_deso_skadi = "particles/item/desolator/desolator_skadi_projectile_2.vpcf";
        let particle_clinkz_arrows = "particles/units/heroes/hero_clinkz/clinkz_searing_arrow.vpcf";
        let particle_dragon_form_green = "particles/units/heroes/hero_dragon_knight/dragon_knight_elder_dragon_corrosive.vpcf";
        let particle_dragon_form_red = "particles/units/heroes/hero_dragon_knight/dragon_knight_elder_dragon_fire.vpcf";
        let particle_dragon_form_blue = "particles/units/heroes/hero_dragon_knight/dragon_knight_elder_dragon_frost.vpcf";
        let particle_terrorblade_transform = "particles/units/heroes/hero_terrorblade/terrorblade_metamorphosis_base_attack.vpcf";
        if (unit.HasModifier("modifier_item_imba_desolator") || unit.HasModifier("modifier_item_imba_desolator_2")) {
            if (unit.HasModifier("modifier_item_imba_skadi")) {
                unit.SetRangedProjectileName(particle_deso_skadi);
            } else {
                unit.SetRangedProjectileName(particle_deso);
            }
        } else if (unit.HasModifier("modifier_item_imba_skadi")) {
            unit.SetRangedProjectileName(particle_skadi);
        } else if (unit.HasModifier("modifier_imba_morbid_mask") || unit.HasModifier("modifier_imba_mask_of_madness") || unit.HasModifier("modifier_imba_satanic") || unit.HasModifier("modifier_item_imba_vladmir") || unit.HasModifier("modifier_item_imba_vladmir_blood")) {
            unit.SetRangedProjectileName(particle_lifesteal);
        } else if (unit.HasModifier("modifier_dragon_knight_corrosive_breath")) {
            unit.SetRangedProjectileName(particle_dragon_form_green);
        } else if (unit.HasModifier("modifier_dragon_knight_splash_attack")) {
            unit.SetRangedProjectileName(particle_dragon_form_red);
        } else if (unit.HasModifier("modifier_dragon_knight_frost_breath")) {
            unit.SetRangedProjectileName(particle_dragon_form_blue);
        } else if (unit.HasModifier("modifier_terrorblade_metamorphosis")) {
            unit.SetRangedProjectileName(particle_terrorblade_transform);
        } else {
            unit.SetRangedProjectileName(unit.GetKVData("ProjectileModel"));
        }
    }
    export function IsHeroDamage(unit: IBaseNpc_Plus, damage: number) {
        if (damage > 0) {
            if (unit.GetUnitName() == "npc_dota_roshan" || unit.IsControllableByAnyPlayer() || unit.GetUnitName() == "npc_dota_shadowshaman_serpentward") {
                return true;
            }
        }
        return false;
    }
    export function AddRangeIndicator(unit: IBaseNpc_Plus, hCaster: IBaseNpc_Plus,
        hAbility: IBaseAbility_Plus, sAttribute: string, iRange: number,
        iRed: number, iGreen: number, iBlue: number,
        bShowOnCooldown = false, bShowAlways = false, bWithCastRangeIncrease = false, bRemoveOnDeath = false) {
        let modifier = unit.AddNewModifier(hCaster || unit,
            hAbility, "modifier_imba_range_indicator", {
            sAttribute: sAttribute,
            iRange: iRange,
            iRed: iRed,
            iGreen: iGreen,
            iBlue: iBlue,
            bShowOnCooldown: bShowOnCooldown,
            bShowAlways: bShowAlways,
            bWithCastRangeIncrease: bWithCastRangeIncrease,
            bRemoveOnDeath: bRemoveOnDeath
        });
        return modifier;
    }
    export function Custom_IsUnderForcedMovement(unit: IBaseNpc_Plus) {
        let forced_movement_modifiers: { [k: string]: boolean } = {
            modifier_knockback: true,
            modifier_generic_motion_controller: true,
            modifier_pudge_dismember: true,
            modifier_imba_dismember: true,
            modifier_faceless_void_chronosphere_freeze: true,
            modifier_imba_faceless_void_chronosphere_handler: true,
            modifier_batrider_flaming_lasso: true,
            modifier_imba_batrider_flaming_lasso: true,
            modifier_beastmaster_prima_roar_push: true,
            modifier_brewmaster_primal_split: true,
            modifier_rattletrap_cog_push: true,
            modifier_imba_rattletrap_cog_push: true,
            modifier_dark_seer_vacuum: true,
            modifier_imba_dark_seer_vacuum: true,
            modifier_earthshaker_enchant_totem_leap: true,
            modifier_earthshaker_enchant_totem_lua_leap: true,
            modifier_imba_earthshaker_enchant_totem_leap: true,
            modifier_enigma_black_hole_pull: true,
            modifier_imba_enigma_black_hole: true,
            modifier_eul_cyclone: true,
            modifier_faceless_void_time_walk: true,
            modifier_imba_faceless_void_time_walk_cast: true,
            modifier_invoker_tornado: true,
            modifier_imba_invoker_tornado: true,
            modifier_kunkka_torrent: true,
            modifier_life_stealer_infest_effect: true,
            modifier_imba_life_stealer_infest_effect: true,
            modifier_life_stealer_assimilate_effect: true,
            modifier_lion_impale: true,
            modifier_imba_earthspike_death_spike: true,
            modifier_magnataur_skewer_movement: true,
            modifier_imba_skewer_motion_controller: true,
            modifier_mars_spear: true,
            modifier_monkey_king_tree_dance_activity: true,
            modifier_monkey_king_bounce_leap: true,
            modifier_morphling_adaptive_strike: true,
            modifier_nyx_assassin_impale: true,
            modifier_imba_swashbuckle_dash: true,
            modifier_imba_shield_crash_jump: true,
            modifier_pangolier_gyroshell: true,
            modifier_pudge_meat_hook: true,
            modifier_imba_hook_target_enemy: true,
            modifier_imba_hook_target_ally: true,
            modifier_rubick_telekinesis: true,
            modifier_imba_telekinesis: true,
            modifier_sandking_impale: true,
            modifier_sandking_burrowstrike: true,
            modifier_imba_burrowstrike_burrow: true,
            modifier_brewmaster_storm_cyclone: true,
            modifier_storm_spirit_electric_vortex_pull: true,
            modifier_imba_vortex_pull: true,
            modifier_techies_suicide_leap: true,
            modifier_imba_techies_suicide_leap: true,
            modifier_tidehunter_ravage: true,
            modifier_tiny_toss: true,
            modifier_tiny_toss_movement: true,
            modifier_tusk_snowball_movement: true,
            modifier_tusk_snowball_movement_friendly: true,
            modifier_tusk_walrus_punch_air_time: true,
            modifier_tusk_walrus_kick_air_time: true,
            modifier_flamebreak_knockback: true,
            modifier_rattletrap_hookshot: true,
            modifier_imba_rattletrap_hookshot: true,
            modifier_drowranger_wave_of_silence_knockback: true,
            modifier_imba_gust_movement: true,
            modifier_earth_spirit_boulder_smash: true,
            modifier_imba_boulder_smash_push: true,
            modifier_earth_spirit_rolling_boulder_caster: true,
            modifier_imba_rolling_boulder: true,
            modifier_earth_spirit_geomagnetic_grip: true,
            modifier_imba_geomagnetic_grip_pull: true,
            modifier_ember_spirit_fire_remnant: true,
            modifier_item_forcestaff_active: true,
            modifier_item_imba_force_staff_active: true,
            modifier_item_hurricane_pike_active: true,
            modifier_item_hurricane_pike_active_alternate: true,
            modifier_item_imba_hurricane_pike_force_ally: true,
            modifier_item_imba_hurricane_pike_force_enemy: true,
            modifier_item_imba_lance_of_longinus_force_ally: true,
            modifier_item_imba_lance_of_longinus_force_enemy_ranged: true,
            modifier_item_imba_lance_of_longinus_force_enemy_melee: true,
            modifier_item_imba_lance_of_longinus_force_self_ranged: true,
            modifier_item_imba_lance_of_longinus_force_self_melee: true,
            modifier_huskar_life_break_charge: true,
            modifier_imba_huskar_life_break_charge: true,
            modifier_invoker_deafening_blast_knockback: true,
            modifier_imba_invoker_deafening_blast_knockback: true,
            modifier_wisp_tether: true,
            modifier_imba_wisp_tether_latch: true,
            modifier_blinding_light_knockback: true,
            modifier_imba_blinding_light_knockback: true,
            modifier_kunkka_ghost_ship_knockback: true,
            modifier_imba_ghostship_drag: true,
            modifier_mirana_leap: true,
            modifier_imba_leap_movement: true,
            modifier_morphling_waveform: true,
            modifier_phoenix_icarus_dive: true,
            modifier_imba_phoenix_icarus_dive_dash_dummy: true,
            modifier_phoenix_sun_ray: true,
            imba_phoenix_sun_ray_toggle_move: true,
            modifier_slark_pounce: true,
            modifier_imba_slark_pounce: true,
            modifier_spirit_breaker_charge_of_darkness: true,
            modifier_imba_spirit_breaker_charge_of_darkness: true,
            modifier_imba_spirit_breaker_charge_of_darkness_clothesline: true,
            modifier_imba_spirit_breaker_charge_of_darkness_taxi: true,
            modifier_storm_spirit_ball_lightning: true,
            modifier_imba_ball_lightning: true,
            modifier_shredder_timber_chain: true,
            modifier_imba_timbersaw_timber_chain: true
        }
        let bForcedMovement = false;
        for (const modifier of (unit.FindAllModifiers())) {
            if (forced_movement_modifiers[modifier.GetName()]) {
                bForcedMovement = true;
                break;
            }
        }
        return bForcedMovement;
    }

    /**
     *
     * @param hUnit
     * @param iOrder
     * @param hTarget
     * @param hAbility
     * @param vPosition
     */
    export function ExecuteOrder(hUnit: CDOTA_BaseNPC, iOrder: dotaunitorder_t, hTarget: CDOTA_BaseNPC, hAbility: CDOTABaseAbility, vPosition: Vector = null) {
        ExecuteOrderFromTable({
            UnitIndex: hUnit.entindex(),
            OrderType: iOrder,
            TargetIndex: (hTarget && hTarget.entindex()) || null,
            AbilityIndex: (hAbility && hAbility.entindex()) || null,
            Position: vPosition,
            Queue: false,
        });
    }
    /**
     * 判断是否有效
     * @param obj
     * @returns
     */
    export function IsValid(obj: CEntityInstance | IBaseModifier_Plus) {
        return obj && !obj.IsNull();
    }
    /**
     * @Both
     * @param ability 
     * @returns 
     */
    export function SafeDestroyAbility(ability: IBaseAbility_Plus) {
        if (IsValid(ability)) {
            if (ability.__safedestroyed__) {
                return;
            }
            ability.__safedestroyed__ = true;
            GTimerHelper.ClearAll(ability);
            if (ability.OnDestroy) {
                ability.OnDestroy();
            }
            ability.Destroy();
            // UTIL_Remove(ability);
        }
    }

    /**
     * @Both
     * @param item 
     * @returns 
     */
    export function SafeDestroyItem(item: IBaseItem_Plus) {
        if (IsValid(item)) {
            if (item.__safedestroyed__) {
                return;
            }
            item.__safedestroyed__ = true;
            GTimerHelper.ClearAll(item);
            if (item.OnDestroy) {
                item.OnDestroy();
            }
            item.Destroy();
            // UTIL_Remove(item);
        }
    }

    /**
     * @Both
     * @param unit 
     * @returns 
     */
    export function SafeDestroyUnit(unit: IBaseNpc_Plus) {
        if (IsValid(unit)) {
            if (unit.__safedestroyed__) {
                return;
            }
            unit.__safedestroyed__ = true;
            if (IsServer()) {
                let bthinker = unit.IsThinker();
                let allm = unit.FindAllModifiers() as IBaseModifier_Plus[];
                for (let m of allm) {
                    if (IsValid(m)) {
                        m.Destroy();
                    }
                }
                if (!bthinker) {
                    let lenability = unit.GetAbilityCount()
                    for (let i = 0; i < lenability; i++) {
                        unit.GetAbilityByIndex(i) && SafeDestroyAbility(unit.GetAbilityByIndex(i) as any);
                    }
                    for (let i = 0; i < DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
                        unit.GetItemInSlot(i) && SafeDestroyItem(unit.GetItemInSlot(i) as any);
                    }
                }

            }
            if (IsValid(unit)) {
                if (unit.OnDestroy) {
                    unit.OnDestroy();
                }
                unit.ClearSelf();
                unit.Destroy();
            }
            // UTIL_Remove(unit);
        }
    }
    export function AsAttribute(obj: string) {
        switch (obj) {
            case "DOTA_ATTRIBUTE_STRENGTH":
                return Attributes.DOTA_ATTRIBUTE_STRENGTH;
            case "DOTA_ATTRIBUTE_AGILITY":
                return Attributes.DOTA_ATTRIBUTE_AGILITY;
            case "DOTA_ATTRIBUTE_INTELLECT":
                return Attributes.DOTA_ATTRIBUTE_INTELLECT;
            case "DOTA_ATTRIBUTE_MAX":
                return Attributes.DOTA_ATTRIBUTE_MAX;
            case "DOTA_ATTRIBUTE_INVALID":
                return Attributes.DOTA_ATTRIBUTE_INVALID;
        }
        return Attributes.DOTA_ATTRIBUTE_INVALID;
    }
    /**
    * 检查是否是第一次创建
    */
    export function checkIsFirstSpawn(hTarget: IBaseNpc_Plus) {
        let r = hTarget.__bIsFirstSpawn
        if (!r) {
            hTarget.__bIsFirstSpawn = true;
            return true
        }
        else {
            return false
        }
    };

    export function Custom_bIsStrongIllusion(unit: IBaseNpc_Plus) {
        return unit && (unit.HasModifier("modifier_chaos_knight_phantasm_illusion") || unit.HasModifier("modifier_imba_chaos_knight_phantasm_illusion") || unit.HasModifier("modifier_vengefulspirit_hybrid_special"));
    };


    /**
     * 回复怒气
     * @param hCaster
     * @param n
     */
    export function ModifyEnergy(hCaster: IBaseNpc_Plus, n: number) {

    }



    /**
        * 扔东西到对象附近
        * @param hDropUnit
        * @param item
        * @param hTargetUnit
        * @returns
        */
    export function DropItemAroundUnit(hDropUnit: IBaseNpc_Plus, item: IBaseItem_Plus, hTargetUnit: IBaseNpc_Plus) {
        if (!IsValid(hDropUnit)) {
            return
        }
        if (!IsValid(hTargetUnit)) {
            hTargetUnit = hDropUnit
        }
        hDropUnit.TakeItem(item)
        CreateItemOnPositionRandom(hTargetUnit.GetAbsOrigin(), item)
    }


    export function CreateItemOnPosition(position: Vector, item: IBaseItem_Plus) {
        let hContainer = CreateItemOnPositionForLaunch(position, item)
        //  let iTier = DotaTD.GetNeutralItemTier(item.GetName())
        //  if ( iTier != -1 ) {
        //  	hContainer.SetMaterialGroup(tostring(iTier))
        //  }
        return hContainer
    }

    /**
     * 在地面创建道具
     * @param vCenter
     * @param hItem
     * @returns
     */
    export function CreateItemOnPositionRandom(vCenter: Vector, hItem: IBaseItem_Plus) {
        let vPosition = (vCenter + RandomVector(125)) as Vector
        let hContainer = CreateItemOnPositionForLaunch(vPosition, hItem)
        return hContainer
    }
}


export module FuncArray {


    export function Clear(t: Array<any>) {
        let len = t.length;
        for (let i = len - 1; i > -1; i--) {
            t.pop()
        }
    }
    /**
     * 移除數組内所有元素
     * @param t
     * @param v
     * @returns
     */
    export function FitterRemove<T>(t: Array<T>, f: (v: T, index: number) => boolean) {
        if (t == null || t.length == 0) return;
        let len = t.length;
        for (let i = len - 1; i > -1; i--) {
            if (!f(t[i], i)) {
                t.splice(i, 1);
                i--;
            }
        }
    }
    /**
     * 数组移除元素
     * @param t
     * @param v
     * @param isall
     * @returns
     */
    export function ArrayRemove(t: Array<any>, v: any, isall = false) {
        if (!t) {
            return;
        }
        let index = t.indexOf(v);
        if (index > -1) {
            t.splice(index, 1);
        }
        if (isall) {
            index = t.indexOf(v);
            while (index > -1) {
                t.splice(index, 1);
                index = t.indexOf(v);
            }
        }
    }
    /**
     * Set转化成数组
     * @param set
     * @returns
     */
    export function FromSet<T>(set: Set<T>): T[] {
        let r = [] as T[];
        set.forEach((i) => {
            r.push(i);
        });
        return r;
    }
}

export module FuncMath {
    /**
           * 越界检查
           * @param num
           * @param min
           * @param max
           * @returns
           */
    export function Clamp(num: number, min: number, max: number) {
        return num <= min ? min : num >= max ? max : num;
    }

    export function Lerp(percent: number, a: number, b: number) {
        return a + percent * (b - a);
    }

    export function RemapVal(num: number, a: number, b: number, c: number, d: number) {
        if (a == b) return c;

        let percent = (num - a) / (b - a);
        return Lerp(percent, c, d);
    }

    export function RemapValClamped(num: number, a: number, b: number, c: number, d: number) {
        if (a == b) return c;

        let percent = (num - a) / (b - a);
        percent = Clamp(percent, 0.0, 1.0);

        return Lerp(percent, c, d);
    }
}

/**向量 */
export module FuncVector {
    export function GetPerpendicularVector(vector: Vector) {
        return Vector(vector.y, -vector.x);
    }
    export function GetRandomPosition2D(v: Vector, dis: number): Vector {
        let v2 = RandomVector(dis);
        return v + v2 as Vector;
    }
    export function ActualRandomVector(maxLength: number, flMinLength: number = 0) {
        let minLength = flMinLength
        return RandomVector(RandomInt(minLength, maxLength))
    }

    export function CalculateDistance(ent1: Vector | IBaseNpc_Plus, ent2: Vector | IBaseNpc_Plus): number {
        let pos1 = ent1 as Vector;
        let pos2 = ent2 as Vector;
        if ((ent1 as IBaseNpc_Plus).GetAbsOrigin) {
            pos1 = (ent1 as IBaseNpc_Plus).GetAbsOrigin();
        }
        if ((ent2 as IBaseNpc_Plus).GetAbsOrigin) {
            pos2 = (ent2 as IBaseNpc_Plus).GetAbsOrigin();
        }
        return (pos1 - pos2 as Vector).Length2D();
    }
    export function CalculateDirection(ent1: Vector | IBaseNpc_Plus, ent2: Vector | IBaseNpc_Plus) {
        let pos1 = ent1 as Vector;
        let pos2 = ent2 as Vector;
        if ((ent1 as IBaseNpc_Plus).GetAbsOrigin) {
            pos1 = (ent1 as IBaseNpc_Plus).GetAbsOrigin();
        }
        if ((ent2 as IBaseNpc_Plus).GetAbsOrigin) {
            pos2 = (ent2 as IBaseNpc_Plus).GetAbsOrigin();
        }
        let direction = (pos1 - pos2 as Vector).Normalized();
        return direction;
    }
    export function AsVector(obj: any) {
        return obj as Vector;
    }
    /**
     * 逆時針旋轉
     * @param vVector
     * @param radian
     * @returns
     */
    export function Rotation2D(vVector: Vector, radian: number): Vector {
        const fLength2D = vVector.Length2D();
        const vUnitVector2D = (vVector / fLength2D) as Vector;
        const fCos = math.cos(radian);
        const fSin = math.sin(radian);
        return (Vector(vUnitVector2D.x * fCos - vUnitVector2D.y * fSin, vUnitVector2D.x * fSin + vUnitVector2D.y * fCos, vUnitVector2D.z) * fLength2D) as Vector;
    }

    export function RotateVector2D(v: Vector, angle: number, bIsDegree = false): Vector {
        if (bIsDegree) {
            angle = math.rad(angle);
        }
        let xp = v.x * math.cos(angle) - v.y * math.sin(angle);
        let yp = v.x * math.sin(angle) + v.y * math.cos(angle);
        return Vector(xp, yp, v.z).Normalized();
    }
    /**
     * 向量加法
     * @param arg
     * @returns
     */
    export function Add(...arg: Array<Vector>): Vector {
        let r = Vector(0, 0, 0);
        arg.forEach((v) => {
            r = (r + v) as Vector;
        });
        return r;
    }

    export function VectorToString(s: Vector): string {
        if (s == null) return;
        return s.x + " " + s.y + " " + s.z;
    }

    export function ArrayToVector(s: [number, number, number]): Vector {
        if (s == null) return;
        return Vector(...s);
    }
    /**
     * 字符串转Vector
     * @param s
     */
    export function StringToVector(s: string): Vector {
        if (s == null) return;
        let d = s.split(" ");
        return Vector(parseFloat(d[0] || "0"), parseFloat(d[1] || "0"), parseFloat(d[2] || "0"));
    }

    export function HorizonVector(vec: Vector) {
        vec.z = 0;
        return vec.Normalized();
    }
    /**
     *
     * @param pect
     * @param v1
     * @param v2
     * @returns
     */
    export function VectorLerp(pect: number, v1: Vector, v2: Vector) {
        return ((v2 - v1) * pect + v1) as Vector;
    }
    /**
     * 是否是交互有效距离
     * @param v1
     * @param v2
     * @returns
     */
    export function IsValidDiatance(v1: Vector, v2: Vector) {
        return ((v1 - v2) as Vector).Length() <= 300;
    }

    /**
     * 判斷是否是零坐標
     * @param v
     * @returns
     */
    export function VectorIsZero(v: Vector) {
        return v.x == 0 && v.y == 0 && v.z == 0;
    }
    export class Vector2D {
        public x: number;
        public y: number;
        constructor(v: Vector) {
            this.x = v.x;
            this.y = v.y;
        }
    }

    export class Polygon2D {
        data: Array<Vector2D> = [];
        constructor(polygon: Array<Vector>) {
            polygon.forEach((v) => {
                this.data.push(new Vector2D(v));
            });
        }
    }

    /**
     * 判斷兩線相交
     * @param pt1_1
     * @param pt1_2
     * @param pt2_1
     * @param pt2_2
     * @returns
     */
    export function IsLineCross(pt1_1: Vector2D, pt1_2: Vector2D, pt2_1: Vector2D, pt2_2: Vector2D) {
        return (
            math.min(pt1_1.x, pt1_2.x) <= math.max(pt2_1.x, pt2_2.x) &&
            math.min(pt2_1.x, pt2_2.x) <= math.max(pt1_1.x, pt1_2.x) &&
            math.min(pt1_1.y, pt1_2.y) <= math.max(pt2_1.y, pt2_2.y) &&
            math.min(pt2_1.y, pt2_2.y) <= math.max(pt1_1.y, pt1_2.y)
        );
    }
    //  判断点是否在不规则图形里（不规则图形里是点集，点集每个都是固定住的）
    export function IsPointInPolygon(point: Vector, polygonPoints: Vector[]) {
        let j = polygonPoints.length;
        let bool = 0;
        for (let i = 0; i < polygonPoints.length; i++) {
            let polygonPoint1 = polygonPoints[j];
            let polygonPoint2 = polygonPoints[i];
            if (
                ((polygonPoint2.y < point.y && polygonPoint1.y >= point.y) || (polygonPoint1.y < point.y && polygonPoint2.y >= point.y)) &&
                (polygonPoint2.x <= point.x || polygonPoint1.x <= point.x)
            ) {
                bool = bit.bxor(bool, (polygonPoint2.x + ((point.y - polygonPoint2.y) / (polygonPoint1.y - polygonPoint2.y)) * (polygonPoint1.x - polygonPoint2.x) < point.x && 1) || 0);
            }
            j = i;
        }
        return bool == 1;
    }
}


export module FuncRandom {
    const chances_table = [
        0, 0.015604, 0.062009, 0.138618, 0.244856, 0.380166, 0.544011, 0.735871, 0.955242,
        1.201637, 1.474584, 1.773627, 2.098323, 2.448241, 2.822965, 3.222091, 3.645227,
        4.091991, 4.562014, 5.054934, 5.570404, 6.108083, 6.667640, 7.248754, 7.851112,
        8.474409, 9.118346, 9.782638, 10.46702, 11.17117, 11.89491, 12.63793, 13.40008,
        14.18052, 14.98100, 15.79831, 16.63287, 17.49092, 18.36246, 19.24859, 20.15474,
        21.09200, 22.03645, 22.98986, 23.95401, 24.93070, 25.98723, 27.04529, 28.10076,
        29.15522, 30.21030, 31.26766, 32.32905, 33.41199, 34.73699, 36.03978, 37.32168,
        38.58396, 39.82783, 41.05446, 42.26497, 43.46044, 44.64192, 45.81044, 46.96699,
        48.11254, 49.24807, 50.74626, 52.94117, 55.07246, 57.14285, 59.15493, 61.11111,
        63.01369, 64.86486, 66.66666, 68.42105, 70.12987, 71.79487, 73.41772, 75.00000,
        76.54321, 78.04878, 79.51807, 80.95238, 82.35294, 83.72093, 85.05747, 86.36363,
        87.64044, 88.88888, 90.10989, 91.30434, 92.47311, 93.61702, 94.73684, 95.83333,
        96.90721, 97.95918, 98.98989, 100];
    export function PRD(chance: number, entity: any, key = ""): boolean {
        if (chance >= 100) { return true; }
        key = "PRD_pseudoRandomModifier" + key;
        entity[key] = entity[key] || 0;
        let prngBase = chances_table[chance - 1];
        if (!prngBase) {
            return false;
        }
        if (RollPercentage(prngBase + entity[key])) {
            entity[key] = 0;
            return true;
        } else {
            entity[key] += prngBase;
            return false;
        }
    }
    export function RandomValue<T>(obj: { [k: string]: T }): T {
        return RandomArray(Object.values(obj))[0];
    }
    export function RandomOne<T>(arr: Array<T>): T {
        return RandomArray(arr, 1, false)[0];
    }

    export function RandomRemove<T>(arr: Array<T>): T {
        let len = arr.length;
        RandomInt(0, len - 1)
        return arr.splice(len, 1)[0];
    }
    /**
     * 随机数组 TODO 优化算法，count与数组长度接近，需要反向删选
     * @param arr
     * @param count 数量
     * @param isRepeat 是否重复
     */
    export function RandomArray<T>(arr: Array<T>, count: number = 1, isRepeat: boolean = false): T[] {
        let len = arr.length;
        count = Math.min(count, len);
        let r: T[] = [];
        if (count <= 0) {
            return r;
        }
        let index = [];
        if (isRepeat) {
            while (count > 0) {
                count -= 1;
                index.push(RandomInt(0, len - 1));
            }
        } else {
            let _arr = Object.keys(arr);
            while (count > 0) {
                count -= 1;
                let _len = _arr.length;
                let _i = _arr.splice(RandomInt(0, _len - 1), 1)[0];
                index.push(tonumber(_i));
            }
        }
        // 这里需要-1 适配
        for (let k of index) {
            r.push(arr[k - 1]);
        }
        if (r.length != index.length) {
            GLogHelper.error("RandomArray out of range");
        }
        return r;
    }

    /**
     * 根据权重随机数组
     * @param arr
     * @param weight
     * @param count
     */
    export function RandomArrayByWeight<T>(arr: Array<T>, weight: Array<number | string>, count: number = 1): T[] {
        let _arr = [].concat(arr);
        let _weight: number[] = [];
        weight.forEach((v) => {
            _weight.push(tonumber(v));
        });
        if (_arr.length == count || _arr.length == 0) {
            return _arr;
        }
        if (_arr.length < count) {
            GLogHelper.error("our of range");
        }
        let _count = count;
        let he = 0;
        let i = 0;
        for (let _k of _weight) {
            i += 1;
            if (i > _arr.length) {
                break;
            }
            he += math.abs(_k);
        }
        let r: T[] = [];
        while (he > 0 && _count > 0) {
            _count -= 1;
            let _rand = RandomInt(1, he);
            let index = 0;
            while (_weight[index] != null && _rand > _weight[index]) {
                index += 1;
                _rand -= _weight[index];
            }
            r.push(_arr[index]);
            he -= _weight[index];
            _arr.splice(index, 1);
            _weight.splice(index, 1);
        }
        if (r.length != count) {
            GLogHelper.error("our of range");
        }
        return r;
    }
}



declare global {
    /**
     * @Both
    */
    var GFuncEntity: typeof FuncEntity;
    var GFuncArray: typeof FuncArray;
    var GFuncMath: typeof FuncMath;
    var GFuncVector: typeof FuncVector;
    var GFuncRandom: typeof FuncRandom;
}
if (_G.GFuncArray == undefined) {
    _G.GFuncEntity = FuncEntity;
    _G.GFuncArray = FuncArray;
    _G.GFuncMath = FuncMath;
    _G.GFuncVector = FuncVector;
    _G.GFuncRandom = FuncRandom;


}