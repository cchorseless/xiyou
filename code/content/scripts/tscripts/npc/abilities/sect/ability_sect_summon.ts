
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

// 召唤流
@registerAbility()
export class ability_sect_summon extends BaseAbility_Plus {
    AutoSpellSelf(): boolean {
        let caster = this.GetCasterPlus();
        if (caster.HasCiTiao(this.GetSectCiTiaoName("a"))) {
            return AI_ability.NO_TARGET_cast(this)
        }
        return false;
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let unitname = caster.GetUnitName();
        let t = caster.TempData().sect_summon || { duration: 20, summonlevel: 1 };
        let duration = t.duration;
        let level = t.summonlevel;
        let summonIndex = RandomInt(0, 5);
        if (unitname.includes("beastmaster")) {
            summonIndex = 0
        } else if (unitname.includes("lycan")) {
            summonIndex = 1
        } else if (unitname.includes("broodmother")) {
            summonIndex = 2
        } else if (unitname.includes("enigma")) {
            summonIndex = 3
        } else if (unitname.includes("visage")) {
            summonIndex = 4
        } else if (unitname.includes("warlock")) {
            summonIndex = 5
        }
        if (summonIndex == 0) {
            this.summonBoar(level, duration);
        } else if (summonIndex == 1) {
            this.summonWolves(level, duration);
        } else if (summonIndex == 2) {
            this.summonSpider(level, duration);
        } else if (summonIndex == 3) {
            this.summonEidolon(level, duration);
        } else if (summonIndex == 4) {
            this.summonFamiliar(level, duration);
        } else if (summonIndex == 5) {
            this.summonDemon(level, duration);
        }
    }


    /**
     * 野猪
     */
    summonBoar(level: number, duration: number): void {
        if (IsServer()) {
            const caster = this.GetCasterPlus();
            const summon_name = "npc_sect_summon_beastmaster_boar" + level;
            let spawn_point = caster.GetAbsOrigin() + RandomVector(125) as Vector;
            let spawn_particle = "particles/units/heroes/hero_beastmaster/beastmaster_call_boar.vpcf";
            let response = "beastmaster_beas_ability_summonsboar_0";
            caster.EmitSound(response + RandomInt(1, 5));
            caster.EmitSound("Hero_Beastmaster.Call.Boar");
            let spawn_particle_fx = ResHelper.CreateParticleEx(spawn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(spawn_particle_fx, 0, spawn_point);
            let boar = caster.CreateSummon(summon_name, spawn_point, duration, true);
        }
    }
    /**
     * 鹰
     */
    summonHawk(): void {
        if (IsServer()) {
            const caster = this.GetCasterPlus();
            let hawk_name = "npc_imba_beastmaster_hawk_";
            let hawk_level = this.GetLevel();
            let spawn_point = caster.GetAbsOrigin();
            let spawn_particle = "particles/units/heroes/hero_beastmaster/beastmaster_call_bird.vpcf";
            let response = "beastmaster_beas_ability_summonsbird_0";
            let hawk_duration = this.GetSpecialValueFor("hawk_duration");
            caster.EmitSound(response + RandomInt(1, 5));
            caster.EmitSound("Hero_Beastmaster.Call.Hawk");
            let spawn_particle_fx = ResHelper.CreateParticleEx(spawn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(spawn_particle_fx, 0, spawn_point);
            let hawk = caster.CreateSummon(hawk_name + hawk_level, spawn_point, hawk_duration, false);
            hawk.AddNewModifier(caster, this, "modifier_imba_beastmaster_hawk", {});
            let hawk_speed = this.GetSpecialValueFor("hawk_speed_tooltip");
            hawk.SetBaseMoveSpeed(hawk_speed);
        }

    }
    /**
     * 狼
     */
    summonWolves(level: number, duration: number): void {
        const caster = this.GetCasterPlus();
        const summon_name = "npc_sect_summon_lycan_wolf" + level;
        EmitSoundOn("lycan_lycan_ability_summon_0" + RandomInt(1, 6), caster);
        EmitSoundOn("Hero_Lycan.SummonWolves", caster);
        let particle_cast_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_summon_wolves_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_cast_fx, 0, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_cast_fx);
        let wolf = caster.CreateSummon(summon_name, (caster.GetAbsOrigin() + caster.GetForwardVector() * 200 + caster.GetRightVector() * 120) as Vector, duration, true);
        let wolves_spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_summon_wolves_spawn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, wolf);
        ParticleManager.ReleaseParticleIndex(wolves_spawn_particle);
        wolf.SetForwardVector(caster.GetForwardVector());
    }

    /**
     * 蜘蛛
     */
    summonSpider(level: number, duration: number): void {
        const caster = this.GetCasterPlus();
        const summon_name = "npc_sect_summon_broodmother_spider" + level;
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_broodmother/broodmother_spiderlings_spawn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(pfx, 0, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(pfx);
        let spawn_point = caster.GetAbsOrigin() + RandomVector(125) as Vector;
        caster.EmitSound("Hero_Broodmother.SpawnSpiderlings");
        let spiderling = caster.CreateSummon(summon_name, spawn_point, duration, false);
        spiderling.SetUnitOnClearGround();

    }

    /**
     * 召唤小谜团
     * @param hParent 
     * @param vLocation 
     * @param iWave 
     * @param fDuration 
     */
    summonEidolon(level: number, fDuration: number) {
        const caster = this.GetCasterPlus();
        const summon_name = "npc_sect_summon_enigma_eidolon" + level;
        let spawn_point = caster.GetAbsOrigin() + RandomVector(125) as Vector;
        let eidolon = caster.CreateSummon(summon_name, spawn_point, fDuration, true);
        eidolon.SetUnitOnClearGround();
        EmitSoundOn("Hero_Enigma.Demonic_Conversion", caster);
    }


    /**
     * 召唤飞龙
     * @param hParent 
     * @param vLocation 
     * @param iWave 
     * @param fDuration 
     */
    summonFamiliar(level: number, fDuration: number) {
        const caster = this.GetCasterPlus();
        let sounds = {
            "1": "visage_visa_summon_03",
            "2": "visage_visa_summon_04"
        }
        caster.EmitSound(GFuncRandom.RandomValue(sounds));
        const summon_name = "npc_sect_summon_visage_familiar" + level;
        let spawn_location = this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 200) as Vector;
        let familiar = this.GetCasterPlus().CreateSummon(summon_name, spawn_location, fDuration, true);
        let summon_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_summon_familiars.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, familiar);
        ParticleManager.ReleaseParticleIndex(summon_particle);

    }
    /**
     * 召唤魔像
     * @param level 
     * @param fDuration 
     */
    summonDemon(level: number, fDuration: number) {
        const caster = this.GetCasterPlus();
        const target_point = caster.GetAbsOrigin() + RandomVector(125) as Vector;
        const summon_name = "npc_sect_summon_warlock_golem" + level;
        GridNav.DestroyTreesAroundPoint(target_point, 128, false);
        let particle_start_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_rain_of_chaos_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle_start_fx, 0, target_point);
        ParticleManager.ReleaseParticleIndex(particle_start_fx);
        let particle_main_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_rain_of_chaos.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle_main_fx, 0, target_point);
        ParticleManager.SetParticleControl(particle_main_fx, 1, Vector(this.GetSpecialValueFor("radius"), 0, 0));
        ParticleManager.ReleaseParticleIndex(particle_main_fx);
        EmitSoundOn("Hero_Warlock.RainOfChaos", caster);
        let demon = this.GetCasterPlus().CreateSummon(summon_name, target_point, fDuration, true);
        ResolveNPCPositions(target_point, 128);

    }
}


