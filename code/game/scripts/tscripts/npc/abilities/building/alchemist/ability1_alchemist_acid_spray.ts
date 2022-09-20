import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_acid_spray = {
    ID: "5365",
    AbilityBehavior: "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE",
    AbilityUnitDamageType: "DAMAGE_TYPE_PHYSICAL",
    SpellImmunityType: "SPELL_IMMUNITY_ENEMIES_NO",
    AbilityCastPoint: "0.2",
    AbilityCastRange: "900",
    AbilityCooldown: "22.0",
    AbilityManaCost: "130 140 150 160",
    AbilitySpecial: {
        "01": { var_type: "FIELD_INTEGER", radius: "475 525 575 625" },
        "02": { var_type: "FIELD_FLOAT", duration: "16" },
        "03": { var_type: "FIELD_INTEGER", damage: "20 25 30 35" },
        "04": { var_type: "FIELD_INTEGER", armor_reduction: "4 5 6 7", LinkedSpecialBonus: "special_bonus_unique_alchemist_5" },
        "05": { var_type: "FIELD_FLOAT", tick_rate: "1.0" },
    },
    AbilityCastAnimation: "ACT_DOTA_CAST_ABILITY_1",
};

@registerAbility()
export class ability1_alchemist_acid_spray extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_acid_spray";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_acid_spray = Data_alchemist_acid_spray;

    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius");
    }
    OnToggle() {
        let hCaster = this.GetCasterPlus();
        if (this.GetToggleState()) {
            //  hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1)
            let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_alchemist/alchemist_acid_spray_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, hCaster);
            //  ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_attack3", hCaster.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack3")));
            ParticleManager.SetParticleControl(iParticleID, 1, hCaster.GetAbsOrigin());
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(255, 255, 255));
            ParticleManager.ReleaseParticleIndex(iParticleID);

            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Alchemist.AcidSpray", hCaster));

            hCaster.AddNewModifier(hCaster, this, "modifier_alchemist_1", null);
        } else {
            hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_Alchemist.AcidSpray", hCaster));
            hCaster.RemoveModifierByName("modifier_alchemist_1");
        }
    }
    ProcsMagicStick() {
        return false;
    }
}

@registerModifier()
export class modifier_alchemist_1 extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsCustomAura() {
        return true;
    }
    GetAura() {
        return "modifier_alchemist_1_aura";
    }
    GetAuraRadius() {
        return this.radius;
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    public radius: number;
    public damage_interval: number;
    public iParticleID: ParticleID;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.radius = this.GetSpecialValueFor("radius");
        this.damage_interval = this.GetSpecialValueFor("damage_interval");
        if (IsServer()) {
            this.StartIntervalThink(this.damage_interval);
        } else {
            let hCaster = this.GetCasterPlus();

            let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_alchemist/alchemist_acid_spray.vpcf", ParticleAttachment_t.PATTACH_POINT, hCaster);
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, 1, 1));
            this.iParticleID = iParticleID;
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsClient()) {
            if (this.iParticleID != null) {
                ParticleManager.DestroyParticle(this.iParticleID, false);
            }
        }
    }
    OnIntervalThink() {
        let hAbility = this.GetAbilityPlus();
        let hCaster = this.GetCasterPlus();
        if (!(GameFunc.IsValid(hAbility) && GameFunc.IsValid(hCaster))) {
            this.Destroy();
            return;
        }

        hCaster.SpendMana(hAbility.GetManaCost(-1) * this.damage_interval, hAbility);
        // let fEnergy = hAbility.GetAddEnergy() * this.damage_interval;
        // hCaster.ModifyEnergy(fEnergy);
        // if (hCaster.GetMana() < hAbility.GetManaCost(-1) * this.damage_interval) {
        //     hAbility.ToggleAbility();
        // }
    }
}
@registerModifier()
export class modifier_alchemist_1_aura extends BaseModifier_Plus {
    IsHidden() {
        return true;
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    public armor_reduce: number;

    public damage_interval: number;
    public damage_inc: number;
    public max_inc: number;
    public time: number;

    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.damage_interval = this.GetSpecialValueFor("damage_interval");
        this.armor_reduce = this.GetSpecialValueFor("armor_reduce");
        this.damage_inc = this.GetSpecialValueFor("damage_inc") / 100;
        this.max_inc = this.GetSpecialValueFor("max_inc") / 100;
        if (IsServer()) {
            this.time = 0;
            this.StartIntervalThink(this.damage_interval);
        }
    }
    OnRefresh(params: ModifierTable) {
        this.damage_interval = this.GetSpecialValueFor("damage_interval");
        this.armor_reduce = this.GetSpecialValueFor("armor_reduce");
        this.damage_inc = this.GetSpecialValueFor("damage_inc") / 100;
        this.max_inc = this.GetSpecialValueFor("max_inc") / 100;
    }
    OnIntervalThink() {
        let hAbility = this.GetAbilityPlus();
        let hCaster = this.GetCasterPlus();
        if (!(GameFunc.IsValid(hAbility) && GameFunc.IsValid(hCaster))) {
            this.Destroy();
            return;
        }

        this.time = this.time + this.damage_interval;
        // let fDamage = this.GetSpecialValueFor("dps") * this.damage_interval * (1 + Clamp(this.damage_inc * this.time, 0, this.max_inc));
        // BattleHelper.GoApplyDamage({
        //     ability: hAbility,
        //     attacker: hCaster,
        //     victim: this.GetParentPlus(),
        //     damage: fDamage,
        //     damage_type: hAbility.GetAbilityDamageType(),
        // });
    }
}
