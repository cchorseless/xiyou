
import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_never_death } from "../../../npc/modifier/battle/modifier_never_death";
import { modifier_building_battle_buff } from "../../../npc/modifier/building/modifier_building_battle_buff";
import { serializeETProps } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { THeroUnit } from "../../../shared/service/hero/THeroUnit";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ERoundBoard } from "../Round/ERoundBoard";
import { BuildingRuntimeEntityRoot } from "./BuildingRuntimeEntityRoot";

export class BuildingEntityRoot extends BattleUnitEntityRoot {
    private iGoldCost: number;
    /**累计造成伤害 */
    public fDamage: number;
    @serializeETProps()
    public InventoryLock: { [slot: string]: number };
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.addBattleComp();
        let herounit = GTCharacter.GetOneInstance(this.BelongPlayerid).HeroManageComp.GetHeroUnit(conf);
        this.LoadServerData(herounit, true);
        GEventHelper.AddEvent(THeroUnit.updateEventClassName(), GHandler.create(this, (_hero: THeroUnit) => {
            this.LoadServerData(_hero);
        }), this.BelongPlayerid);
        this.SetStar(1);
        this.InitColor();
        this.InitInventoryLock();
        this.SetUIOverHead(true, false);
        this.InitSyncClientInfo();
        this.JoinInRound();
        this.SetUIOverHead(true, false)
    }



    InitInventoryLock() {
        let rarity = this.GetRarity();
        if (rarity == "D" || rarity == "C" || rarity == "B") {
            this.SetInventoryLock(1, 2);
            this.SetInventoryLock(2, 4);
            this.SetInventoryLock(3, 999);
            this.SetInventoryLock(4, 999);
            this.SetInventoryLock(5, 999);
        }
        else if (rarity == "A") {
            this.SetInventoryLock(2, 2);
            this.SetInventoryLock(3, 4);
            this.SetInventoryLock(4, 999);
            this.SetInventoryLock(5, 999);
        }
        else if (rarity == "S") {
            this.SetInventoryLock(3, 2);
            this.SetInventoryLock(4, 4);
            this.SetInventoryLock(5, 999);
        }

    }

    LoadServerData(herounit: THeroUnit, isinit = false) {
        if (!herounit || herounit.IsDisposed()) { return }
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (herounit.ConfigId != npc.GetUnitName()) { return }
        // 设置等级
        if (herounit && herounit.Level > npc.GetLevel()) {
            let iLevel = herounit.Level - npc.GetLevel();
            npc.CreatureLevelUp(iLevel);
            if (!isinit) {
                for (let i = 0; i < iLevel; i++) {
                    GTimerHelper.AddTimer(0.5 * i, GHandler.create(this, () => {
                        ResHelper.CreateParticle(
                            new ResHelper.ParticleInfo()
                                .set_resPath("particles/generic_hero_status/hero_levelup.vpcf")
                                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                                .set_owner(npc)
                                .set_validtime(3)
                        );
                        EmitSoundOn("lvl_up", npc);
                    }));
                }
            }
        }
    }

    SetGoldCost(gold: number) {
        this.iGoldCost = gold;
    }
    /**金币价格 */
    GetGoldCost() {
        if (!this.iGoldCost) {
            let itemName = KVHelper.GetUnitData(this.ConfigID, "CardName") as string;
            if (itemName) {
                this.iGoldCost = GToNumber(KVHelper.GetItemData(itemName, "ItemCost"));
            }
        }
        return this.iGoldCost;
    }

    GetPopulation(): number {
        return GBuildingSystem.GetInstance().GetBuildingPopulation(this.ConfigID)
    }
    /**
     * 设置Inventory星级锁定
     * @param slot 
     * @param value 
     */
    SetInventoryLock(slot: number, iStar: number) {
        if (!this.InventoryLock) {
            this.InventoryLock = {};
        }
        let domain = this.GetDomain<IBaseNpc_Plus>();
        if (iStar < 0) {
            delete this.InventoryLock[slot + ""];
            let item = domain.GetItemInSlot(slot);
            if (item && item.IsItemBlank()) {
                domain.RemoveItem(item);
            }
        }
        else {
            this.InventoryLock[slot + ""] = iStar;
            domain.AddEmptyItemInSlot(slot);
        }
    }




    /**
     * 升星
     * @param n
     */
    AddStar(n: number) {
        this.SetStar(this.iStar + n);
        let domain = this.GetDomain<IBaseNpc_Plus>();
        if (this.InventoryLock) {
            Object.keys(this.InventoryLock).forEach((slot) => {
                if (this.InventoryLock[slot] <= this.iStar) {
                    this.SetInventoryLock(GToNumber(slot), -1)
                }
            })
        }
        // "particles/econ/events/fall_2021/hero_levelup_fall_2021.vpcf"
        // "particles/generic_hero_status/hero_levelup.vpcf"
        // "particles/units/heroes/hero_oracle/oracle_false_promise_cast_enemy.vpcf"
        // 	play_particle("particles/econ/events/ti9/ti9_drums_musicnotes.vpcf",PATTACH_OVERHEAD_FOLLOW,uu,3)
        let res = "particles/econ/events/ti6/hero_levelup_ti6.vpcf"
        ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_resPath(res)
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_owner(domain)
                .set_validtime(3)
        );
        EmitSoundOn("lvl_up", domain);
        // 通知跑马灯
        this.SyncClient();
    }

    IsBuilding() { return true }
    /**助战玩家ID */
    HelperPlayerid: PlayerID;

    public RuntimeBuilding: BuildingRuntimeEntityRoot;
    OnRound_Start() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.applyOnly(npc, npc);
        if (this.RuntimeBuilding) {
            this.RuntimeBuilding.Dispose();
        }
        this.RuntimeBuilding = null;
        modifier_building_battle_buff.remove(npc);
    }
    OnRound_Battle(round: ERoundBoard) {
        if (!IsServer()) { return };
        if (!this.ChessComp().isInBattle) { return }
        const hCaster = this.GetDomain<IBaseNpc_Plus>();
        const vLocation = hCaster.GetAbsOrigin();
        modifier_building_battle_buff.applyOnly(hCaster, hCaster);
        // this.SetUIOverHead(false, true)
        const cloneRuntime = BaseNpc_Plus.CreateUnitByName(this.ConfigID, vLocation, hCaster) as IBaseNpc_Plus;
        if (cloneRuntime) {
            // cloneRuntime.RemoveGesture(GameActivity_t.ACT_DOTA_SPAWN);
            // 可能助战情况下，助战玩家ID不是自己
            const playerid = this.HelperPlayerid || this.BelongPlayerid;
            cloneRuntime.StartGestureFadeWithSequenceSettings(GameActivity_t.ACT_DOTA_TAUNT);
            BuildingRuntimeEntityRoot.Active(cloneRuntime, playerid, this.ConfigID);
            const runtimeroot = cloneRuntime.ETRoot.As<BuildingRuntimeEntityRoot>();
            GGameScene.GetPlayer(playerid).AddDomainChild(runtimeroot);
            this.RuntimeBuilding = runtimeroot;
            runtimeroot.SetStar(this.iStar);
            // wearable
            runtimeroot.WearableComp().WearCopy(this.WearableComp());
            // equip
            runtimeroot.InventoryComp().cloneItem(this.InventoryComp());
            // ability
            runtimeroot.AbilityManagerComp().cloneAbility(this.AbilityManagerComp());
            // buff
            runtimeroot.BuffManagerComp().cloneRuntimeBuff(this.BuffManagerComp())
            runtimeroot.SyncClient();
            // 不死
            modifier_never_death.applyOnly(cloneRuntime, cloneRuntime);
            // 跟随移动
            // modifier_follow_courier.applyOnly(cloneRuntime, cloneRuntime);
        }
    }
    OnRound_Prize(round: ERoundBoard) { }
    OnRound_WaitingEnd() {
        if (this.RuntimeBuilding) {
            this.RuntimeBuilding.Dispose();
        }
        this.RuntimeBuilding = null;
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (IsValid(npc)) {
            SafeDestroyUnit(npc);
        }
        // npc.HasScepter
    }

    Config() {
        return KVHelper.KvConfig().building_unit_tower["" + this.ConfigID];
    }

    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }
    GetRarity(): IRarity {
        return (this.Config().Rarity || "B") as IRarity;
    }
}
declare global {
    type IBuildingEntityRoot = BuildingEntityRoot;
    var GBuildingEntityRoot: typeof BuildingEntityRoot;
}

if (_G.GBuildingEntityRoot == undefined) {
    _G.GBuildingEntityRoot = BuildingEntityRoot;
}