
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 死亡狂暴
@registerAbility()
export class faker_courier_death_prize extends BaseAbility_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_faker_courier_death_prize"
    }

}


@registerModifier()
export class modifier_faker_courier_death_prize extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return true;
    }
    public IsPurgable(): boolean {
        return false;
    }
    hp_pect_min: number;
    atk_pect: number;
    atkspeed_pect: number;
    incom_pect: number;
    public Init(params?: IModifierTable): void {
        this.hp_pect_min = this.GetSpecialValueFor("hp_pect_min");
        this.atk_pect = this.GetSpecialValueFor("atk_pect");
        this.atkspeed_pect = this.GetSpecialValueFor("atkspeed_pect");
        this.incom_pect = this.GetSpecialValueFor("incom_pect");
    }
    buff_fx: ParticleID;
    isJoinState(): boolean {
        let hparent = this.GetParentPlus();
        let pect = hparent.GetHealthLosePect() + this.GetSpecialValueFor("hp_pect_min");
        let respath = "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_ground_eztzhok.vpcf";
        let r = pect >= 100;
        if (r && IsServer() && this.buff_fx == null) {
            this.buff_fx = ResHelper.CreateParticleEx(respath, ParticleAttachment_t.PATTACH_WORLDORIGIN, hparent);
            ParticleManager.SetParticleControl(this.buff_fx, 0, hparent.GetAbsOrigin() + Vector(0, 0, 600) as Vector)
            hparent.StepChangeModelScale(hparent.GetModelScale() + 0.1)
        }
        return r
    }

    public OnDestroy(): void {
        if (IsServer() && this.buff_fx !== null) {
            ParticleManager.ClearParticle(this.buff_fx);
        }
    }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_DAMAGE_PERCENTAGE)
    // CC_BASEATTACK_DAMAGE_PERCENTAGE() {
    //     if (this.isJoinState()) {
    //         return this.atk_pect
    //     }
    // }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_PERCENTAGE)
    CC_ATTACKSPEED_PERCENTAGE() {
        if (this.isJoinState()) {
            return this.atkspeed_pect
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_INCOMING_DAMAGE_PERCENTAGE() {
        if (this.isJoinState()) {
            return this.incom_pect
        }
    }
}
