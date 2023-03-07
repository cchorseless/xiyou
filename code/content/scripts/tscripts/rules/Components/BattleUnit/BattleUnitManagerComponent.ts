
import { ET } from "../../../shared/lib/Entity";
import { BattleUnitSummonEntityRoot } from "./BattleUnitSummonEntityRoot";

@GReloadable
export class BattleUnitManagerComponent extends ET.Component {
    allSummon: string[] = [];
    allIllusion: string[] = [];
    allBuildingRuntime: string[] = [];

    public AddSummon(sUnitName: string, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<IBattleUnitEntityRoot>();
        if (!battleUnit) return;
        let summon = hCaster.CreateSummon(sUnitName, vLocation, fDuration, bFindClearSpace, iTeamNumber)
        if (summon) {
            let playerid = battleUnit.BelongPlayerid;
            BattleUnitSummonEntityRoot.Active(summon, playerid, sUnitName);
            let summonroot = summon.ETRoot.As<BattleUnitSummonEntityRoot>();
            battleUnit.GetPlayer().AddDomainChild(summonroot);
            this.allSummon.push(summonroot.Id);
        }
    }

    public GetAllSummon() {
        let r: BattleUnitSummonEntityRoot[] = [];
        if (this.allSummon.length > 0) {
            let hCaster = this.GetDomain<IBaseNpc_Plus>();
            let battleUnit = hCaster.ETRoot.As<IBattleUnitEntityRoot>();
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

    public AddIllusion(unit: IBaseNpc_Plus, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        // let hCaster = this.GetDomain<IBaseNpc_Plus>();
        // let battleUnit = hCaster.ETRoot.As<IBattleUnitEntityRoot>();
        // if (!battleUnit) return;
        // let illusion = hCaster.CreateIllusion(unit,     vLocation, fDuration, bFindClearSpace, iTeamNumber)
        // if (illusion) {
        //     let playerid = battleUnit.BelongPlayerid;
        //     BattleUnitSummonEntityRoot.Active(illusion, playerid, sUnitName);
        //     let illusionroot = illusion.ETRoot.As<BattleUnitSummonEntityRoot>();
        //     battleUnit.GetPlayer().AddDomainChild(illusionroot);
        //     this.allIllusion.push(illusionroot.Id);
        // }
    }

    public AddRuntimeBuilding(sUnitName: string, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<IBattleUnitEntityRoot>();
        if (!battleUnit) return;
        let summon = hCaster.CreateSummon(sUnitName, vLocation, fDuration, bFindClearSpace, iTeamNumber)
        if (summon) {
            let playerid = battleUnit.BelongPlayerid;
            BattleUnitSummonEntityRoot.Active(summon, playerid, sUnitName);
            let summonroot = summon.ETRoot.As<BattleUnitSummonEntityRoot>();
            battleUnit.GetPlayer().AddDomainChild(summonroot);
            this.allSummon.push(summonroot.Id);
        }
    }



    public GetAllBattleUnitAlive() {
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<IBattleUnitEntityRoot>();
        let r: IBattleUnitEntityRoot[] = [];
        if (battleUnit && battleUnit.ChessComp().isInBattleAlive()) {
            r.push(battleUnit);
        }
        let allunit = [].concat(this.allSummon, this.allIllusion, this.allBuildingRuntime);
        if (allunit.length > 0) {
            let player = battleUnit.GetPlayer();
            allunit.forEach((b) => {
                let entity = player.GetDomainChild<IBattleUnitEntityRoot>(b);
                if (entity && entity.ChessComp().isInBattleAlive()) {
                    r.push(entity);
                }
            });
        }
        return r;
    }

    public ClearRuntimeBattleUnit() {
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        let battleUnit = hCaster.ETRoot.As<IBattleUnitEntityRoot>();
        let allunit = [].concat(this.allSummon, this.allIllusion, this.allBuildingRuntime);
        if (allunit.length > 0) {
            let player = battleUnit.GetPlayer();
            allunit.forEach((b) => {
                let entity = player.GetDomainChild<IBattleUnitEntityRoot>(b);
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