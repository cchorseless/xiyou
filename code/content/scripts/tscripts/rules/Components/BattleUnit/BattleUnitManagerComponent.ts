
import { ET } from "../../../shared/lib/Entity";
import { BuildingRuntimeEntityRoot } from "../Building/BuildingRuntimeEntityRoot";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { BattleUnitIllusionEntityRoot } from "./BattleUnitIllusionEntityRoot";
import { BattleUnitSummonEntityRoot } from "./BattleUnitSummonEntityRoot";

@GReloadable
export class BattleUnitManagerComponent extends ET.Component {

    public RegSummon(summon: IBaseNpc_Plus) {
        if (!IsServer()) { return };
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        if (summon) {
            BattleUnitSummonEntityRoot.Active(summon, this.BelongPlayerid, summon.GetUnitName());
            let summonroot = summon.ETRoot.As<BattleUnitSummonEntityRoot>();
            domain.AddDomainChild(summonroot);
        }
    }

    public RegIllusion(illusion: IBaseNpc_Plus) {
        if (!IsServer()) { return };
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        if (illusion) {
            BattleUnitIllusionEntityRoot.Active(illusion, this.BelongPlayerid, illusion.GetUnitName());
            let illusionroot = illusion.ETRoot.As<BattleUnitIllusionEntityRoot>();
            domain.AddDomainChild(illusionroot);
        }
    }


    public GetAllBattleUnitAlive(team: DOTATeam_t, bonlyChess = false) {
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        let r: IBattleUnitEntityRoot[] = [];
        if (team == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
            let allruntingbuilding = domain.GetDomainChilds(BuildingRuntimeEntityRoot);
            r = r.concat(allruntingbuilding);
        }
        else if (team == DOTATeam_t.DOTA_TEAM_BADGUYS) {
            let allruntingbuilding = domain.GetDomainChilds(EnemyUnitEntityRoot);
            r = r.concat(allruntingbuilding);
        }
        if (bonlyChess) {
            let allsummon = domain.GetDomainChilds(BattleUnitSummonEntityRoot).filter((s) => {
                return s.GetDomain<IBaseNpc_Plus>().GetTeam() == team;
            });
            let allillon = domain.GetDomainChilds(BattleUnitIllusionEntityRoot).filter((s) => {
                return s.GetDomain<IBaseNpc_Plus>().GetTeam() == team;
            });
            r = r.concat(allsummon).concat(allillon);
        }
        r = r.filter((b) => { return b.isAlive && b.GetDomain<IBaseNpc_Plus>().IsAttacker() });
        return r;
    }


    public GetAllBattleUnitAliveNpc(team: DOTATeam_t, fliter: (b: IBaseNpc_Plus) => boolean = null) {
        let r = this.GetAllBattleUnitAlive(team).map((b) => {
            return b.GetDomain<IBaseNpc_Plus>();
        });
        if (fliter) {
            r = r.filter(fliter);
        }
        return r;
    }

    public GetAllBuildingRuntimeEntityRoot() {
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        return domain.GetDomainChilds(BuildingRuntimeEntityRoot);
    }

    public GetAllEnemyUnitEntityRoot() {
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        return domain.GetDomainChilds(EnemyUnitEntityRoot);
    }


    public ClearSummonIllusion(team: DOTATeam_t) {
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        let allsummon = domain.GetDomainChilds(BattleUnitSummonEntityRoot).filter((s) => {
            return s.GetDomain<IBaseNpc_Plus>().GetTeam() == team;
        });
        let allillon = domain.GetDomainChilds(BattleUnitIllusionEntityRoot).filter((s) => {
            return s.GetDomain<IBaseNpc_Plus>().GetTeam() == team;
        });
        allsummon.forEach((s) => { s.Dispose() })
        allillon.forEach((s) => { s.Dispose() })
    }


    public ClearBuildingRuntime() {
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        let allRuntime = domain.GetDomainChilds(BuildingRuntimeEntityRoot);
        allRuntime.forEach((s) => { s.Dispose() })
    }
    public OnGame_End(iswin: boolean) {
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        if (!iswin) {
            this.GetAllBuildingRuntimeEntityRoot().forEach((s) => { s.Dispose() });
            this.GetAllEnemyUnitEntityRoot().forEach((s) => { s.Dispose() });
            domain.GetDomainChilds(BattleUnitSummonEntityRoot).forEach((s) => { s.Dispose() });
            domain.GetDomainChilds(BattleUnitIllusionEntityRoot).forEach((s) => { s.Dispose() });
        }
    }
}

declare global {
    type IBattleUnitManagerComponent = BattleUnitManagerComponent;
}