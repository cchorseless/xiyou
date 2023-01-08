import { GameFunc } from "../../GameFunc";
import { AoiHelper } from "../../helper/AoiHelper";
import { LogHelper } from "../../helper/LogHelper";
import { GameEnum } from "../../shared/GameEnum";
import { CCShare } from "../../shared/lib/CCShare";
import { ET } from "../../shared/lib/Entity";

export interface BaseAbility extends CDOTA_Ability_Lua { }
export class BaseAbility implements ET.IEntityRoot {
    ETRoot?: ET.EntityRoot;
    __safedestroyed__?: boolean = false;
    /**查找技能 */
    static findIn<T extends typeof BaseAbility>(this: T, target: CDOTA_BaseNPC) {
        return target.FindAbilityByName(this.name) as InstanceType<T>;
    }
    SafeDestroy?() {
        if (!IsServer()) {
            return;
        }
        if (GameFunc.IsValid(this)) {
            if (this.__safedestroyed__) {
                return;
            }
            this.__safedestroyed__ = true;
            GTimerHelper.ClearAll(this);
            this.Destroy();
            UTIL_Remove(this);
        }
    }
}

export interface BaseItem extends CDOTA_Item_Lua { }
export class BaseItem implements ET.IEntityRoot {
    ETRoot?: ET.EntityRoot;
    __safedestroyed__?: boolean = false;
    SafeDestroy?() {
        if (!IsServer()) {
            return;
        }
        if (GameFunc.IsValid(this)) {
            if (this.__safedestroyed__) {
                return;
            }
            this.__safedestroyed__ = true;
            GTimerHelper.ClearAll(this);
            this.Destroy();
            UTIL_Remove(this);
        }
    }
}

export interface BaseModifier extends CDOTA_Modifier_Lua { }
export class BaseModifier {
    /**本地特效时间 */
    public static LOCAL_PARTICLE_MODIFIER_DURATION = 3 / 30;

    /**
     * 新增BUFF,只能在服务器运行
     * @param target
     * @param caster
     * @param ability
     * @param modifierTable 注意：不会同步到客户端,这里最好不要传数据
     * @returns
     */
    public static apply<T extends typeof BaseModifier>(this: T, target: IBaseNpc_Plus, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: ModifierTable): InstanceType<T> {
        if (IsServer()) {
            let m = target.AddNewModifier(caster, ability, this.name, modifierTable) as InstanceType<T>;
            if (m && m.UUID) {
                GGameCache.allModifiersIntance[this.name] = GGameCache.allModifiersIntance[this.name] || {};
                GGameCache.allModifiersIntance[this.name][m.UUID] = m;
            }
            return m;
        }
    }

    /**
     * 添加唯一的BUFF
     * @param this
     * @param target
     * @param caster
     * @param ability
     * @param modifierTable
     * @returns
     */
    public static applyOnly<T extends typeof BaseModifier>(this: T, target: IBaseNpc_Plus, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: ModifierTable): InstanceType<T> {
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
        modifierTable?: ModifierTable,
        teamNumber?: DOTATeam_t,
        phantomBlocker: boolean = false
    ): IBaseNpc_Plus {
        if (IsServer()) {
            if (teamNumber == null) {
                teamNumber = caster.GetTeamNumber();
            }
            let n = CreateModifierThinker(caster, ability, this.name, modifierTable, position, teamNumber, phantomBlocker) as BaseNpc;
            GameFunc.BindInstanceToCls(n, BaseNpc);
            let m = n.FindModifierByNameAndCaster(this.name, caster) as InstanceType<T>;
            if (m && m.UUID) {
                GGameCache.allModifiersIntance[this.name] = GGameCache.allModifiersIntance[this.name] || {};
                GGameCache.allModifiersIntance[this.name][m.UUID] = m;
            }
            return n as IBaseNpc_Plus;
        }
    }

    /**
     * 移除BUFF
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

    /**获取所有的实例数据 */
    public static GetAllInstance<T extends typeof BaseModifier>(this: T) {
        if (GGameCache.allModifiersIntance[this.name]) {
            return GGameCache.allModifiersIntance[this.name] as Readonly<{ [UUID: string]: InstanceType<T> }>;
        }
    }
    /**重载 */
    public static reload<T extends typeof BaseModifier>(this: T) {
        if (!IsServer()) {
            return;
        }
        let _instanceArr = this.GetAllInstance();
        if (_instanceArr) {
            for (let uuid in _instanceArr) {
                let m = _instanceArr[uuid] as any;
                let _ma = getmetatable(m).__index as any;
                Object.assign(_ma, this.prototype);
                m.SendBuffRefreshToClients();
                // LogHelper.print(m.aaa())
                break;
            }
        }
    }
    /**
     * 存在于
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

    public static GetStackIn<T extends typeof BaseModifier>(this: T, target: CDOTA_BaseNPC, caster: CDOTA_BaseNPC = null): number {
        if (target && this.exist(target)) {
            let m;
            if (caster) {
                m = target.FindModifierByNameAndCaster(this.name, caster) as InstanceType<T>;
            } else {
                m = target.FindModifierByName(this.name) as InstanceType<T>;
            }
            if (m) {
                return m.GetStackCount();
            }
        }
        return 0;
    }

    /**
     * 获取所有装饰器注册的buff
     * @param hCaster
     * @returns
     */
    public static GetAllModifiersInfo<T extends BaseModifier>(hCaster: IBaseNpc_Plus): { [v: string]: Array<T> } {
        if (hCaster == null) {
            return;
        }
        if (hCaster.__allModifiersInfo__ == null) {
            hCaster.__allModifiersInfo__ = {};
        }
        return hCaster.__allModifiersInfo__;
    }
    /**所有注册的属性 */
    public __AllRegisterProperty: { [v: string]: Set<string> };
    /**所有注册的属性函数 */
    public __AllRegisterFunction: { [v: string]: Set<(...args: any[]) => number> };
    /**所有注册的事件函数 */
    public __AllRegisterEvent: { [v: string]: [Set<(...args: any[]) => void>, Set<(...args: any[]) => void>] };

    /**是否隐藏 */
    public IsHidden() {
        return true;
    }
    /**是否是debuff */
    public IsDebuff() {
        return false;
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
    /**初始化自己，OnCreated和OnRefresh都会调用 */
    public Init(params?: object) { }
    public DeclareFunctions?(): modifierfunction[] {
        let _all_set = new Set<modifierfunction>();
        let _Property = this.__AllRegisterProperty;
        let _Function = this.__AllRegisterFunction;
        let _hasExit = GameEnum.Property.CustomDeclarePropertyEvent;
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
        _all_set.forEach((params) => {
            if (_hasExit.has(params as any)) {
                return;
            }
            let propName = GameEnum.Property.Enum_MODIFIER_PROPERTY[params];
            if (propName != null) {
                let funcName = (GameEnum.Property.Enum_MODIFIER_PROPERTY_FUNC as any)[propName];
                if (funcName && (this as any)[funcName] == null) {
                    (this as any)[funcName] = (event?: any) => {
                        let _r = 0;
                        let _r_ = "";
                        let _Property = this.__AllRegisterProperty;
                        let _Function = this.__AllRegisterFunction;
                        let _sum = GameEnum.Property.UNIQUE_PROPERTY.indexOf(params as any) == -1;
                        if (_Property && _Property[params]) {
                            _Property[params].forEach((attr: string) => {
                                let r = (this as any)[attr];
                                if (r) {
                                    switch (typeof r) {
                                        case "number":
                                            if (_sum) {
                                                _r += r;
                                            } else {
                                                _r = math.max(_r, r);
                                            }
                                            break;
                                        case "string":
                                            _r_ = r;
                                            break;
                                    }
                                }
                            });
                        }
                        if (_Function && _Function[params]) {
                            _Function[params].forEach((func) => {
                                let [func_finish, r] = pcall(func, this, event);
                                if (func_finish && r) {
                                    switch (typeof r) {
                                        case "number":
                                            if (_sum) {
                                                _r += r;
                                            } else {
                                                _r = math.max(_r, r);
                                            }
                                            break;
                                        case "string":
                                            _r_ = r;
                                            break;
                                    }
                                }
                            });
                        }
                        // 优先返回字符串
                        if (_r_.length != 0) {
                            return _r_;
                        }
                        return _r;
                    };
                }
            }
        });
        return Array.from(_all_set);
    }
    /**唯一识别ID */
    public UUID: string;
    public OnCreated(params: object) {
        this.__destroyed = false;
        if (this.UUID == null) {
            this.UUID = GGenerateUUID();
        }
        (params as ModifierTable).IsOnCreated = true;
        (params as ModifierTable).IsOnRefresh = false;
        // LogHelper.print("OnCreated :" + this.GetName());
        this.Init(params);
        if (this.__AllRegisterProperty == null && this.__AllRegisterFunction == null && this.__AllRegisterEvent == null) {
            return;
        }
        let info = BaseModifier.GetAllModifiersInfo(this.GetParentPlus());
        if (info == null) return;
        if (info[this.GetName()] == null) {
            info[this.GetName()] = [];
        }
        info[this.GetName()].push(this);
        // 同步事件
        if (this.__AllRegisterEvent) {
            for (let k in this.__AllRegisterEvent) {
                GGameCache.allRegisterEvent[k] = GGameCache.allRegisterEvent[k] || new Set();
                GGameCache.allRegisterEvent[k].add(this);
            }
        }
    }

    public OnRefresh(params: object) {
        this.__destroyed = false;
        (params as ModifierTable).IsOnCreated = false;
        (params as ModifierTable).IsOnRefresh = true;
        this.Init(params);
    }
    /**是否被销毁 */
    public IsNull() {
        return this.__destroyed;
    }
    private __destroyed: boolean = true;
    public OnDestroy() {
        let info = BaseModifier.GetAllModifiersInfo(this.GetParentPlus());
        let classname = this.GetName();
        // 删除数据
        if (info && info[classname]) {
            let len = info[classname].length;
            for (let i = 0; i < len; i++) {
                if (this.UUID == info[classname][i].UUID) {
                    // 删除元素
                    info[classname].splice(i, 1);
                    break;
                }
            }
            if (info[classname].length == 0) {
                delete info[classname];
            }
        }
        this.__AllRegisterFunction = null;
        this.__AllRegisterProperty = null;
        // 删除事件
        if (this.__AllRegisterEvent) {
            for (let k in this.__AllRegisterEvent) {
                if (GGameCache.allRegisterEvent[k]) {
                    GGameCache.allRegisterEvent[k].delete(this);
                }
            }
        }
        this.__AllRegisterEvent = null;
        // 计时器处理
        GTimerHelper.ClearAll(this);
        this.StartIntervalThink(-1);
        if (this.UUID && GGameCache.allModifiersIntance[classname]) {
            if (GGameCache.allModifiersIntance[classname][this.UUID]) {
                delete GGameCache.allModifiersIntance[classname][this.UUID];
            }
            if (Object.keys(GGameCache.allModifiersIntance[classname]).length == 0) {
                delete GGameCache.allModifiersIntance[classname];
            }
        }
        this.__destroyed = true;
        // LogHelper.print(this.GetName() + " destroy ");
    }

    /**
     * 圆形范围找敌方单位
     * @param radius
     * @param p
     * @returns
     */
    FindEnemyInRadius(radius: number, p: Vector = null) {
        if (IsServer()) {
            if (p == null) {
                p = this.GetCaster().GetAbsOrigin();
            }
            let teamNumber = this.GetCaster().GetTeamNumber();
            return AoiHelper.FindEntityInRadius(teamNumber, p, radius);
        }
    }
    /**获取施法技能 */
    GetAbilityPlus() {
        return this.GetAbility() as IBaseAbility_Plus;
    }
    /**获取施法来源NPC，谁施法的 */
    GetCasterPlus() {
        return this.GetCaster() as IBaseNpc_Plus;
    }
    /**获取作用归属NPC，在谁身上 */
    GetParentPlus() {
        return this.GetParent() as IBaseNpc_Plus;
    }
    /**自己给自己施法的 */
    IsCastBySelf() {
        return this.GetCasterPlus().GetEntityIndex() == this.GetParentPlus().GetEntityIndex();
    }

    /**
     * 獲取當前等級對應技能屬性
     * @param s
     * @param default_V 默认值
     * @returns
     */
    GetSpecialValueFor(s: string, default_V = 0): number {
        let r = 0;
        if (this.GetAbility() == null) {
            r = (this as any)[s];
        } else {
            r = this.GetAbilityPlus().GetSpecialValueFor(s) || 0;
        }
        if (r && r != 0) {
            return r;
        } else {
            return default_V;
        }
    }

    GetLevelSpecialValueFor(s: string, lvl: number) {
        if (this.GetAbility() == null) {
            let r = (this as any)[s];
            return r || 0;
        }
        return this.GetAbility().GetLevelSpecialValueFor(s, lvl);
    }
    GetAbilityLevel() {
        if (this.GetAbility() == null) {
            return -1;
        }
        return this.GetAbility().GetLevel();
    }
    /**
     * 更改BUFF层数
     * @param iCount +增加 +减少
     * @returns
     */
    changeStackCount(iCount: number) {
        let oldCount = this.GetStackCount();
        this.SetStackCount(Math.max(0, oldCount + iCount));
        return this.GetStackCount();
    }
}

export interface BaseNpc extends CDOTA_BaseNPC { }
export class BaseNpc implements ET.IEntityRoot {
    ETRoot?: ET.EntityRoot;
    /**对应dota内的名字 */
    __IN_DOTA_NAME__?: string;
    /**对应dota内的数据 */
    __IN_DOTA_DATA__?: any;
    /**是否是第一次创建 */
    __bIsFirstSpawn?: boolean;
    /**所有的BUFF信息 */
    __allModifiersInfo__?: { [v: string]: Array<any> };

    private __SpawnedHandler__?: Array<IGHandler>;
    /**是否已经被安全销毁 */
    __safedestroyed__?: boolean = false;
    /**缓存 */
    Precache?(context: CScriptPrecacheContext) { }
    /**出生 */
    Spawn?(entityKeyValues: CScriptKeyValues) { }
    /**Spawn事件后执行
     * @both
     */
    onSpawned?(event: NpcSpawnedEvent) { }
    /**onSpawned之后执行，激活 */
    Activate?() { }
    /**
     * @override
     * 删除
     * */
    UpdateOnRemove?() { }
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

    runSpawnedHandler?() {
        if (this.__SpawnedHandler__ && this.__SpawnedHandler__.length > 0) {
            this.__SpawnedHandler__.forEach((handler) => {
                handler.run();
            });
            this.__SpawnedHandler__ = null;
        }
    }

    /**
     * 是否是真实单位
     */
    IsRealUnit?() {
        return !(this.IsIllusion() || this.IsSummoned());
    }
    /**
     * 安全销毁实体
     */
    SafeDestroy?() {
        if (!IsServer()) {
            return;
        }
        if (GameFunc.IsValid(this)) {
            if (this.__safedestroyed__) {
                return;
            }
            this.__safedestroyed__ = true;
            let allm = this.FindAllModifiers();
            for (let m of allm) {
                m.Destroy();
            }
            GTimerHelper.ClearAll(this);
            UTIL_Remove(this);
        }
    }
    //#region 天赋
    /**
     * 是否有天赋
     * @param sTalentName 天赋名称 或者 技能索引
     * @returns
     */
    HasTalent?(sTalentName: string | number): IBaseAbility_Plus {
        if (this == null) return;
        let hTalent;
        switch (typeof sTalentName) {
            case "number":
                hTalent = this.GetAbilityByIndex(sTalentName);
                break;
            case "string":
                hTalent = this.FindAbilityByName(sTalentName);
                break;
        }
        if (hTalent == null) return;
        if (hTalent.GetLevel() <= 0) return;
        return hTalent as IBaseAbility_Plus;
    }

    /**
     * 获取天赋的值
     * @param sTalentName 天赋的名字或者索引
     * @returns
     */
    GetTalentValue?(sTalentName: string | number, sSpecialName: string = "value", default_V: number = 0): number {
        let hTalent = this.HasTalent(sTalentName);
        if (hTalent) {
            return hTalent.GetSpecialValueFor(sSpecialName, default_V);
        }
        return default_V;
    }
    //#endregion
    //#region 羁绊
    HasCombination?(sCombination: string): IBaseModifier_Plus {
        if (this == null) return;
        let Combination = this.FindModifierByName(sCombination);
        if (Combination == null) return;
        if (Combination.GetStackCount() == 0) return;
        return Combination as IBaseModifier_Plus;
    }
    //#endregion



    /**
     * 是否拥有魔晶
     * @param hCaster
     */
    HasShard?() {
        // return hCaster.HasModifier()
        return false;
    }
    /**
     * 异常状态抵抗百分比，用于异常状态持续时间
     * @param n
     * @returns
     */
    GetStatusResistanceFactor?(n: CDOTA_BaseNPC) {
        return 1;
    }

    IsFriendly?(hTarget: BaseNpc) {
        return this.GetTeamNumber() == hTarget.GetTeamNumber();
    }
    ModifyMaxHealth?(fChanged: number) {
        // let fHealthPercent = this.GetHealth() / this.GetMaxHealth()
        // this.fBaseHealth = (this.fBaseHealth || this.GetMaxHealth()) + fChanged
        // let fAddHpPercent = GetHealthPercentage != null && (GetHealthPercentage(this) || 0) * 0.01 || 0
        // let fEnemyHpPercent = GetHealthPercentageEnemy != null && (GetHealthPercentageEnemy(this) || 0) * 0.01 || 0
        // let fBonusHealth = (fAddHpPercent + fEnemyHpPercent) * this.fBaseHealth
        // let fHealth = this.fBaseHealth + fBonusHealth
        // let fCorrectHealth = GameFunc.mathUtil.Clamp(fHealth, 1, MAX_HEALTH)
        // this.SetBaseMaxHealth(fCorrectHealth)
        // this.SetMaxHealth(fCorrectHealth)
        // this.ModifyHealth(fHealthPercent * fCorrectHealth, null, false, 0)
    }
    addAbilityPlus?(abilityname: string, level: number = 1) {
        let ability = this.AddAbility(abilityname);
        if (ability) {
            ability.SetActivated(true);
            ability.SetLevel(level);
        }
        else {
            GLogHelper.error("addAbilityPlus ERROR ", abilityname, level)
        }
        return ability as IBaseAbility_Plus;
    }

    removeAbilityPlus?(abilityname: string) {
        let ability = this.FindAbilityByName(abilityname) as IBaseAbility_Plus;
        if (ability) {
            ability.SafeDestroy();
            this.RemoveAbility(abilityname);
        }
        else {
            GLogHelper.error("removeAbilityPlus ERROR ", abilityname)
        }
    }


    public addBuff?<T extends BaseModifier>(buffname: string, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: ModifierTable): T {
        if (IsServer()) {
            let m = this.AddNewModifier(caster, ability, buffname, modifierTable) as T;
            if (m && m.UUID) {
                GGameCache.allModifiersIntance[buffname] = GGameCache.allModifiersIntance[buffname] || {};
                GGameCache.allModifiersIntance[buffname][m.UUID] = m;
            }
            return m;
        }
    }


    public addOnlyBuff?<T extends BaseModifier>(buffname: string, caster?: IBaseNpc_Plus, ability?: IBaseAbility_Plus, modifierTable?: ModifierTable): T {
        if (IsServer()) {
            if (this.existBuff(buffname)) {
                return this.findBuff(buffname, caster);
            } else {
                return this.addBuff<T>(buffname, caster, ability, modifierTable);
            }
        }
    }


    public removeBuff?<T extends BaseModifier>(buffname: string, caster?: CDOTA_BaseNPC) {
        if (IsServer()) {
            if (caster) {
                let modef = this.findBuff<T>(buffname, caster);
                if (modef) {
                    modef.Destroy();
                }
            } else {
                let modef = this.findBuff<T>(buffname);
                if (modef) {
                    modef.Destroy();
                }
            }
        }
    }


    public existBuff?<T extends BaseModifier>(buffname: string): boolean {
        if (buffname) {
            return this.HasModifier(buffname);
        }
        return false;
    }

    public findBuff?<T extends BaseModifier>(buffname: string, caster: CDOTA_BaseNPC = null): T {
        if (buffname && this.existBuff(buffname)) {
            if (caster) {
                return this.FindModifierByNameAndCaster(buffname, caster) as T;
            }
            return this.FindModifierByName(buffname) as T;
        }
    }


    public getBuffStack?<T extends BaseModifier>(buffname: string, caster: CDOTA_BaseNPC = null): number {
        let m = this.findBuff<T>(buffname, caster);
        if (m) {
            return m.GetStackCount();
        }
        return 0;
    }
    /**
        *
        * @param entityKeyValues
        */
    InitActivityModifier?() {
        if (this.__IN_DOTA_DATA__) {
            let entityKeyValues = this.__IN_DOTA_DATA__;
            let move = entityKeyValues.MovementSpeedActivityModifiers;
            let attackspeed = entityKeyValues.AttackSpeedActivityModifiers;
            let attackrange = entityKeyValues.AttackRangeActivityModifiers;
            let obj = {};
            if (move) {
                obj = Object.assign(obj, move)
            }
            if (attackspeed) {
                obj = Object.assign(obj, attackspeed)
            }
            if (attackrange) {
                obj = Object.assign(obj, attackrange)
            }
            if (Object.keys(obj).length > 0) {
                Gmodifier_activity.apply(this, this, null, obj)
            }
        }

    }

}

export interface BaseNpc_Hero extends CDOTA_BaseNPC_Hero { }
export class BaseNpc_Hero extends BaseNpc { }

export interface BaseModifierMotionHorizontal extends CDOTA_Modifier_Lua_Horizontal_Motion { }
export class BaseModifierMotionHorizontal extends BaseModifier { }

export interface BaseModifierMotionVertical extends CDOTA_Modifier_Lua_Vertical_Motion { }
export class BaseModifierMotionVertical extends BaseModifier { }

export interface BaseModifierMotionBoth extends CDOTA_Modifier_Lua_Motion_Both { }
export class BaseModifierMotionBoth extends BaseModifier { }

LogHelper.print(`-------------------setmetatable IsServer: ${IsServer()}------------------------------`);
// Add standard base classes to prototype chain to make `super.*` work as `self.BaseClass.*`
setmetatable(BaseAbility.prototype, { __index: IsServer() ? CDOTA_Ability_Lua : C_DOTA_Ability_Lua });
setmetatable(BaseItem.prototype, { __index: IsServer() ? CDOTA_Item_Lua : C_DOTA_Item_Lua });
setmetatable(BaseModifier.prototype, { __index: IsServer() ? CDOTA_Modifier_Lua : C_DOTA_Modifier_Lua });
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
            pcall(originalSpawn, this);
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
            pcall(originalOnCreated, this, parameters);
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
