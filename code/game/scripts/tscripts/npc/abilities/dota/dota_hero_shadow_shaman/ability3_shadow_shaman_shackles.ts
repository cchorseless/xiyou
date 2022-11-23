
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";



/** dota原技能数据 */
export const Data_shadow_shaman_shackles = { "ID": "5080", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "HasShardUpgrade": "1", "AbilityCastRange": "400", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityChannelTime": "2.75 3.5 4.25 5", "AbilityCooldown": "16 14 12 10", "AbilityManaCost": "140 150 160 170", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "tick_interval": "0.1 0.1 0.1 0.1" }, "02": { "var_type": "FIELD_FLOAT", "total_damage": "60 160 260 360", "LinkedSpecialBonus": "special_bonus_unique_shadow_shaman_6" }, "03": { "var_type": "FIELD_FLOAT", "channel_time": "2.75 3.5 4.25 5", "LinkedSpecialBonus": "special_bonus_unique_shadow_shaman_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_shadow_shaman_shackles extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_shaman_shackles";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_shaman_shackles = Data_shadow_shaman_shackles;
    Init() {
        this.SetDefaultSpecialValue("hex_radius", 300);
        this.SetDefaultSpecialValue("hex_duration", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("hex_movespeed", 100);
        this.SetDefaultSpecialValue("totem_count", 2);
        this.OnInit();
    }

    Init_old() {
        this.SetDefaultSpecialValue("hex_radius", 300);
        this.SetDefaultSpecialValue("hex_duration", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("hex_movespeed", 100);
        this.SetDefaultSpecialValue("totem_count", 2);

    }



    tTotems: {
        ether_shock: Array<any>,
        shackles: Array<any>,
        ward: Array<any>,
        [k: string]: Array<any>
    };
    FireTotem(hTotem: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let hex_radius = this.GetSpecialValueFor("hex_radius")
        let hex_duration = this.GetSpecialValueFor("hex_duration")
        let totem_count = this.GetSpecialValueFor("totem_count") + hCaster.GetTalentValue("special_bonus_unique_shadow_shaman_custom_7")
        let iCount = 0
        let fTime = GameRules.GetGameTime()
        let sElderType = hTotem.GetUnitLabel()
        for (let sType in (this.tTotems)) {
            let tData = this.tTotems[sType]
            if (sType == hTotem.GetUnitLabel()) {
                this.tTotems[hTotem.GetUnitLabel()].push({
                    hHandle: hTotem,
                    fTime: fTime
                })
                //  召唤图腾时触发妖术
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTotem.GetAbsOrigin(), hex_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
                for (let hUnit of (tTargets)) {
                    let duration = hex_duration * hUnit.GetStatusResistanceFactor(hCaster)
                    if (hCaster.HasShard()) {
                        duration = hex_duration
                    }
                    modifier_shadow_shaman_3_hex.apply(hUnit, hCaster, this, { duration: duration })
                }
            } else {
                if (tData.length > 0) {
                    iCount = iCount + 1
                    table.sort(tData, (a, b) => {
                        return a.fTime < b.fTime
                    })
                    if (tData[0].fTime < fTime) {
                        fTime = tData[0].fTime
                        sElderType = sType
                    }
                }
            }
        }
        if (iCount >= totem_count) {
            // for i, tInfo in ipairs(shallowcopy(this.tTotems[sElderType])) do
            //     if (GameFunc.IsValid(tInfo.hHandle)) {
            //         tInfo.hHandle.ForceKill(false)
            //     }
        }
        this.tTotems[sElderType] = []
    }
    RemoveTotem(hTotem: BaseNpc_Plus) {
        let allinfo = this.tTotems[hTotem.GetUnitLabel()]
        for (let i = 0; i < allinfo.length; i++) {
            let tInfo = allinfo[i]
            if (tInfo.hHandle == hTotem) {
                table.remove(this.tTotems[hTotem.GetUnitLabel()], i)
                if (GameFunc.IsValid(hTotem)) {
                    hTotem.ForceKill(false)
                }
                break
            }
        }

    }
    OnInit() {
        this.tTotems = {
            ether_shock: [],
            shackles: [],
            ward: []
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shadow_shaman_3_hex extends BaseModifier_Plus {
    movespeed: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    IsHexDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("shadow_shaman_voodoo", this.GetCasterPlus())
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.movespeed = this.GetSpecialValueFor("hex_movespeed")
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shadowshaman/shadowshaman_voodoo.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            return iParticleID
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_HEXED]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    GetMoveSpeedOverride(params: ModifierTable) {
        return this.movespeed
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: ModifierTable) {
        return ResHelper.GetModelReplacement("models/props_gameplay/chicken.vmdl", this.GetCasterPlus())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PRESERVE_PARTICLES_ON_MODEL_CHANGE)
    g_PreserveParticlesOnModelChanged(params: any) {
        return 1
    }
}
