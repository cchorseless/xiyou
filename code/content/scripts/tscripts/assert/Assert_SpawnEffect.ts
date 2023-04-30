import { ResHelper } from "../helper/ResHelper";
import { Assert_SoundEvent } from "./Assert_SoundEvent";

export interface ISpawnEffectInfo {
    name?: string;
    tp_effect?: string;
    tp_sound?: string;
    end_effect?: string;
    modifier?: SpawnEffectModifier;
}

export enum SpawnEffectModifier {
    spawn_fall = "spawn_fall",
    spawn_breaksoil = "spawn_breaksoil",
    spawn_torrent = "spawn_torrent",
}

export module Assert_SpawnEffect {
    export namespace Effect {
        export const Spawn_breaksoil: ISpawnEffectInfo = {
            name: "破土而出",
            modifier: SpawnEffectModifier.spawn_breaksoil,
        };

        export const Spawn_fall: ISpawnEffectInfo = {
            name: "天降神兵",
            modifier: SpawnEffectModifier.spawn_fall,
        };
        export const Spawn_radiance: ISpawnEffectInfo = {
            name: "闪亮登场",
            tp_effect: "particles/econ/events/ti10/radiance_owner_ti10_detail.vpcf",
            tp_sound: Assert_SoundEvent.animation_levelup,
            end_effect: "particles/econ/events/ti10/hero_levelup_ti10_godray.vpcf",
        };
        export const Spawn_portal: ISpawnEffectInfo = {
            name: "虚空传送阵",
            tp_effect: "particles/econ/events/ti10/portal/portal_open_good.vpcf",
            tp_sound: Assert_SoundEvent.animation_portal,
            end_effect: "particles/econ/events/ti10/portal/portal_open_good_endflash.vpcf",
        };
        export const Spawn_aegis: ISpawnEffectInfo = {
            name: "不朽之守护",
            tp_effect: "particles/generic/spawn_effect/aegis/aegis.vpcf",
            tp_sound: Assert_SoundEvent.animation_aegis,
            end_effect: "particles/items_fx/aegis_respawn_aegis_starfall.vpcf",
        };
        export const Spawn_kunkka: ISpawnEffectInfo = {
            name: "洪流浪潮",
            tp_effect: "particles/econ/items/kunkka/divine_anchor/hero_kunkka_dafx_skills/kunkka_spell_torrent_bubbles_fxset.vpcf",
            modifier: SpawnEffectModifier.spawn_torrent,
        };
        export const Spawn_cookie: ISpawnEffectInfo = {
            name: "龙炎饼干",
            tp_effect: "particles/econ/events/ti10/portal/portal_revealed_cookies.vpcf",
            tp_sound: Assert_SoundEvent.animation_cookie,
            end_effect: "particles/units/heroes/hero_lion/lion_spell_voodoo.vpcf",
        };
        export const Spawn_windrun: ISpawnEffectInfo = {
            name: "清风环佩",
            tp_effect: "particles/econ/items/windrunner/windranger_arcana/windranger_arcana_ambient.vpcf",
            tp_sound: Assert_SoundEvent.animation_windrun,
            end_effect: "particles/units/heroes/hero_lion/lion_spell_voodoo.vpcf",
        };
        export const Spawn_fall_2021: ISpawnEffectInfo = {
            name: "阿哈利姆传送",
            tp_effect: "particles/econ/events/fall_2021/teleport_end_fall_2021_lvl2.vpcf",
            tp_sound: Assert_SoundEvent.xiyou_tp,
            end_effect: "particles/econ/events/fall_2021/blink_dagger_fall_2021_start_lvl2.vpcf",
        };
    }
    /**
     * 返回动画时间
     * @param p 
     * @param e 
     * @returns 
     */
    export function ShowTPEffectAtPosition(p: Vector, e: ISpawnEffectInfo) {
        let delay = 0;
        if (e != null) {
            delay = RandomFloat(0.5, 1.5);
            let ppp = ResHelper.CreateParticle(new ResHelper.ParticleInfo().set_iAttachment(ParticleAttachment_t.PATTACH_WORLDORIGIN).set_resPath(e.tp_effect));
            ParticleManager.SetParticleControl(ppp, 0, p);
            ParticleManager.SetParticleControl(ppp, 1, p);
            GTimerHelper.AddTimer(delay, GHandler.create({}, () => {
                ParticleManager.ClearParticle(ppp);
                if (e.tp_sound != null) {
                    EmitSoundOnLocationWithCaster(p, e.tp_sound, undefined);
                }
                if (e.end_effect != null) {
                    ResHelper.CreateParticle(new ResHelper.ParticleInfo()
                        .set_iAttachment(ParticleAttachment_t.PATTACH_WORLDORIGIN)
                        .set_resPath(e.end_effect)
                        .set_validtime(2));
                }
            }));
        }
        return delay;

    }
}
