import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";

export class modifier_combination_effect extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return true;
    }
    buff_fx: ParticleID;

    config() {
        return GJSONConfig.BuffEffectConfig.get(this.GetName());
    }

    getSpecialData(prop: string) {
        let conf = this.config();
        if (conf && conf.propinfo.has(prop)) {
            return conf.propinfo.get(prop);
        }
        return 0;
    }
    BeDestroy(): void {
        if (this.buff_fx) {
            ParticleManager.ClearParticle(this.buff_fx);
            this.buff_fx = null;
        }
    }

    getAllEnemy(): IBaseNpc_Plus[] {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let selfteam = parent.GetTeam();
            let enemyteam = selfteam == DOTATeam_t.DOTA_TEAM_BADGUYS ? DOTATeam_t.DOTA_TEAM_GOODGUYS : DOTATeam_t.DOTA_TEAM_BADGUYS;;
            let enemyunits = parent.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAlive(enemyteam, true);
            return enemyunits.map((unit) => { return unit.GetDomain<IBaseNpc_Plus>() });
        }
    }

}