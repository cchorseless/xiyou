import { ResHelper } from "../../../helper/ResHelper";
import { ChessVector } from "../../../rules/Components/ChessControl/ChessVector";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { PropertyCalculate } from "../../propertystat/PropertyCalculate";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_chess_jump } from "../move/modifier_chess_jump";

export class modifier_sect_effect_base extends BaseModifier_Plus {
    IsPassive(): boolean {
        return true;
    }

    IsBuff() {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
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

// 加甲流
@registerModifier()
export class modifier_sect_phyarm_up_base_a extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm: number;
    Init(kv: any) {
        let parent = this.GetParentPlus();
        this.phyarm = this.getSpecialData("phyarm");
        // "particles/sect/sect_phyarm_up/sect_phyarm_up1.vpcf"
        // this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_warcry_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_phyarm_up/sect_phyarm_up1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        // ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_phyarm_up_base_b extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_PHYSICAL_ARMOR_BONUS() {
        return this.phyarm + this.phyarm_pect * PropertyCalculate.GetAttackDamage(this.GetParentPlus());
    }


    phyarm: number = 0;
    phyarm_pect: number = 0;
    damage_pect: number = 0;

    Init(kv: any) {
        this.phyarm_pect = this.getSpecialData("phyarm_pect") * 0.01;
        this.phyarm = this.getSpecialData("phyarm");
        this.damage_pect = this.getSpecialData("damage_pect") * 0.01;
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_CRIT, false, true)
    CC_ON_ATTACK_CRIT(event: ModifierAttackEvent) {
        let parent = this.GetParentPlus();
        let attacker = event.attacker;
        if (IsValid(attacker) && attacker.IsAlive() && event.damage > 0) {
            ApplyDamage({
                victim: attacker,
                damage: this.damage_pect * event.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                attacker: parent,
                ability: this.GetAbility()
            });
        }
    }

}

// 生命流
@registerModifier()
export class modifier_sect_health_base_a extends modifier_sect_effect_base {

    Init() {
        let parent = this.GetParentPlus();
        this.hp_pect = this.getSpecialData("hp_pect");
        this.buff_fx = ResHelper.CreateParticleEx("particles/generic/generic_model_big.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddTimer(2, () => {
            ParticleManager.ClearParticle(this.buff_fx);
        })
        if (IsServer()) {
            parent.StepChangeModelScale(parent.GetModelScale() * 1.1);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENTAGE)
    hp_pect: number = 0;


}
@registerModifier()
export class modifier_sect_health_base_b extends modifier_sect_health_base_a {
    hp_regen_pect: number = 0;
    Init() {
        this.hp_pect = this.getSpecialData("hp_pect");
        this.hp_regen_pect = this.getSpecialData("hp_regen_pect") * 0.01;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT() {
        let parent = this.GetParentPlus();
        return this.hp_regen_pect * (parent.GetMaxHealth() - parent.GetHealth());
    }
}

// 护盾流
@registerModifier()
export class modifier_sect_shield_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let block_value = this.getSpecialData("block_value");
        let t = parent.TempData().sect_shield || { block_value: 0 };
        t.block_value += block_value;
        parent.TempData().sect_shield = t;
        if (IsServer()) {
            this.SetStackCount(t.block_value)
        }
    }

}
@registerModifier()
export class modifier_sect_shield_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let block_value = this.getSpecialData("block_value");
        let t = parent.TempData().sect_shield || { block_value: 0 };
        t.block_value += block_value;
        parent.TempData().sect_shield = t;
        if (IsServer()) {
            let buff = modifier_sect_shield_base_a.applyOnly(parent, parent)
            buff.SetStackCount(t.block_value)
        }
    }
}

// 战意流
@registerModifier()
export class modifier_sect_warpath_base_a extends modifier_sect_effect_base {
    phyarm: number = 0;
    hp_regen: number = 0;
    stack_max: number = 0;
    duration: number = 0;
    caster: IBaseNpc_Plus;
    ability: IBaseAbility_Plus;
    Init() {
        this.caster = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        this.phyarm = this.getSpecialData("phyarm");
        this.hp_regen = this.getSpecialData("hp_regen");
        this.stack_max = this.getSpecialData("stack_max");
        this.duration = this.getSpecialData("duration");
        if (IsServer()) {
            this.StartIntervalThink(0.1);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT() {
        return this.hp_regen * this.GetStackCount();
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_PHYSICAL_ARMOR_BONUS() {
        return this.phyarm * this.GetStackCount();
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            let now = GameRules.GetGameTime();
            let stackList = this.stackList;
            let duration = this.duration;
            let stackCount = this.GetStackCount();
            let count = 0;
            for (let i = stackList.length - 1; i >= 0; i--) {
                if (now - stackList[i] > duration) {
                    stackList.splice(i, 1);
                } else {
                    count++;
                }
            }
            if (count > stackCount) {
                this.SetStackCount(count);
            }
        }
    }

    stackList: number[] = [];


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED, false, true)
    CC_ON_ATTACK_LANDED(keys: ModifierAttackEvent) {
        if (this.ability && !this.caster.PassivesDisabled() &&
            (keys.target == this.GetParentPlus() && !keys.attacker.IsBuilding() && !keys.attacker.IsOther() && keys.attacker.GetTeamNumber() != keys.target.GetTeamNumber())) {
            if (this.GetStackCount() < this.stack_max) {
                this.SetStackCount(this.GetStackCount() + 1);
            }
            this.stackList.push(GameRules.GetGameTime());
        }

    }

}

@registerModifier()
export class modifier_sect_warpath_base_b extends modifier_sect_effect_base {

    atk_time: number = 0;
    damage: number = 0;
    duration: number = 0;
    caster: IBaseNpc_Plus;
    ability: IBaseAbility_Plus;
    Init() {
        this.caster = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        this.atk_time = this.getSpecialData("atk_time");
        this.damage = this.getSpecialData("damage");
        this.duration = this.getSpecialData("duration");
        if (IsServer()) {
            modifier_sect_warpath_base_a.applyOnly(this.caster, this.caster);
        }
    }

    hadatk_time = 0;
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED, false, true)
    CC_ON_ATTACK_LANDED(keys: ModifierAttackEvent) {
        if (this.ability && !this.caster.PassivesDisabled() &&
            (keys.target == this.GetParentPlus() && !keys.attacker.IsBuilding() && !keys.attacker.IsOther() && keys.attacker.GetTeamNumber() != keys.target.GetTeamNumber())) {
            this.hadatk_time++;
            if (this.hadatk_time >= this.atk_time) {
                this.WhirlingDeath();
                this.hadatk_time = 0;
            }

        }

    }

    WhirlingDeath() {
        let ability = this.GetAbilityPlus();
        this.GetCasterPlus().EmitSound("Hero_Shredder.WhirlingDeath.Cast");
        let whirling_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_whirling_death.vpcf", ParticleAttachment_t.PATTACH_CENTER_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(whirling_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_CENTER_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(whirling_particle);
        let enemys = FindUnitsInRadius(
            this.GetCasterPlus().GetTeamNumber(),
            this.GetCasterPlus().GetAbsOrigin(),
            undefined, 500,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        const enemycount = enemys.length;
        const phyarm = PropertyCalculate.GetPhysicalArmor(this.GetCasterPlus());
        for (const enemy of enemys) {
            if (enemy.IsRealUnit()) {
                let damage = this.damage * enemycount * phyarm;
                if (enemy.IsSummoned() || enemy.IsIllusion()) {
                    damage = damage * 2;
                }
                ApplyDamage({
                    victim: enemy,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: ability
                });
            }
        }
    }
}

// 闪避流
@registerModifier()
export class modifier_sect_miss_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_mirana/mirana_moonlight_owner.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.miss_pect = this.getSpecialData("miss_pect");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    miss_pect: number;
}
@registerModifier()
export class modifier_sect_miss_base_b extends modifier_sect_miss_base_a {
    duration: number = 0;
    Init() {
        this.miss_pect = this.getSpecialData("miss_pect");
        this.duration = this.getSpecialData("duration");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL, false, true)
    CC_ON_ATTACK_FAIL(keys: ModifierAttackEvent) {
        let parent = this.GetParentPlus();
        if (IsValid(parent) && keys.fail_type == attackfail.DOTA_ATTACK_RECORD_FAIL_SOURCE_MISS) {
            parent.CreateIllusion(parent, { duration: this.duration })
        }

    }

}


// modifier_sect_poision_base_a
// modifier_sect_poision_base_b

// 石化流
@registerModifier()
export class modifier_sect_shihua_base_a extends modifier_sect_effect_base {

    chance_pect: number;
    duration: number;
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/courier/courier_trail_earth/courier_trail_earth.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.chance_pect = this.getSpecialData("chance_pect");
        this.duration = this.getSpecialData("duration");
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_ON_ATTACKED(keys: ModifierAttackEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let attacker = keys.attacker;
        if (keys.target == parent) {
            if (GFuncRandom.PRD(this.chance_pect, this)) {
                if (IsValid(attacker) && attacker.IsAlive()) {
                    modifier_sect_shihua_stoned.apply(attacker, parent, null, {
                        duration: this.duration
                    })
                }
            }
        }
    }

}
@registerModifier()
export class modifier_sect_shihua_base_b extends modifier_sect_shihua_base_a {
    Init() {
        let parent = this.GetParentPlus();
        modifier_sect_shihua_base_a.applyOnly(parent, parent);
        let damage_pect = this.getSpecialData("damage_pect");
        this.SetStackCount(damage_pect);
    }

}

@registerModifier()
export class modifier_sect_shihua_stoned extends BaseModifier_Plus {

    incomedamage = 0;
    Init(params?: IModifierTable): void {
        let caster = this.GetCasterPlus();
        if (caster) {
            this.incomedamage = caster.findBuffStack("modifier_sect_shihua_base_b");
        }

    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_INCOMING_DAMAGE_PERCENTAGE() {
        return this.incomedamage;
    }

    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_medusa/medusa_stone_gaze_debuff_stoned.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_medusa_stone_gaze.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }

}

// 治疗流
@registerModifier()
export class modifier_sect_treatment_base_a extends modifier_sect_effect_base {

    heal_pect = 0;
    atk_time = 0;

    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/items/huskar/huskar_ti8/huskar_ti8_shoulder_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.heal_pect = this.getSpecialData("heal_pect");
        this.atk_time = this.getSpecialData("atk_time");

    }
    had_atk_time = 0;
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_ON_ATTACK_LANDED(keys: ModifierAttackEvent) {
        if (!IsServer()) { return }
        this.had_atk_time++;
        if (this.had_atk_time >= this.atk_time) {
            this.had_atk_time = 0;
            let parent = this.GetParentPlus();
            let allunits = parent.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(parent.GetTeam());
            allunits.sort((a, b) => { return a.GetHealth() - b.GetHealth() });
            this.Purification(allunits[0]);
        }
    }

    PurificationAll() {
        let parent = this.GetParentPlus();
        let allunits = parent.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(parent.GetTeam());
        for (const unit of allunits) {
            this.Purification(unit);
        }
    }
    Purification(target: IBaseNpc_Plus) {
        if (!IsValid(target)) { return }
        let parent = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        let sound_cast = "Hero_Omniknight.Purification";
        EmitSoundOn(sound_cast, parent);
        let particle_cast = "particles/units/heroes/hero_omniknight/omniknight_purification_cast.vpcf";
        let particle_aoe = "particles/units/heroes/hero_omniknight/omniknight_purification.vpcf";
        let particle_hit = "particles/units/heroes/hero_omniknight/omniknight_purification_hit.vpcf";
        let heal_amount = parent.GetMaxHealth() * this.heal_pect * 0.01;
        let radius = 200;
        let particle_cast_fx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(particle_cast_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_cast_fx, 1, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_cast_fx);
        let particle_aoe_fx = ResHelper.CreateParticleEx(particle_aoe, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(particle_aoe_fx, 0, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_aoe_fx, 1, Vector(radius, 1, 1));
        ParticleManager.ReleaseParticleIndex(particle_aoe_fx);
        target.ApplyHeal(heal_amount, ability);
    }

}
@registerModifier()
export class modifier_sect_treatment_base_b extends modifier_sect_effect_base {
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_ON_DEATH(keys: ModifierAttackEvent) {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let buff = parent.findBuff<modifier_sect_treatment_base_a>("modifier_sect_treatment_base_a");
            if (buff) {
                buff.PurificationAll();
            }
        }
    }
}

// 机械流
@registerModifier()
export class modifier_sect_tech_base_a extends modifier_sect_effect_base {
}

@registerModifier()
export class modifier_sect_tech_base_b extends modifier_sect_effect_base {
}

// 冰盾流
@registerModifier()
export class modifier_sect_iceshield_base_a extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    damage_pect = 0;

    Init(p_0: any,): void {
        let parent = this.GetParentPlus();
        let particle_frost_armor = "particles/units/heroes/hero_lich/lich_frost_armor.vpcf";
        this.buff_fx = ResHelper.CreateParticleEx(particle_frost_armor, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        ParticleManager.SetParticleControl(this.buff_fx, 0, parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.buff_fx, 1, Vector(1, 1, 1));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.damage_pect = this.getSpecialData("damage_pect");
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_armor.vpcf";
    }
}
@registerModifier()
export class modifier_sect_iceshield_base_b extends modifier_sect_effect_base {
    damage = 0;
    Init(p_0: any,): void {
        this.damage = this.getSpecialData("damage");
        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        let parent = this.GetParentPlus();
        if (!IsValid(parent)) {
            this.StartIntervalThink(-1);
            return;
        }
        const enemies = FindUnitsInRadius(parent.GetTeamNumber(), parent.GetAbsOrigin(), undefined, 500, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const enemy of (enemies)) {
            if (enemy.IsRealUnit()) {
                ApplyDamage({
                    victim: enemy,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: parent,
                    ability: this.GetAbility()
                })
            }
        }
    }
}




modifier_sect_jianren_base_a
modifier_sect_jianren_base_b


modifier_sect_lianjie_base_a
modifier_sect_lianjie_base_b

// 物暴流
@registerModifier()
export class modifier_sect_phycrit_base_a extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE)
    crit_chance: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    crit_damage: number;

    GetEffectName(): string {
        return "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_eztzhok.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_bloodrage.vpcf";
    }
    Init() {
        let parent = this.GetParentPlus();
        // "particles/generic_gameplay/rune_doubledamage_owner.vpcf"
        // "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_ground_eztzhok.vpcf"
        // "particles/econ/events/fall_2022/bottle/bottle_fall2022.vpcf"
        // "particles/econ/events/fall_2021/bottle_fall_2021.vpcf"
        // this.buff_fx = ResHelper.CreateParticleEx("particles/econ/items/bloodseeker/2022_taunt/bloodseeker_taunt_sparks_glow.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.crit_chance = this.getSpecialData("crit_chance")
        this.crit_damage = this.getSpecialData("crit_damage")
        if (IsServer()) {
            this.blinkChessX()
        }
    }
    blinkChessX() {
        let domain = this.GetParentPlus();
        let playerid = domain.GetPlayerID();
        let randomX = RandomFloat(2, 5);
        let randomY = RandomFloat(8, 10);
        if (randomY > 9) {
            if (randomX > 3 && randomX < 4) {
                randomX -= 1
            }
            else if (randomX > 4 && randomX < 5) {
                randomX += 1
            }
        }
        let pos = new ChessVector(randomX, randomY, playerid);
        let v = GChessControlSystem.GetInstance().GetBoardGirdVector3(pos);
        domain.Stop();
        domain.SetForwardVector(((v - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(v);
        modifier_chess_jump.applyOnly(domain, domain, null, {
            vx: v.x,
            vy: v.y,
        });
    }
    // @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target as IBaseNpc_Plus;
            let attacker = keys.attacker;
            if (attacker == this.GetParentPlus() && RollPercentage(this.crit_chance)) {
                // let blood_pfx = ResHelper.CreateParticleEx("particles/hero/phantom_assassin/screen_blood_splatter.vpcf", ParticleAttachment_t.PATTACH_EYES_FOLLOW, target, attacker);
                // ParticleManager.ReleaseParticleIndex(blood_pfx);
                // target.EmitSound("Hero_PhantomAssassin.CoupDeGrace");
                // this.GetCasterPlus().EmitSound("Imba.PhantomAssassinFatality");
                // let coup_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, attacker);
                // ParticleManager.SetParticleControlEnt(coup_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                // ParticleManager.SetParticleControl(coup_pfx, 1, target.GetAbsOrigin());
                // ParticleManager.SetParticleControlOrientation(coup_pfx, 1, this.GetParentPlus().GetForwardVector() * (-1) as Vector, this.GetParentPlus().GetRightVector(), this.GetParentPlus().GetUpVector());
                // ParticleManager.ReleaseParticleIndex(coup_pfx);
                let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControlEnt(nFXIndex, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetOrigin(), true);
                ParticleManager.SetParticleControl(nFXIndex, 1, target.GetOrigin());
                ParticleManager.SetParticleControlForward(nFXIndex, 1, -this.GetCasterPlus().GetForwardVector() as Vector);
                ParticleManager.SetParticleControlEnt(nFXIndex, 10, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, target.GetOrigin(), true);
                ParticleManager.ReleaseParticleIndex(nFXIndex);
                EmitSoundOn("Hero_PhantomAssassin.Spatter", target);
                let damage = keys.damage * this.crit_damage / 100;
                SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, target, damage, null)
                ApplyDamage({
                    victim: target,
                    attacker: this.GetParentPlus(),
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    ability: undefined,
                });

            }
        }
    }
}
@registerModifier()
export class modifier_sect_phycrit_base_b extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE)
    crit_chance: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    crit_damage: number;
    Init() {
        let parent = this.GetParentPlus();
        this.crit_chance = this.getSpecialData("crit_chance")
        this.crit_damage = this.getSpecialData("crit_damage")
        this.atk_speed_add = this.getSpecialData("atk_speed_add")
        this.duration = this.getSpecialData("duration")
        this.stack_max = this.getSpecialData("stack_max")
        this.stack_table = [];
        if (IsServer()) {
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        this.stack_table = this.stack_table.filter(info => {
            return info.apply_game_time && GameRules.GetDOTATime(true, true) - info.apply_game_time <= this.duration;
        });
        let length = this.stack_table.length;
        if (length * this.atk_speed_add != this.GetStackCount()) {
            this.SetStackCount(length * this.atk_speed_add);
        }
    }

    atk_speed_add: number;
    duration: number;
    stack_max: number;
    stack_table: { apply_game_time: number }[];
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_CRIT)
    CC_ON_ATTACK_CRIT(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker == this.GetParentPlus()) {
                this.stack_table.push({ apply_game_time: GameRules.GetDOTATime(true, true) });
                if (this.stack_table.length > this.stack_max) {
                    this.stack_table.shift();
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT() {
        return this.GetStackCount()
    }
}

// 野兽流
@registerModifier()
export class modifier_sect_beast_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_warpath/sect_warpath1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let atk_bonus_pect = this.getSpecialData("atk_bonus_pect");
        let t = parent.TempData().sect_beast || { atk_bonus_pect: 0 };
        t.atk_bonus_pect += atk_bonus_pect;
        parent.TempData().sect_beast = t;
        EmitSoundOn("hero_bloodseeker.bloodRage", parent);
        modifier_sect_beast_atkadd.apply(parent, parent)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let summon = e.unit;
        if (IsValid(summon) && summon.GetOwnerPlus() == parent) {
            modifier_sect_beast_atkadd.apply(summon, parent)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_ILLUSION)
    CC_ON_SPAWN_ILLUSION(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let illusion = e.unit;
        if (IsValid(illusion) && illusion.GetOwnerPlus() == parent) {
            modifier_sect_beast_atkadd.apply(illusion, parent)
        }
    }
}
@registerModifier()
export class modifier_sect_beast_base_b extends modifier_sect_effect_base {
    stack_max = 0;
    duration = 0;
    Init() {
        let parent = this.GetParentPlus();
        let atk_bonus_pect = this.getSpecialData("atk_bonus_pect");
        let damage_pect = this.getSpecialData("damage_pect");
        let t = parent.TempData().sect_beast || { atk_bonus_pect: 0, damage_pect: 0 };
        t.atk_bonus_pect += atk_bonus_pect;
        t.damage_pect += damage_pect;
        parent.TempData().sect_beast = t;
        this.stack_max = this.getSpecialData("stack_max");
        this.duration = this.getSpecialData("duration");
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_ON_ATTACK_LANDED(keys: ModifierAttackEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let attacker = keys.attacker;
        if (attacker == parent && keys.target.IsAlive()) {
            modifier_sect_beast_easyhurt.apply(keys.target, parent, null, {
                duration: this.duration,
                max_stack: this.stack_max
            })
        }
    }
}
@registerModifier()
export class modifier_sect_beast_atkadd extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    CC_ATTACK_DAMAGE_PERCENTAGE() {
        if (this.GetCasterPlus()) {
            let t = this.GetCasterPlus().TempData().sect_beast || { atk_bonus_pect: 0 };
            return t.atk_bonus_pect;
        }
    }
}
@registerModifier()
export class modifier_sect_beast_easyhurt extends BaseModifier_Plus {
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            if (params.max_stack > this.GetStackCount()) {
                this.IncrementStackCount(1);
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_INCOMING_DAMAGE_PERCENTAGE() {
        if (this.GetCasterPlus()) {
            let t = this.GetCasterPlus().TempData().sect_beast || { damage_pect: 0 };
            return t.damage_pect * this.GetStackCount();
        }
    }
}


modifier_sect_ghost_base_a
modifier_sect_ghost_base_b


// 分裂流
@registerModifier()
export class modifier_sect_cleave_base_a extends modifier_sect_effect_base {
    Init() {
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_medusa/medusa_bow_split_shot.vpcf",
            resNpc: this.GetParentPlus(),
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: this.GetParentPlus()
        });
        ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_top", this.GetParentPlus().GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_bottom", this.GetParentPlus().GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_mid", this.GetParentPlus().GetAbsOrigin(), true)
        this.AddParticle(iParticleID, false, false, -1, false, false)
        let cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        let cleave_count = this.getSpecialData("cleave_count");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
        t.cleave_damage_pct += cleave_damage_pct;
        t.cleave_count += cleave_count;
        parent.TempData().sect_cleave = t;

    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && keys.target && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.no_attack_cooldown && !this.GetParentPlus().PassivesDisabled() && this.GetAbilityPlus().IsTrained()) {
            let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().GetAttackRangePlus(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false);
            let target_number = 0;
            let t = this.GetParentPlus().TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
            for (const enemy of (enemies)) {
                if (enemy != keys.target) {
                    this.split_shot_target = true;
                    this.GetParentPlus().AttackOnce(enemy, false, true, true, true, true, false, false);
                    this.split_shot_target = false;
                    target_number = target_number + 1;
                    if (target_number >= t.cleave_count) {
                        return;
                    }
                }
            }
        }
    }
    split_shot_target: boolean;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (!IsServer()) {
            return;
        }
        if (this.split_shot_target) {
            let t = this.GetParentPlus().TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
            return t.cleave_damage_pct - 100;
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "split_shot";
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.damage_category == 1 && keys.damage_type == 1) {
            let rpath = "particles/econ/items/antimage/antimage_weapon_basher_ti5/am_manaburn_basher_ti_5.vpcf";
            let manaburn_particle = ResHelper.CreateParticleEx(rpath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.unit);
            ParticleManager.ReleaseParticleIndex(manaburn_particle);
        }
    }
}
@registerModifier()
export class modifier_sect_cleave_base_b extends modifier_sect_effect_base {
    knock_out_pct = 0;
    Init() {
        let cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        let cleave_count = this.getSpecialData("cleave_count");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
        t.cleave_damage_pct += cleave_damage_pct;
        t.cleave_count += cleave_count;
        parent.TempData().sect_cleave = t;
        this.knock_out_pct = this.getSpecialData("knock_out_pct");
        this.atk_range = this.getSpecialData("atk_range");
    }
    headshot_records: { [key: string]: boolean } = {};
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    atk_range: number = 0;

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (!this.GetParentPlus().IsIllusion() && keys.target && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (GFuncRandom.PRD(this.knock_out_pct, this)) {
                this.headshot_records[keys.record + ""] = true;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(keys: ModifierAttackEvent): void {
        if (this.headshot_records[keys.record + ""]) {
            delete this.headshot_records[keys.record + ""];
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.headshot_records[keys.record + ""]) {
            let pos = this.GetParentPlus().GetAbsOrigin();
            let offset = keys.target.GetAbsOrigin() - pos as Vector;
            let buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_archer/sect_archer3.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, keys.target);
            // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
            ParticleManager.ReleaseParticleIndex(buff_fx);
            EmitSoundOn("Damage_Projectile.Player", keys.target)
            keys.target.ApplyKnockBack(this.GetAbilityPlus(), this.GetCasterPlus(), {
                duration: 0.3,
                distance: 100,
                IsStun: true,
                direction_x: offset.x,
                direction_y: offset.y,
            })
        }
    }
}

modifier_sect_demon_base_a
modifier_sect_demon_base_b

modifier_sect_assassinate_base_a
modifier_sect_assassinate_base_b

// 召唤流
@registerModifier()
export class modifier_sect_summon_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        parent.TempData().sect_summon = t;

    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let summon = e.unit;
        if (IsValid(summon)) {
            modifier_sect_summon_buff_active.apply(summon, parent)
        }
    }

}
@registerModifier()
export class modifier_sect_summon_base_b extends modifier_sect_effect_base {
    prob = 0;
    Init() {
        let parent = this.GetParentPlus();
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        this.prob = this.getSpecialData("prob")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        parent.TempData().sect_summon = t;
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let summon = e.unit;
        if (IsValid(summon) && !summon.TempData().is_spe_summon && GFuncRandom.PRD(this.prob, this)) {
            let duration = summon.findBuff("modifier_generic_summon").GetDuration();
            let new_summon = parent.CreateSummon(summon.GetUnitName(), parent.GetAbsOrigin(), duration);
            new_summon.TempData().is_spe_summon = true;
        }
    }
}
@registerModifier()
export class modifier_sect_summon_buff_active extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    summon_atk_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENTAGE)
    summon_hp_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_PERCENTAGE)
    summon_atkspeed_pect: number;

    buff_fx: ParticleID
    Init() {
        let parent = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_warpath/sect_warpath1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let t = caster.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        this.summon_atk_pect = t.summon_atk_pect;
        this.summon_hp_pect = t.summon_hp_pect;
        this.summon_atkspeed_pect = t.summon_atkspeed_pect;
    }

    public BeDestroy(): void {
        if (this.buff_fx) {
            ParticleManager.ClearParticle(this.buff_fx, true)
        }
    }
}

// 法师流
@registerModifier()
export class modifier_sect_magic_base_a extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE)
    spell_damage_pect = 0;
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
    }

}
@registerModifier()
export class modifier_sect_magic_base_b extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE)
    spell_damage_pect = 0;
    duration = 0;
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
        this.duration = this.getSpecialData("duration");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_ON_TAKEDAMAGE(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        if (!IsValid(e.inflictor) || e.damage_type != DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) { return }
        let unit = e.unit as IBaseNpc_Plus;
        if (IsValid(unit) && unit.IsRealUnit() && unit.IsAlive()) {
            unit.ApplyFreeze(this.GetAbilityPlus(), this.GetParentPlus(), this.duration)
        }
    }
}

modifier_sect_flame_base_a
modifier_sect_flame_base_b

modifier_sect_transform_base_a
modifier_sect_transform_base_b


// 秒杀流
@registerModifier()
export class modifier_sect_seckill_base_a extends modifier_sect_effect_base {
    hp_pect: number = 0;
    prop: number = 0;
    Init(kv: any) {
        let parent = this.GetParentPlus();
        this.hp_pect = this.getSpecialData("hp_pect");
        this.prop = this.getSpecialData("prop");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_ON_TAKEDAMAGE(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let unit = e.unit as IBaseNpc_Plus;
        if (IsValid(unit) && unit.IsRealUnit() && unit.IsAlive() && unit.GetHealthLosePect() + this.hp_pect >= 100 && GFuncRandom.PRD(this.prop, this)) {
            unit.Kill(this.GetAbilityPlus(), this.GetParentPlus())
        }
    }

}
@registerModifier()
export class modifier_sect_seckill_base_b extends modifier_sect_effect_base {
    hp_pect: number = 0;
    prop: number = 0;
    Init(kv: any) {
        let parent = this.GetParentPlus();
        this.hp_pect = this.getSpecialData("hp_pect");
        this.prop = this.getSpecialData("prop");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_ON_TAKEDAMAGE(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        if (e.inflictor && e.inflictor == this.GetAbilityPlus() || e.damage_flags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) { return }
        let unit = e.unit as IBaseNpc_Plus;
        if (IsValid(unit) && unit.IsRealUnit() && unit.IsAlive() && GFuncRandom.PRD(this.prop, this)) {
            ApplyDamage({
                victim: unit,
                damage: unit.GetHealth() * this.hp_pect * 0.01,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS,
                attacker: this.GetParentPlus(),
                ability: this.GetAbilityPlus()
            })
        }
    }
}


modifier_sect_cannibalism_base_a
modifier_sect_cannibalism_base_b
modifier_sect_fusion_base_a
modifier_sect_fusion_base_b
modifier_sect_lucky_base_a
modifier_sect_lucky_base_b
modifier_sect_reduceinjury_base_a
modifier_sect_reduceinjury_base_b

// 冷却流
@registerModifier()
export class modifier_sect_cd_down_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_debuff_b.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.cooldown_pect = this.getSpecialData("cooldown_pect");
    }
    cooldown_pect = 0;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_COOLDOWN_PERCENTAGE(): number {
        return this.cooldown_pect
    }

}
@registerModifier()
export class modifier_sect_cd_down_base_b extends modifier_sect_effect_base {
    Init() {
        this.cooldown_pect = this.getSpecialData("cooldown_pect");
        this.prop = this.getSpecialData("prop");
    }
    cooldown_pect = 0;
    prop = 0;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_COOLDOWN_PERCENTAGE(): number {
        return this.cooldown_pect
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_START)
    CC_ON_ABILITY_START(e: ModifierAbilityEvent) {
        if (!IsServer()) { return }
        if (IsValid(e.ability) && GFuncRandom.PRD(this.prop, this)) {
            e.ability.EndCooldown();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_ON_ABILITY_EXECUTED(e: ModifierAbilityEvent) {
        if (!IsServer()) { return }
        if (IsValid(e.ability) && GFuncRandom.PRD(this.prop, this)) {
            e.ability.EndCooldown();
        }
    }
}

modifier_sect_copy_base_a
modifier_sect_copy_base_b
modifier_sect_guard_base_a
modifier_sect_guard_base_b




// 大招流
@registerModifier()
export class modifier_sect_dazhao_base_a extends modifier_sect_effect_base {
    Init() {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            this.buff_fx = ResHelper.CreateParticleEx("particles/hero/lion/aura_manadrain.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
            ParticleManager.SetParticleControl(this.buff_fx, 0, parent.GetAbsOrigin());
            let maxmana = parent.GetMaxMana();
            parent.SetMana(maxmana);
        }
    }
}
@registerModifier()
export class modifier_sect_dazhao_base_b extends modifier_sect_effect_base {
    Init() {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let maxmana = parent.GetMaxMana();
            parent.SetMana(maxmana);
        }
    }
}

// 钓鱼流
@registerModifier()
export class modifier_sect_fish_chess_base_a extends modifier_sect_effect_base {
    Init() {
    }
}
@registerModifier()
export class modifier_sect_fish_chess_base_b extends modifier_sect_effect_base {
}

modifier_sect_assault_base_a
modifier_sect_assault_base_b

modifier_sect_doublespell_base_a
modifier_sect_doublespell_base_b
modifier_sect_steal_base_a
modifier_sect_steal_base_b

// 吸血流
@registerModifier()
export class modifier_sect_suck_blood_base_a extends modifier_sect_effect_base {

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
    lifesteal_pect: number;
    Init(kv: any) {
        this.lifesteal_pect = this.getSpecialData("lifesteal_pect");
        let parent = this.GetParentPlus();
        EmitSoundOn("hero_bloodseeker.bloodRage", parent);
    }

    GetEffectName(): string {
        return "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_eztzhok.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_bloodrage.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 4;
    }

}
@registerModifier()
export class modifier_sect_suck_blood_base_b extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
    lifesteal_pect: number;
    duration: number;
    Init(kv: any) {
        this.lifesteal_pect = this.getSpecialData("lifesteal_pect");
        this.duration = this.getSpecialData("duration");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(keys: ModifierAttackEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let attacker = keys.attacker;
        if (keys.attacker == parent) {
            modifier_sect_suck_blood_atk_speed.apply(attacker, attacker, null, {
                duration: this.duration,
                atkspeed: this.getSpecialData("atkspeed")
            });
        }
    }

}
@registerModifier()
export class modifier_sect_suck_blood_atk_speed extends BaseModifier_Plus {
    Init(kv: any) {
        if (IsServer()) {
            this.SetStackCount(kv.atkspeed);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT() {
        return this.GetStackCount()
    }
}

// 攻速流
@registerModifier()
export class modifier_sect_atkspeed_base_a extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    atkspeed = 0;
    Init() {
        let parent = this.GetParentPlus();
        // "particles/items2_fx/mask_of_madness.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/items2_fx/mask_of_madness.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.atkspeed = this.getSpecialData("atkspeed");

    }

}
@registerModifier()
export class modifier_sect_atkspeed_base_b extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT() {
        let parent = this.GetParentPlus();
        return this.atkspeed + parent.GetHealthLosePect() / 10 * this.atkspeed_per;
    }
    atkspeed = 0;
    atkspeed_per = 0;
    Init() {
        this.atkspeed = this.getSpecialData("atkspeed");
        this.atkspeed_per = this.getSpecialData("atkspeed_per");
    }

}

modifier_sect_control_base_a

modifier_sect_control_base_b

modifier_sect_betrayal_base_a

modifier_sect_betrayal_base_b












