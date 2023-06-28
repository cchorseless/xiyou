
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { EEnum } from "../../../shared/Gen/Types";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { PlayerData } from "../../../shared/rules/Player/PlayerData";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class PlayerDataComponent extends PlayerData implements IRoundStateCallback {

    onAwake(...args: any[]): void {
        this.addEvent();
        this.applyPopuLevelUp(1);
        this.applyTechLevelUp(1);
        this.SyncClient();
    }

    isEnoughItem(type: number, count: number) {
        count = math.abs(count);
        switch (type) {
            case EEnum.EMoneyType.Gold:
                return this.gold - count >= 0;
            case EEnum.EMoneyType.Wood:
                return this.wood - count >= 0;
            case EEnum.EMoneyType.SoulCrystal:
                return this.soulcrystal - count >= 0;
        }
        return false;
    }

    StartGame() {
        this.addCoinPerInterval();
    }


    changeItem(type: number, count: number) {
        switch (type) {
            case EEnum.EMoneyType.Gold:
                this.gold += count;
                let offset = this.gold - PlayerResource.GetGold(this.BelongPlayerid);
                PlayerResource.ModifyGold(this.BelongPlayerid, offset, true, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified)
                break;
            case EEnum.EMoneyType.Wood:
                this.wood += count;
                break;
            case EEnum.EMoneyType.SoulCrystal:
                this.soulcrystal += count;
                break;
        }
    }

    changePopulation(count: number) {
        this.population += count;
        this.SyncClient();
    }

    addMoneyRoundStart(gold: number, wood: number) {
        this.ModifyGold(gold);
        this.ModifyWood(wood);
    }

    timePerInterval: ITimerTask;
    addCoinPerInterval() {
        if (this.timePerInterval != null) {
            this.timePerInterval.Clear()
            this.timePerInterval = null;
        }
        this.timePerInterval = GTimerHelper.AddTimer(15, GHandler.create(this, () => {
            this.ModifyGold(this.perIntervalGold);
            this.ModifyWood(this.perIntervalWood);
            this.ModifySoulCrystal(this.perIntervalSoulCrystal);
            GNotificationSystem.NoticeCombatMessage({
                message: "lang_Notification_Prize_Gold",
                coin_gold: this.perIntervalGold,
                string_from: "lang_Module_15s_Prize",
            }, this.BelongPlayerid);
            GNotificationSystem.NoticeCombatMessage({
                message: "lang_Notification_Prize_Wood",
                coin_wood: this.perIntervalWood,
                string_from: "lang_Module_15s_Prize",
            }, this.BelongPlayerid);
            GNotificationSystem.NoticeCombatMessage({
                message: "lang_Notification_Prize_SoulCrystal",
                coin_soulcrystal: this.perIntervalSoulCrystal,
                string_from: "lang_Module_15s_Prize",
            }, this.BelongPlayerid);
            return 15
        }))
    }

    addEvent() {
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_JoinBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                if (building.IsBuilding()) {
                    let popu = building.GetPopulation();
                    this.changePopulation(popu);
                }
            }), this.BelongPlayerid
        );
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_LeaveBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                if (building.IsBuilding()) {
                    let popu = building.GetPopulation();
                    this.changePopulation(-popu);
                }
            }),
            this.BelongPlayerid);

        // EventHelper.addProtocolEvent(PlayerConfig.EProtocol.reqApplyPopuLevelUp, GHandler.create(this, (e) => {
        //     e.state = true;
        //     if (this.popuLevel >= this.popuLevelMax) {
        //         GNotificationSystem.ErrorMessage("level max", this.BelongPlayerid);
        //         return;
        //     }
        //     if (this.gold < this.popuLevelUpCostGold) {
        //         GNotificationSystem.ErrorMessage("gold not enough", this.BelongPlayerid);
        //         return;
        //     }
        //     if (this.wood < this.popuLevelUpCostWood) {
        //         GNotificationSystem.ErrorMessage("wood not enough", this.BelongPlayerid);
        //         return;
        //     }
        //     this.changeItem(EEnum.EMoneyType.Gold, -this.popuLevelUpCostGold);
        //     this.changeItem(EEnum.EMoneyType.Wood, -this.popuLevelUpCostWood);
        //     this.applyPopuLevelUp(1);
        //     this.SyncClient();
        // }));
        // EventHelper.addProtocolEvent(PlayerConfig.EProtocol.reqApplyTechLevelUp, GHandler.create(this, (e) => {
        //     e.state = true;
        //     if (this.techLevel >= this.techLevelMax) {
        //         GNotificationSystem.ErrorMessage("tech level max", this.BelongPlayerid);
        //         return;
        //     }
        //     if (this.gold < this.techLevelUpCostGold) {
        //         GNotificationSystem.ErrorMessage("gold not enough", this.BelongPlayerid);
        //         return;
        //     }
        //     this.changeItem(EEnum.EMoneyType.Gold, -this.techLevelUpCostGold);
        //     this.applyTechLevelUp(1);
        //     this.SyncClient();
        // }));
    }
    /**
     * 获取空闲人口数量
     * @param playerID
     * @returns
     */
    getFreePopulation() {
        return this.populationRoof - this.population;
    }
    applyPopuLevelUp(addlevel: number) {
        const config = GJSONConfig.CourierAbilityLevelUpConfig.get(this.popuLevel + addlevel + "");
        this.populationRoof += config.PopulationRoof;
        this.popuLevelUpCostGold = config.PopuGoldCost;
        this.popuLevelUpCostWood = config.PopuWoodCost;
        this.popuLevel += addlevel;

    }
    applyTechLevelUp(addlevel: number) {
        const config = GJSONConfig.CourierAbilityLevelUpConfig.get(this.techLevel + addlevel + "");
        this.perIntervalGold += config.TechExtraGood;
        this.perIntervalWood += config.TechExtraWood;
        this.perIntervalSoulCrystal += config.TechExtraSoulCrystal;
        this.techLevelUpCostGold = config.TechGoldcost;
        this.techLevel += addlevel;
    }

    OnRound_Start(round: ERoundBoard) {
        if (round.BelongPlayerid == this.BelongPlayerid) {
            this.addMoneyRoundStart(round.config.roundprizeGold, round.config.roundprizeWood);
        }
    }
    OnRound_Battle(): void { }
    OnRound_Prize(round?: ERoundBoard): void { }
    OnRound_WaitingEnd(): void { }
    OnGame_End(iswin: boolean): void {
        if (this.timePerInterval != null) {
            this.timePerInterval.Clear()
            this.timePerInterval = null;
        }
    }

    GetGold() {
        return this.gold;
    }

    /**
     * 
     * @param goldChange 
     * @param vStart 特效起点
     * @returns 
     */
    ModifyGold(goldChange: number, vStart: Vector = null) {
        this.changeItem(EEnum.EMoneyType.Gold, goldChange);
        if (goldChange > 0) {
            let hHero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
            if (vStart && hHero != null && !hHero.IsNull()) {
                let respath1 = "particles/econ/courier/courier_beetlejaw/courier_beetlejaw_ambient_gold.vpcf";
                let respath2 = "particles/performance/gold/gold_trail.vpcf";
                let iParticleID = ParticleManager.CreateParticle(respath2, ParticleAttachment_t.PATTACH_POINT, hHero)
                ParticleManager.SetParticleControl(iParticleID, 0, vStart)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hHero, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hHero.GetAbsOrigin(), false)
                ParticleManager.ReleaseParticleIndex(iParticleID)
                GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                    SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hHero, goldChange, null)
                    this.SyncClient();
                }))
                return
            }
            SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hHero, goldChange, null)
        }
        this.SyncClient();
    }

    ModifyWood(woodChange: number, vStart: Vector = null) {
        this.changeItem(EEnum.EMoneyType.Wood, woodChange);
        if (woodChange > 0) {
            let hHero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
            if (vStart && hHero != null && !hHero.IsNull()) {
                let respath2 = "particles/performance/wood/wood_trail.vpcf";
                let iParticleID = ParticleManager.CreateParticle(respath2, ParticleAttachment_t.PATTACH_POINT, hHero)
                ParticleManager.SetParticleControl(iParticleID, 0, vStart)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hHero, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hHero.GetAbsOrigin(), false)
                ParticleManager.ReleaseParticleIndex(iParticleID)
                GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                    SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, hHero, woodChange, null)
                    this.SyncClient();
                }))
                return
            }
            SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, hHero, woodChange, null)
        }
        this.SyncClient();
    }


    ModifySoulCrystal(soulCrystal: number, vStart: Vector = null) {
        this.changeItem(EEnum.EMoneyType.SoulCrystal, soulCrystal);
        if (soulCrystal > 0) {
            let hHero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
            if (vStart && hHero != null && !hHero.IsNull()) {
                let respath2 = "particles/performance/crystal/crystal_trail.vpcf";
                let iParticleID = ParticleManager.CreateParticle(respath2, ParticleAttachment_t.PATTACH_POINT, hHero)
                ParticleManager.SetParticleControl(iParticleID, 0, vStart)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hHero, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hHero.GetAbsOrigin(), false)
                ParticleManager.ReleaseParticleIndex(iParticleID)
                GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                    SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, hHero, soulCrystal, null)
                    this.SyncClient();
                }))
                return
            }
            SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, hHero, soulCrystal, null)
        }
        this.SyncClient();
    }
}

