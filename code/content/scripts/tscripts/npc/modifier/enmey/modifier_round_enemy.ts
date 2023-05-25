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
    // CheckState() {
    //     let state = {
    //         [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
    //         [modifierstate.MODIFIER_STATE_DISARMED]: true,

    //     };
    //     return state
    // }

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
            config.atkpect != 0 && (this.atk = GPropertyCalculate.GetAttackDamage(parent) * config.atkpect * 0.01);
            config.hppect != 0 && (this.hp = GPropertyCalculate.GetBaseMaxHealth(parent) * config.hppect * 0.01);
            config.phyarmpect != 0 && (this.phyarm = GPropertyCalculate.GetPhysicalArmor(parent) * config.phyarmpect * 0.01);
            config.magicarmpect != 0 && (this.magicarm = GPropertyCalculate.GetMagicalArmor(parent) * config.magicarmpect * 0.01);
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

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    outdamagePect: number = 0;
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    // incomdamegePect: number = 50;
}
