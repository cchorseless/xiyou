
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


    public GetAllBattleUnitAlive(team: DOTATeam_t) {
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
        let allsummon = domain.GetDomainChilds(BattleUnitSummonEntityRoot).filter((s) => {
            return s.GetDomain<IBaseNpc_Plus>().GetTeam() == team;
        });
        let allillon = domain.GetDomainChilds(BattleUnitIllusionEntityRoot).filter((s) => {
            return s.GetDomain<IBaseNpc_Plus>().GetTeam() == team;
        });
        r = r.concat(allsummon).concat(allillon).filter((b) => { return b.isAlive });
        return r;
    }


    public GetAllBattleUnitAliveNpc(team: DOTATeam_t) {
        let r = this.GetAllBattleUnitAlive(team).map((b) => {
            return b.GetDomain<IBaseNpc_Plus>();
        });
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
}

declare global {
    type IBattleUnitManagerComponent = BattleUnitManagerComponent;
}