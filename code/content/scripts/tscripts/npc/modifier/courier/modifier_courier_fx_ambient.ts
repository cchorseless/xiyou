import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";


export class modifier_courier_fx_base extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    RemoveOnDeath() {
        return false
    }
}

/**小鸡粑粑 */
@registerModifier()
export class modifier_courier_fx_ambient_1 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {
        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_cluckles/courier_cluckles_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(1, 0, 0))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**金鲲咬人箱 */
@registerModifier()
export class modifier_courier_fx_ambient_3 extends modifier_courier_fx_base {
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let respath = "particles/econ/courier/courier_donkey_ti7/courier_donkey_ti7_ambient.vpcf"
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN)
                    .set_resPath(respath)
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_omni_head", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 16, Vector(1, 0, 0))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}
/**骑驴法师 */
@registerModifier()
export class modifier_courier_fx_ambient_4 extends modifier_courier_fx_base {
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_cluckles/courier_cluckles_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(1, 0, 0))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金蝾小螈 */
@registerModifier()
export class modifier_courier_fx_ambient_5 extends modifier_courier_fx_base {
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
                    .set_resPath("particles/econ/courier/courier_axolotl_ambient/courier_axolotl_ambient_lvl4.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金飞小龙 */
@registerModifier()
export class modifier_courier_fx_ambient_6 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_wyvern_hatchling/courier_wyvern_hatchling_gold.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_wyvern_hatchling/courier_wyvern_hatchling_tail_gold.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_fx", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金独角小仙 */
@registerModifier()
export class modifier_courier_fx_ambient_7 extends modifier_courier_fx_base {
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_ti9/courier_ti9_lvl7_base.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            this.AddParticle(iParticleID, true, false, -1, false, false)

        }
    }
}

/**纯金黑曜石小鸟 */
@registerModifier()
export class modifier_courier_fx_ambient_8 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_devourling_gold/courier_devourling_gold_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金末日小子 */
@registerModifier()
export class modifier_courier_fx_ambient_9 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN)
                    .set_resPath("particles/econ/courier/courier_golden_doomling/courier_golden_doomling_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_l", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_r", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金珍小宝 */
@registerModifier()
export class modifier_courier_fx_ambient_10 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_flopjaw_gold/courier_flopjaw_ambient_gold.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金血小魔 */
@registerModifier()
export class modifier_courier_fx_ambient_11 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_seekling_gold/courier_seekling_gold_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金剧小毒 */
@registerModifier()
export class modifier_courier_fx_ambient_12 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_venoling_gold/courier_venoling_ambient_gold.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**天照小神 */
@registerModifier()
export class modifier_courier_fx_ambient_13 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_amaterasu/courier_amaterasu_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**腥红蝾小螈 */
@registerModifier()
export class modifier_courier_fx_ambient_14 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
                    .set_resPath("particles/econ/courier/courier_axolotl_ambient/courier_axolotl_ambient_lvl3.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**火焰飞小龙 */
@registerModifier()
export class modifier_courier_fx_ambient_15 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_wyvern_hatchling/courier_wyvern_hatchling_fire.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_wyvern_hatchling/courier_wyvern_hatchling_tail_fire.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_fx", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**寒冰飞小龙 */
@registerModifier()
export class modifier_courier_fx_ambient_16 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_wyvern_hatchling/courier_wyvern_hatchling_ice.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_wyvern_hatchling/courier_wyvern_hatchling_tail_ice.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_fx", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**灵犀弗拉尔 */
@registerModifier()
export class modifier_courier_fx_ambient_18 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_frull_ambient/courier_frull_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_pot", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_box", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**圣盾蟹小蜗 */
@registerModifier()
export class modifier_courier_fx_ambient_19 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_hermit_crab/hermit_crab_aegis_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_aegis", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 5, Vector(1, 0, 0))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**苦木独小苗 */
@registerModifier()
export class modifier_courier_fx_ambient_20 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_sappling/courier_sappling_ambient_lvl3.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_l", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_r", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_beard", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}
/**战龟飞船 */
@registerModifier()
export class modifier_courier_fx_ambient_21 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_hyeonmu_ambient/courier_hyeonmu_ambient_red_plus.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
                    .set_resPath("particles/econ/courier/courier_hyeonmu_ambient/courier_hyeonmu_eye_glow_green.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_l", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_r", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**白小虎*/
@registerModifier()
export class modifier_courier_fx_ambient_24 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_baekho/courier_baekho_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金死亡先知 */
@registerModifier()
export class modifier_courier_fx_ambient_30 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_krobeling_gold/courier_krobeling_gold_ambient.vpcf")
                    .set_owner(hParent)
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金赏小金 */
@registerModifier()
export class modifier_courier_fx_ambient_31 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {
        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_huntling_gold/courier_huntling_gold_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**时尚赏小金 */
@registerModifier()
export class modifier_courier_fx_ambient_32 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_gold_horn/courier_gold_horn_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_l", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_r", hParent.GetAbsOrigin(), true)

            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**皇家小狮鹫 */
@registerModifier()
export class modifier_courier_fx_ambient_33 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_jade_horn/courier_jade_horn_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_l", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_r", hParent.GetAbsOrigin(), true)

            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**纯金羊咩咩 */
@registerModifier()
export class modifier_courier_fx_ambient_34 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_red_horn/courier_red_horn_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_l", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_r", hParent.GetAbsOrigin(), true)

            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}
/**纯金虎小喵 */
@registerModifier()
export class modifier_courier_fx_ambient_37 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_ti10/courier_ti10_lvl7_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(1, 0, 0))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**灵动虎小喵 */
@registerModifier()
export class modifier_courier_fx_ambient_38 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_ti10/courier_ti10_lvl6_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_fx_ball", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}

/**虎小喵 */
@registerModifier()
export class modifier_courier_fx_ambient_39 extends modifier_courier_fx_base {

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_ti10/courier_ti10_lvl1_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}