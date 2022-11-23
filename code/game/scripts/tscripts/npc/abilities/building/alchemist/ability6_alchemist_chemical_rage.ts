import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_chemical_rage = {
    ID: "5369",
    AbilityBehavior: "DOTA_ABILITY_BEHAVIOR_NO_TARGET",
    AbilityType: "DOTA_ABILITY_TYPE_ULTIMATE",
    SpellDispellableType: "SPELL_DISPELLABLE_NO",
    FightRecapLevel: "2",
    AbilitySound: "Hero_Alchemist.ChemicalRage.Cast",
    HasScepterUpgrade: "1",
    AbilityDraftUltShardAbility: "alchemist_berserk_potion",
    AbilityCastPoint: "0.0",
    AbilityCastAnimation: "ACT_INVALID",
    AbilityCooldown: "55.0",
    AbilityManaCost: "50 100 150",
    AbilitySpecial: {
        "10": { var_type: "FIELD_INTEGER", scepter_spell_amp: "5", RequiresScepter: "1" },
        "01": { var_type: "FIELD_FLOAT", duration: "25.0" },
        "02": { var_type: "FIELD_FLOAT", transformation_time: "0.35" },
        "03": { var_type: "FIELD_FLOAT", base_attack_time: "1.2 1.1 1.0", LinkedSpecialBonus: "special_bonus_unique_alchemist_3" },
        "04": { var_type: "FIELD_INTEGER", bonus_health: "0" },
        "05": { var_type: "FIELD_INTEGER", bonus_health_regen: "50 75 100", LinkedSpecialBonus: "special_bonus_unique_alchemist_4" },
        "06": { var_type: "FIELD_FLOAT", bonus_mana_regen: "0" },
        "07": { var_type: "FIELD_INTEGER", bonus_movespeed: "40 50 60", LinkedSpecialBonus: "special_bonus_unique_alchemist_6" },
        "08": { var_type: "FIELD_FLOAT", scepter_gold_damage: "2", RequiresScepter: "1" },
        "09": { var_type: "FIELD_INTEGER", scepter_bonus_damage: "20", RequiresScepter: "1" },
    },
};

@registerAbility()
export class ability6_alchemist_chemical_rage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_chemical_rage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_chemical_rage = Data_alchemist_chemical_rage;


    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let duration = this.GetSpecialValueFor("duration");
        hCaster.StartGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_START);
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Alchemist.ChemicalRage.Cast", hCaster));
        hCaster.AddNewModifier(hCaster, this, "modifier_alchemist_3_buff", { duration: duration });
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus();

        if (!GameFunc.IsValid(hTarget) || hTarget.TriggerSpellAbsorb(this)) {
            return true;
        }

        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_Alchemist.UnstableConcoction.Stun", hCaster), hCaster);

        BattleHelper.GoApplyDamage({
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: this.GetSpecialValueFor("damage"),
            damage_type: this.GetAbilityDamageType(),
        });
        let stun_duration = this.GetSpecialValueFor("stun_duration");
        hTarget.AddNewModifier(hCaster, this, "modifier_stunned", { duration: stun_duration });

        return true;
    }
    OnUpgrade() {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
}
@registerModifier()
export class modifier_alchemist_3_buff extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    // GetStatusEffectName : "particles/status_fx/status_effect_chemical_rage.vpcf",
    // StatusEffectPriority : 10,
    // GetHeroEffectName : "particles/units/heroes/hero_alchemist/alchemist_chemical_rage_hero_effect.vpcf",
    // HeroEffectPriority: 10,
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    public base_attack_rate: number;
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    public mana_regen: number;
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    public spell_amplify: number;
    public interval: number;
    public stun_duration: number;
    public projectile_speed: number;
    Init(params: ModifierTable) {
        this.base_attack_rate = this.GetSpecialValueFor("base_attack_rate");
        this.mana_regen = this.GetSpecialValueFor("mana_regen");
        this.spell_amplify = this.GetSpecialValueFor("spell_amplify");
        this.interval = this.GetSpecialValueFor("interval");
        this.stun_duration = this.GetSpecialValueFor("stun_duration");
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
        if (IsServer() && params.IsOnCreated) {
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CONCOCTION);
            this.StartIntervalThink(this.interval);
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CONCOCTION);
        }
    }
    OnIntervalThink() {
        let hAbility = this.GetAbilityPlus();
        let hCaster = this.GetCasterPlus();
        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
            this.Destroy();
            return;
        }

        let hParent = this.GetParentPlus();
        let tTargets = FindUnitsInRadius(
            hCaster.GetTeamNumber(),
            hParent.GetAbsOrigin(),
            null,
            hParent.Script_GetAttackRange(),
            hAbility.GetAbilityTargetTeam(),
            hAbility.GetAbilityTargetType(),
            hAbility.GetAbilityTargetFlags(),
            FindOrder.FIND_ANY_ORDER,
            false
        );
        for (let hUnit of tTargets) {
            //  hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Alchemist.UnstableConcoction.Throw", hCaster))
            ProjectileManager.CreateTrackingProjectile({
                Ability: hAbility,
                //  Source : hParent,
                vSourceLoc: hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack3")),
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf", hCaster),
                Target: hUnit,
                iMoveSpeed: this.projectile_speed,
            });
            break;
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    public activity: string = "chemical_rage";

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    public attack_sound: string = "Hero_Alchemist.ChemicalRage.Attack";
}
