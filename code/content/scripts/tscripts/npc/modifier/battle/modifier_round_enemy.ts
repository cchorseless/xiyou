import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_round_enemy extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }


    public Init(params?: IModifierTable): void {
        let parent = this.GetParentPlus();
        if (IsClient()) {
            let info = NetTablesHelper.GetDotaEntityData(parent.GetEntityIndex(), "round_enemy") || {};
            this.atk = info.atk;
            this.hp = info.hp;
            this.phyarm = info.phyarm;
            this.magicarm = info.magicarm;

            return
        }
        let roundid = params.roundid;
        let onlyKey = params.onlyKey;
        if (parent && roundid && onlyKey) {

            let config = GJSONConfig.RoundBoardConfig.get(roundid)?.enemyinfo.find(v => { return v.id == onlyKey })
            if (config == null) {
                config = GJSONConfig.RoundBoardChallengeConfig.get(roundid)?.enemyinfo.find(v => { return v.id == onlyKey }) as any;
            }
            if (config == null) { return }
            config.atk && (this.atk = GPropertyCalculate.GetBaseAttackDamage(parent) * config.atk);
            config.hp && (this.hp = GPropertyCalculate.GetBaseMaxHealth(parent) * config.hp);
            config.phyarm && (this.phyarm = GPropertyCalculate.GetBasePhysicalArmor(parent) * config.phyarm);
            config.magicarm && (this.magicarm = GPropertyCalculate.GetBaseMagicalArmor(parent) * config.magicarm);
            NetTablesHelper.SetDotaEntityData(parent.GetEntityIndex(), {
                atk: this.atk,
                hp: this.hp,
                phyarm: this.phyarm,
                magicarm: this.magicarm,

            }, "round_enemy");
        }

    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    atk: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    hp: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    magicarm: number;


}
