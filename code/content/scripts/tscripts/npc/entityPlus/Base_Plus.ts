import { GameFunc } from "../../GameFunc";
import { LogHelper } from "../../helper/LogHelper";
import { CCShare } from "../../shared/lib/CCShare";
import { ET } from "../../shared/lib/Entity";
import { PropertyConfig } from "../../shared/PropertyConfig";
import { PropertyCalculate } from "../propertystat/PropertyCalculate";
import { BaseClassExt } from "./Base_ClassExt";


BaseClassExt.Init()
export interface BaseAbility extends CDOTA_Ability_Lua { }
export class BaseAbility implements ET.IEntityRoot {
    ETRoot?: ET.EntityRoot;
    __safedestroyed__: boolean = false;
    /**查找技能 
     * @Both
    */
    static findIn<T extends typeof BaseAbility>(this: T, target: CDOTA_BaseNPC) {
        return target.FindAbilityByName(this.name) as InstanceType<T>;
    }
}
export interface BaseDataDriven extends CDOTA_Ability_DataDriven { }
export class BaseDataDriven {
    /**
     * @Server
     * @param itemName 
     * @param owner 
     * @param purchaser 
     * @returns 
     */
    static CreateItem(
        itemName: string,
        owner: IBaseNpc_Plus | undefined,
    ) {
        let player = owner.GetPlayerOwner();
        let hItem = CreateItem(itemName, player, player) as any as BaseDataDriven;
        GameFunc.BindInstanceToCls(hItem, GGetRegClass(itemName) || BaseDataDriven);
        return hItem
    }
}

export interface BaseItem extends CDOTA_Item_Lua { }
export class BaseItem implements ET.IEntityRoot {
    ETRoot?: ET.EntityRoot;
    __safedestroyed__: boolean = false;
    /**
     * @Server
     * @param itemName 
     * @param owner 
     * @param purchaser 
     * @returns 
     */
    static CreateItem(
        itemName: string,
        owner: CDOTAPlayerController | undefined,
        purchaser: CDOTAPlayerController | undefined,
    ) {
        let hItem = CreateItem(itemName, owner, purchaser) as IBaseItem_Plus;
        // GameFunc.BindInstanceToCls(hItem, GGetRegClass(itemName) || BaseItem);
        return hItem
    }
    /**
     * @Server
     * @param this 
     * @param hUnit 
     * @returns 
     */
    static FindInUnit<T extends typeof BaseItem>(this: T, hUnit: IBaseNpc_Plus): InstanceType<T> {
        let item = hUnit.FindItemInInventory(this.name);
        return item as InstanceType<T>;
    }
}

export interface BaseModifier extends CDOTA_Modifier_Lua { }
export class BaseModifier {
    /**本地特效时间 */
    public static LOCAL_PARTICLE_MODIFIER_DURATION = 3 / 30;


    /**
     * 新增BUFF,只能在服务器运行
     * @Server
     * @param target
     * @param caster
     * @param ability
     * @param modifierTable 注意：不会同步到客户端,这里最好不要传数据
     * @returns
     */
    public static apply<T extends typeof BaseModifier>(this: T, target: IBaseNpc_Plus, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: IModifierTable): InstanceType<T> {
        if (IsServer()) {
            let m = target.AddNewModifier(caster, ability, this.name, modifierTable) as InstanceType<T>;
            return m;
        }
    }

    /**
     * 添加唯一的BUFF
     * @Server
     * @param this
     * @param target
     * @param caster
     * @param ability
     * @param modifierTable
     * @returns
     */
    public static applyOnly<T extends typeof BaseModifier>(this: T, target: IBaseNpc_Plus, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: IModifierTable): InstanceType<T> {
        if (IsServer()) {
            if (this.exist(target)) {
                return this.findIn(target, caster);
            } else {
                return this.apply(target, caster, ability, modifierTable);
            }
        }
    }

    /**
     * 创造一个单位，并给他加BUFF
     * @Server
     * @param this
     * @param position
     * @param caster
     * @param ability
     * @param modifierTable
     * @param teamNumber
     * @param phantomBlocker
     * @returns
     */
    public static applyThinker<T extends typeof BaseModifier>(
        this: T,
        position: Vector,
        caster: IBaseNpc_Plus,
        ability?: IBaseAbility_Plus,
        modifierTable?: IModifierTable,
        teamNumber?: DOTATeam_t,
        phantomBlocker: boolean = false
    ): IBaseNpc_Plus {
        if (IsServer()) {
            if (teamNumber == null) {
                teamNumber = caster.GetTeamNumber();
            }
            let n = CreateModifierThinker(caster, ability, this.name, modifierTable, position, teamNumber, phantomBlocker) as BaseNpc;
            if (caster) {
                n.SetOwner(caster);
                n.RegOwnerSelf(true);
            }
            GameFunc.BindInstanceToCls(n, BaseNpc);
            return n as IBaseNpc_Plus;
        }
    }

    public static CreateBuffThinker(caster: IBaseNpc_Plus, ability: CDOTABaseAbility, modifierName: string, modifierTable: object, position: Vector, teamNumber: DOTATeam_t = null, phantomBlocker: boolean = false) {
        if (IsServer()) {
            if (teamNumber == null) {
                teamNumber = caster.GetTeamNumber();
            }
            let n = CreateModifierThinker(caster, ability, modifierName, modifierTable, position, teamNumber, phantomBlocker) as BaseNpc;
            if (caster) {
                n.SetOwner(caster);
                n.RegOwnerSelf(true);
            }
            GameFunc.BindInstanceToCls(n, BaseNpc);
            return n as IBaseNpc_Plus;
        }
    }

    /**
     * 移除BUFF
     * @Server
     * @param this
     * @param target
     * @param caster
     */
    public static remove<T extends typeof BaseModifier>(this: T, target: CDOTA_BaseNPC, caster?: CDOTA_BaseNPC) {
        if (IsServer()) {
            if (caster) {
                let modef = this.findIn(target, caster);
                if (modef) {
                    modef.Destroy();
                }
            } else {
                let modef = this.findIn(target);
                if (modef) {
                    modef.Destroy();
                }
            }
        }
    }

    /**获取所有的实例数据
     * @Both
     */
    public static GetAllInstance<T extends typeof BaseModifier>(this: T) {
        if (GGameCache.allBuffIntance[this.name]) {
            return GGameCache.allBuffIntance[this.name] as Readonly<{ [UUID: string]: InstanceType<T> }>;
        }
    }
    /**重载 
     * @Both
     */
    public static DebugReload<T extends typeof BaseModifier>(this: T) {
        let _instanceArr = this.GetAllInstance();
        if (_instanceArr) {
            for (let uuid in _instanceArr) {
                let m = _instanceArr[uuid] as any;
                let _ma = getmetatable(m).__index as any;
                Object.assign(_ma, this.prototype);
            }
        }
    }
    /**
     * 存在于
     * @Both
     * @param this
     * @param target
     * @returns
     */
    public static exist<T extends typeof BaseModifier>(this: T, target: CDOTA_BaseNPC) {
        if (target) {
            return target.HasModifier(this.name);
        }
    }

    /**
     * 查找
     * @Server
     * @param this
     * @param target
     * @returns
     */
    public static findIn<T extends typeof BaseModifier>(this: T, target: CDOTA_BaseNPC, caster: CDOTA_BaseNPC = null): InstanceType<T> | null {
        if (target && this.exist(target)) {
            if (caster) {
                return target.FindModifierByNameAndCaster(this.name, caster) as InstanceType<T>;
            }
            return target.FindModifierByName(this.name) as InstanceType<T>;
        }
    }
    /**
     * @Both
     * @param this 
     * @param target 
     * @param caster 
     * @returns 
     */
    public static GetStackIn<T extends typeof BaseModifier>(this: T, target: CDOTA_BaseNPC, caster: CDOTA_BaseNPC = null): number {
        if (target && this.exist(target)) {
            return target.GetModifierStackCount(this.name, caster)
        }
        return 0;
    }

    /**所有注册的属性 */
    public __AllRegisterProperty: { [v: string]: Set<string> };
    /**所有注册的属性函数 */
    public __AllRegisterFunction: { [v: string]: Set<string> };
    /**所有注册的事件函数 */
    public __AllRegisterEvent: { [v: string]: [Set<string>, Set<string>] };

    /**是否隐藏 */
    public IsHidden() {
        return true;
    }
    public IsBuff(): boolean { return true; }
    /**是否是debuff */
    public IsDebuff() {
        return !this.IsBuff();
    }
    /**是否可以驱散 */
    public IsPurgable() {
        return false;
    }
    public IsPurgeException() {
        return false;
    }
    /**是否是眩晕BUFF */
    public IsStunDebuff() {
        return false;
    }
    public AllowIllusionDuplicate() {
        return false;
    }
    /**
     * @Both
     * 初始化自己，OnCreated和OnRefresh都会调用 
     * */
    public Init?(params?: IModifierTable): void;
    public BeCreated?(params?: IModifierTable): void;
    public BeRefresh?(params?: IModifierTable): void;
    public BeRemoved?(): void;
    public BeDestroy?(): void;
    /**
     * @Server 在Server端返回需要传递的数据
     */
    public AddCustomTransmitterData?(): void;
    /**
     * @Client 在Client端接受传递过来的数据（会被像nettable一样处理）
     */
    public HandleCustomTransmitterData?(tData: any): void;


    /**
     * modifier_property 注册方法的补充
     * @returns 
     */
    public DeclareFunctions?(): modifierfunction[] {
        let _all_set = new Set<modifierfunction>();
        let _Property = this.__AllRegisterProperty;
        let _Function = this.__AllRegisterFunction;
        let _hasExit = PropertyConfig.CustomDeclarePropertyEvent;
        if (_Function != null) {
            Object.keys(_Function).forEach((s: string) => {
                let _s = tonumber(s);
                if (!_hasExit.has(_s) && _s <= modifierfunction.MODIFIER_FUNCTION_INVALID) {
                    _all_set.add(_s);
                }
            });
        }
        if (_Property != null) {
            Object.keys(_Property).forEach((s: string) => {
                let _s = tonumber(s);
                if (!_hasExit.has(_s) && _s <= modifierfunction.MODIFIER_FUNCTION_INVALID) {
                    _all_set.add(_s);
                }
            });
        }
        const buff = this;
        _all_set.forEach((params) => {
            if (_hasExit.has(params as any)) {
                return;
            }
            let propName = GPropertyConfig.EMODIFIER_PROPERTY[params];
            if (propName != null) {
                let funcName = (GPropertyConfig.EMODIFIER_PROPERTY_FUNC as any)[propName];
                if (funcName && (this as any)[funcName] == null) {
                    // 注册回调函数
                    (this as any)[funcName] = (event?: any) => {
                        if (this.__safedestroyed__) { return }
                        return PropertyCalculate.RunModifierFunc(buff, params, event);
                    };
                }
            }
        });
        return Array.from(_all_set);
    }
    /**唯一识别ID */
    public UUID: string;
    public OnCreated(params: object) {
        this.__safedestroyed__ = false;
        if (this.UUID == null) {
            this.UUID = GGenerateUUID() + this.GetName();
        }
        (params as IModifierTable).IsOnCreated = true;
        (params as IModifierTable).IsOnRefresh = false;
        this.Init && this.Init(params);
        this.BeCreated && this.BeCreated(params);
        this.GetParentPlus().RegModifiersInfo(this, true);
        GGameCache.RegBuff(this, true);
    }

    public IsMotionBuff() {
        return false;
    }
    public OnRefresh(params: object) {
        this.__safedestroyed__ = false;
        (params as IModifierTable).IsOnCreated = false;
        (params as IModifierTable).IsOnRefresh = true;
        this.Init && this.Init(params);
        this.BeRefresh && this.BeRefresh(params);
    }

    public OnRemoved() {
        if (IsServer() && this.GetOverrideAnimation) {
            let curani = this.GetOverrideAnimation();
            if (curani != null) {
                this.GetParentPlus().RemoveGesture(curani);
            }
        }
        this.BeRemoved && this.BeRemoved();
        this.GetParentPlus().RegModifiersInfo(this, false);
        GGameCache.RegBuff(this, false);
        this.__AllRegisterFunction = null;
        this.__AllRegisterProperty = null;
        this.__AllRegisterEvent = null;
        // 计时器处理
        GTimerHelper.ClearAll(this);
        this.StartIntervalThink(-1);
    }
    public OnDestroy() {
        if (this.__safedestroyed__) { return; }
        this.__safedestroyed__ = true;
        this.BeDestroy && this.BeDestroy();
    }
    /**重载 
     * @Both
     */
    public onDebugReload<T extends typeof BaseModifier>(cls: T) {
        Object.assign(getmetatable(this).__index, cls.prototype);
    }
}

export interface BaseNpc extends CDOTA_BaseNPC {
}
export class BaseNpc implements ET.IEntityRoot {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__?: string;
    /**对应dota内的数据 */
    __IN_DOTA_DATA__?: any;
    private __SpawnedHandler__?: Array<IGHandler>;

    /**
     *
     * @param v
     * @param team
     * @param creater 创建者
     * @param findClearSpace
     * @param npcOwner
     * @param entityOwner
     * @returns
     */
    static CreateOne<T extends typeof BaseNpc>(
        this: T,
        v: Vector,
        team: DOTATeam_t,
        findClearSpace: boolean = true,
        npcOwner: CBaseEntity | undefined = null,
        entityOwner: IBaseNpc_Plus = null
    ): InstanceType<T> {
        return BaseNpc.CreateUnitByName(this.name, v, entityOwner, findClearSpace, team, npcOwner) as InstanceType<T>;
    }
    /**
     * 创建单位
     * @Server
     */
    static CreateUnitByName(
        unitname: string,
        v: Vector,
        entityOwner: IBaseNpc_Plus,
        findClearSpace: boolean = true,
        team: DOTATeam_t = null,
        npcOwner: CBaseEntity | undefined = null,
    ) {
        npcOwner = npcOwner || entityOwner;;
        team = team || entityOwner.GetTeam();
        let unit = CreateUnitByName(unitname, v, findClearSpace, npcOwner, entityOwner, team);
        if (unit == null) {
            GLogHelper.error("创建单位失败", unitname);
        }
        else {
            unit.RegOwnerSelf(true)
        }
        // GameFunc.BindInstanceToCls(unit, GGetRegClass(unitname) || BaseNpc);
        return unit as IBaseNpc_Plus;
    }

    static CreateUnitByNameAsync(
        unitname: string,
        v: Vector,
        entityOwner: IBaseNpc_Plus,
        hander: IGHandler,
        findClearSpace: boolean = true,
        team: DOTATeam_t = null,
        npcOwner: CBaseEntity | undefined = null,
    ) {
        npcOwner = npcOwner || entityOwner;;
        team = team || entityOwner.GetTeam();
        CreateUnitByNameAsync(unitname, v, findClearSpace, npcOwner, entityOwner, team, (unit) => {
            unit.RegOwnerSelf(true);
            if (hander) {
                hander.runWith([unit]);
            }
        });
        // GameFunc.BindInstanceToCls(unit, GGetRegClass(unitname) || BaseNpc);
    }

    /**缓存 */
    Precache?(context: CScriptPrecacheContext) { }
    /**出生 不知道为啥，客户端不执行
     * @Server
    */
    Spawn?(entityKeyValues: CScriptKeyValues) { }
    /**Spawn事件后执行
     * @both
     */
    onSpawned?(event: NpcSpawnedEvent) { }
    /**onSpawned之后执行，激活 */
    Activate?() { }


    /**
     * @Server
     */
    addSpawnedHandler?(handler: IGHandler) {
        if (this.__bIsFirstSpawn == true) {
            handler.run();
        } else {
            if (this.__SpawnedHandler__ == null) {
                this.__SpawnedHandler__ = [];
            }
            this.__SpawnedHandler__.push(handler);
        }
    }
    /**
     * @Server
     */
    runSpawnedHandler?() {
        if (this.__SpawnedHandler__ && this.__SpawnedHandler__.length > 0) {
            this.__SpawnedHandler__.forEach((handler) => {
                handler.run();
            });
            this.__SpawnedHandler__ = null;
        }
    }

    //#region 羁绊
    HasCombination?(sCombination: string): IBaseModifier_Plus {
        if (this == null) return;
        let Combination = this.FindModifierByName(sCombination);
        if (Combination == null) return;
        if (Combination.GetStackCount() == 0) return;
        return Combination as IBaseModifier_Plus;
    }
    //#endregion

}

export interface BaseNpc_Hero extends CDOTA_BaseNPC_Hero {
}
export class BaseNpc_Hero extends BaseNpc { }
/**影响移动buff */
export class BaseModifierMotion extends BaseModifier {
    public IsMotionBuff() {
        return true;
    }
    CheckMotionControllers?(): boolean {
        let parent = this.GetParent();
        let modifier_priority = this.GetPriority() || modifierpriority.MODIFIER_PRIORITY_LOW;
        let is_motion_controller = false;
        let motion_controller_priority = -100;
        let found_modifier_handler: IBaseModifier_Plus;
        let non_imba_motion_controllers = [
            "modifier_brewmaster_storm_cyclone",
            "modifier_dark_seer_vacuum",
            "modifier_eul_cyclone",
            "modifier_earth_spirit_rolling_boulder_caster",
            "modifier_huskar_life_break_charge",
            "modifier_invoker_tornado",
            "modifier_item_forcestaff_active",
            "modifier_rattletrap_hookshot",
            "modifier_phoenix_icarus_dive",
            "modifier_shredder_timber_chain",
            "modifier_slark_pounce",
            "modifier_spirit_breaker_charge_of_darkness",
            "modifier_tusk_walrus_punch_air_time",
            "modifier_earthshaker_enchant_totem_leap"
        ]
        let modifiers = parent.FindAllModifiers() as IBaseModifier_Plus[];
        for (const modifier of (modifiers)) {
            if (this != modifier && modifier.IsMotionBuff && modifier.IsMotionBuff()) {
                is_motion_controller = true;
                let _p = modifier.GetPriority();
                if (non_imba_motion_controllers.includes(modifier.GetName())) {
                    _p = modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
                }
                if (_p > motion_controller_priority) {
                    found_modifier_handler = modifier;
                    motion_controller_priority = _p;
                }
            }
        }
        if (is_motion_controller && motion_controller_priority) {
            if (motion_controller_priority > modifier_priority) {
                return false;
            }
            else if (motion_controller_priority == modifier_priority) {
                if (found_modifier_handler.GetCreationTime() >= this.GetCreationTime()) {
                    return false;
                } else {
                    found_modifier_handler.Destroy();
                    return true;
                }
            } else {
                parent.InterruptMotionControllers(true);
                found_modifier_handler.Destroy();
                return true;
            }
        } else {
            return true;
        }
    }
    static FindAllMotionBuff?(parent: CDOTA_BaseNPC): BaseModifierMotion[] {
        let modifiers = parent.FindAllModifiers() as IBaseModifier_Plus[];
        let motion_buffs = [];
        for (const modifier of (modifiers)) {
            if (modifier.IsMotionBuff && modifier.IsMotionBuff()) {
                motion_buffs.push(modifier);
            }
        }
        return motion_buffs;
    }

    static RemoveAllMotionBuff?(parent: CDOTA_BaseNPC) {
        this.FindAllMotionBuff(parent).forEach((motion_buff) => { motion_buff.Destroy() });
    }
}

export interface BaseModifierMotionHorizontal extends CDOTA_Modifier_Lua_Horizontal_Motion { }
export class BaseModifierMotionHorizontal extends BaseModifierMotion {
    BeginMotionOrDestroy?(b = true) {
        let r1 = this.ApplyHorizontalMotionController();
        let r = r1 /**&&&& this.CheckMotionControllers() */;
        if (!r && b) {
            this.Destroy();
        }
        return r;
    }
    GetMotionPriority() {
        return this.GetPriority() || modifierpriority.MODIFIER_PRIORITY_LOW;
    }
}

export interface BaseModifierMotionVertical extends CDOTA_Modifier_Lua_Vertical_Motion { }
export class BaseModifierMotionVertical extends BaseModifierMotion {
    BeginMotionOrDestroy?(b = true) {
        let r1 = this.ApplyVerticalMotionController();
        let r = r1 /**&&&& this.CheckMotionControllers() */;
        if (!r && b) {
            this.Destroy();
        }
        return r;
    }
    GetMotionPriority() {
        return this.GetPriority() || modifierpriority.MODIFIER_PRIORITY_LOW;
    }
}

export interface BaseModifierMotionBoth extends CDOTA_Modifier_Lua_Motion_Both { }
export class BaseModifierMotionBoth extends BaseModifierMotion {
    BeginMotionOrDestroy?(b = true) {
        let r1 = this.ApplyVerticalMotionController();
        let r2 = this.ApplyHorizontalMotionController();
        let r = r1 && r2 /**&& this.CheckMotionControllers()*/;
        if (!r && b) {
            this.Destroy();
        }
        return r;
    }
}

LogHelper.print(`-------------------setmetatable IsServer: ${IsServer()}------------------------------`);
// Add standard base classes to prototype chain to make `super.*` work as `self.BaseClass.*`
setmetatable(BaseDataDriven.prototype, { __index: IsServer() ? CDOTA_Ability_DataDriven : CDOTA_Ability_DataDriven });
setmetatable(BaseAbility.prototype, { __index: IsServer() ? CDOTA_Ability_Lua : C_DOTA_Ability_Lua });
setmetatable(BaseItem.prototype, { __index: IsServer() ? CDOTA_Item_Lua : C_DOTA_Item_Lua });
setmetatable(BaseModifier.prototype, { __index: IsServer() ? CDOTA_Modifier_Lua : CDOTA_Modifier_Lua });
setmetatable(BaseNpc.prototype, { __index: IsServer() ? CDOTA_BaseNPC : C_DOTA_BaseNPC });
setmetatable(BaseNpc_Hero.prototype, { __index: IsServer() ? CDOTA_BaseNPC_Hero : C_DOTA_BaseNPC_Hero });

export const registerAbility = (name?: string) => (ability: new () => CDOTA_Ability_Lua | CDOTA_Item_Lua) => {
    if (name !== undefined) {
        // @ts-ignore
        ability.name = name;
    } else {
        name = ability.name;
    }
    const [env] = getFileScope();
    if (env[name]) {
        clearTable(env[name]);
    } else {
    }
    env[name] = {} as any;
    toDotaClassInstance(env[name], ability);
    const originalSpawn = (env[name] as CDOTA_Ability_Lua | CDOTA_Item_Lua).Spawn;
    env[name].Spawn = function () {
        this.____constructor();
        if (originalSpawn) {
            GHandler.create(this, originalSpawn).run();
            // pcall(originalSpawn, this);
        }
    };
    CCShare.Reloadable(ability);
};

export const registerModifier = (modifierName?: string, modifierDescription?: string, name?: string) => (modifier: new () => CDOTA_Modifier_Lua) => {
    if (name !== undefined) {
        // @ts-ignore
        modifier.name = name;
    } else {
        name = modifier.name;
    }
    const [env, source] = getFileScope();
    const [fileName] = string.gsub(source, ".*scripts[\\/]vscripts[\\/]", "");
    if (env[name]) {
        clearTable(env[name]);
    }
    env[name] = {};
    toDotaClassInstance(env[name], modifier);
    const originalOnCreated = (env[name] as CDOTA_Modifier_Lua).OnCreated;
    env[name].OnCreated = function (parameters: any) {
        this.____constructor();
        if (originalOnCreated) {
            GHandler.create(this, originalOnCreated).runWith([parameters]);
            // pcall(originalOnCreated, this, parameters);
        }
    };
    let type = LuaModifierType.LUA_MODIFIER_MOTION_NONE;
    let base = (modifier as any).____super;
    while (base) {
        if (base === BaseModifierMotionBoth) {
            type = LuaModifierType.LUA_MODIFIER_MOTION_BOTH;
            break;
        } else if (base === BaseModifierMotionHorizontal) {
            type = LuaModifierType.LUA_MODIFIER_MOTION_HORIZONTAL;
            break;
        } else if (base === BaseModifierMotionVertical) {
            type = LuaModifierType.LUA_MODIFIER_MOTION_VERTICAL;
            break;
        }

        base = base.____super;
    }
    LinkLuaModifier(name, fileName, type);
    CCShare.Reloadable(modifier);
};

/**注册单位 */
export const registerUnit = (unitName?: string, localizationTokens?: { [x: string]: string }, _name?: string) => (unit: new () => BaseNpc | BaseNpc_Hero) => {
    let name = "thisEntity";
    const [env] = getFileScope();
    env[name] = env[name] || {};
    toDotaClassInstance(env[name], unit);
    env.Precache = function (this: void, content: CScriptPrecacheContext) {
        env[name].____constructor && env[name].____constructor();
        env[name].Precache && env[name].Precache(content);
    };
    env.Spawn = function (this: void, entityKeyValues: CScriptKeyValues) {
        env[name].Spawn && env[name].Spawn(entityKeyValues);
    };
    env.Activate = function (this: void) {
        env[name].Activate && env[name].Activate();
    };
    env.UpdateOnRemove = function (this: void) {
        env[name].UpdateOnRemove && env[name].UpdateOnRemove();
    };
    CCShare.Reloadable(unit);
};

function clearTable(table: any) {
    for (const key in table) {
        delete (table as any)[key];
    }
}

function getFileScope(): [any, string] {
    let level = 1;
    while (true) {
        const info = debug.getinfo(level, "S");
        if (info && info.what === "main") {
            return [getfenv(level), info.source!];
        }
        level += 1;
    }
}

/**
 * 生成dota的实例，并存放在文件的上下文中，支持热更新
 * @param instance
 * @param table
 */
function toDotaClassInstance(instance: any, table: new () => any) {
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

