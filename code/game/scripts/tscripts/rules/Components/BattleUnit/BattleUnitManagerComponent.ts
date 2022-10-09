import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_illusion } from "../../../npc/modifier/modifier_illusion";
import { modifier_summon } from "../../../npc/modifier/modifier_summon";
import { registerET, ET } from "../../Entity/Entity";
import { BuildingRuntimeEntityRoot } from "../Building/BuildingRuntimeEntityRoot";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { BattleUnitSummonEntityRoot } from "./BattleUnitSummonEntityRoot";

@registerET()
export class BattleUnitManagerComponent extends ET.Component {
    allSummon: string[] = [];
    allIllusion: string[] = [];
    allBuildingRuntime: string[] = [];

    public AddSummon(sUnitName: string, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (!battleUnit) return;
        let summon = modifier_summon.CreateSummon(sUnitName, hCaster, vLocation, fDuration, bFindClearSpace, iTeamNumber)
        if (summon) {
            let playerid = battleUnit.Playerid;
            BattleUnitSummonEntityRoot.Active(summon, playerid, sUnitName);
            let summonroot = summon.ETRoot.As<BattleUnitSummonEntityRoot>();
            battleUnit.GetPlayer().AddDomainChild(summonroot);
            this.allSummon.push(summonroot.Id);
        }
    }

    public GetAllSummon() {
        let r: BattleUnitSummonEntityRoot[] = [];
        if (this.allSummon.length > 0) {
            let hCaster = this.GetDomain<BaseNpc_Plus>();
            let battleUnit = hCaster.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
            let player = battleUnit.GetPlayer();
            this.allSummon.forEach((b) => {
                let entity = player.GetDomainChild<BattleUnitSummonEntityRoot>(b);
                if (entity) {
                    r.push(entity);
                }
            })
        }
        return r;
    }

    public AddIllusion(sUnitName: string, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (!battleUnit) return;
        let illusion = modifier_illusion.CreateIllusion(sUnitName, hCaster, vLocation, fDuration, bFindClearSpace, iTeamNumber)
        if (illusion) {
            let playerid = battleUnit.Playerid;
            BattleUnitSummonEntityRoot.Active(illusion, playerid, sUnitName);
            let illusionroot = illusion.ETRoot.As<BattleUnitSummonEntityRoot>();
            battleUnit.GetPlayer().AddDomainChild(illusionroot);
            this.allIllusion.push(illusionroot.Id);
        }
    }

    public AddRuntimeBuilding(sUnitName: string, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (!battleUnit) return;
        let summon = modifier_summon.CreateSummon(sUnitName, hCaster, vLocation, fDuration, bFindClearSpace, iTeamNumber)
        if (summon) {
            let playerid = battleUnit.Playerid;
            BattleUnitSummonEntityRoot.Active(summon, playerid, sUnitName);
            let summonroot = summon.ETRoot.As<BattleUnitSummonEntityRoot>();
            battleUnit.GetPlayer().AddDomainChild(summonroot);
            this.allSummon.push(summonroot.Id);
        }
    }



    public GetAllBattleUnitAlive() {
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        let r: PlayerCreateBattleUnitEntityRoot[] = [battleUnit];
        let allunit = [].concat(this.allSummon, this.allIllusion, this.allBuildingRuntime);
        if (allunit.length > 0) {
            let player = battleUnit.GetPlayer();
            allunit.forEach((b) => {
                let entity = player.GetDomainChild<PlayerCreateBattleUnitEntityRoot>(b);
                if (entity && entity.ChessComp().isInBattleAlive()) {
                    r.push(entity);
                }
            });
        }
        return r;
    }

    public ClearRuntimeBattleUnit() {
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        let allunit = [].concat(this.allSummon, this.allIllusion, this.allBuildingRuntime);
        if (allunit.length > 0) {
            let player = battleUnit.GetPlayer();
            allunit.forEach((b) => {
                let entity = player.GetDomainChild<PlayerCreateBattleUnitEntityRoot>(b);
                if (entity) {
                    entity.Dispose();
                }
            });
        }
        this.allSummon = [];
        this.allIllusion = [];
        this.allBuildingRuntime = [];
    }
}