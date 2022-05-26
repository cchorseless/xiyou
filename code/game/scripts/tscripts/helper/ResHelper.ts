import { BaseNpc_Plus } from "../npc/entityPlus/BaseNpc_Plus";
import { TimerHelper } from "./TimerHelper";

export module ResHelper {
    export function GetAbilityTextureReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res;
        }
    }

    export function GetSoundReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res;
        }
    }

    export function GetModelReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res;
        }
    }

    export function GetParticleReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res;
        }
    }

    export enum PARTICLE_DETAIL_LEVEL {
        PARTICLE_DETAIL_LEVEL_NONE,
        /**不关键特效 帧数低于30帧隐藏 */
        PARTICLE_DETAIL_LEVEL_LOW,
        /**中等关键特效 帧数低于15帧隐藏 */
        PARTICLE_DETAIL_LEVEL_MEDIUM,
        /**关键特效 帧数特低于10帧隐藏 */
        PARTICLE_DETAIL_LEVEL_HIGH,
        /**默认，不隐藏的特效 */
        PARTICLE_DETAIL_LEVEL_ULTRA,
    }
    /**记录的特效数量 */
    export const MAX_PARTICLES = 512;
    export const tPlayerParticles = {};

    export interface IParticleInfo {
        /**资源路径 */
        resPath: string;
        /**资源NPC */
        resNpc?: BaseNpc_Plus;
        /**等级，用于帧率优化 */
        level?: PARTICLE_DETAIL_LEVEL;
        /**粒子绑定位置 */
        iAttachment: ParticleAttachment_t;
        /**父节点 */
        owner?: BaseNpc_Plus;
        /**有效时间 */
        validtime?: number;
    }

    export class ParticleInfo implements IParticleInfo {
        /**资源路径 */
        resPath: string;
        /**资源NPC */
        resNpc?: BaseNpc_Plus;
        /**等级，用于帧率优化 */
        level?: PARTICLE_DETAIL_LEVEL;
        /**粒子绑定位置 */
        iAttachment: ParticleAttachment_t;
        /**父节点 */
        owner?: BaseNpc_Plus;
        validtime?: number;

        set_resPath(r: string) {
            this.resPath = r;
            return this;
        }
        set_resNpc(r: BaseNpc_Plus) {
            this.resNpc = r;
            return this;
        }
        set_level(r: PARTICLE_DETAIL_LEVEL) {
            this.level = r;
            return this;
        }
        set_iAttachment(r: ParticleAttachment_t) {
            this.iAttachment = r;
            return this;
        }
        set_owner(r: BaseNpc_Plus) {
            this.owner = r;
            return this;
        }
        set_validtime(r: number) {
            this.validtime = r;
            return this;
        }
    }

    /**
     * todo
     * @param res 资源路径
     * @param npc
     * @param iAttachment
     * @param owner
     * @returns
     */
    export function CreateParticle(resInfo: IParticleInfo) {
        if (resInfo.level == null) {
            resInfo.level = PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_ULTRA;
        }
        let p_id = ParticleManager.CreateParticle(ResHelper.GetParticleReplacement(resInfo.resPath, resInfo.resNpc), resInfo.iAttachment, resInfo.owner);
        if (resInfo.validtime != null || resInfo.validtime > 0) {
            TimerHelper.addTimer(
                resInfo.validtime,
                () => {
                    ParticleManager.ReleaseParticleIndex(p_id);
                },
                ResHelper,
                true
            );
        }
        return p_id;
    }

    /**
     * 释放特效
     * @param particlex``
     */
    export function ReleaseParticleIndex(particle: ParticleID) {
        ParticleManager.ReleaseParticleIndex(particle);
    }

    export function ShowTPEffectAtPosition(p: Vector, e: string, time: number) {
        if (e != null) {
            let ppp = CreateParticle(
                new ParticleInfo().set_iAttachment(ParticleAttachment_t.PATTACH_WORLDORIGIN)
                    .set_resPath(e).set_validtime(time)
            );
            ParticleManager.SetParticleControl(ppp, 0, p);
            ParticleManager.SetParticleControl(ppp, 1, p);
            return ppp;
        }
    }
}

interface AbilityAssertInfo {
    /**施法 */
    Cast?: string;
}

interface HeroAssertInfo {
    Ability1?: AbilityAssertInfo;
    Ability2?: AbilityAssertInfo;
    Ability3?: AbilityAssertInfo;
    Ability4?: AbilityAssertInfo;
    ModelName?: string;
}

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
        tp_sound: "animation.levelup",
        end_effect: "particles/econ/events/ti10/hero_levelup_ti10_godray.vpcf",
    };
    export const Spawn_portal: ISpawnEffectInfo = {
        name: "虚空传送阵",
        tp_effect: "particles/econ/events/ti10/portal/portal_open_good.vpcf",
        tp_sound: "animation.portal",
        end_effect: "particles/econ/events/ti10/portal/portal_open_good_endflash.vpcf",
    };
    export const Spawn_aegis: ISpawnEffectInfo = {
        name: "不朽之守护",
        tp_effect: "effect/aegis.vpcf",
        tp_sound: "animation.aegis",
        end_effect: "particles/items_fx/aegis_respawn_aegis_starfall.vpcf",
    };
    export const Spawn_kunkka: ISpawnEffectInfo = {
        name: "洪流浪潮",
        tp_effect: "effect/animation/water/1kunkka/kunkka_spell_torrent_bubbles.vpcf",
        modifier: SpawnEffectModifier.spawn_torrent,
    };
    export const Spawn_cookie: ISpawnEffectInfo = {
        name: "龙炎饼干",
        tp_effect: "effect/animation/cookie/revealed_cookies.vpcf",
        tp_sound: "animation.cookie",
        end_effect: "particles/units/heroes/hero_lion/lion_spell_voodoo.vpcf",
    };
    export const Spawn_windrun: ISpawnEffectInfo = {
        name: "清风环佩",
        tp_effect: "particles/econ/items/windrunner/windranger_arcana/windranger_arcana_ambient.vpcf",
        tp_sound: "animation.windrun",
        end_effect: "particles/units/heroes/hero_lion/lion_spell_voodoo.vpcf",
    };
    export const Spawn_fall_2021: ISpawnEffectInfo = {
        name: "阿哈利姆传送",
        tp_effect: "effect/agha_tp/econ/events/fall_2021/teleport_end_fall_2021_lvl2.vpcf",
        tp_sound: "dac.tp",
        end_effect: "particles/econ/events/fall_2021/blink_dagger_fall_2021_start_lvl2.vpcf",
    };
}

export module Assert_Particles {
    const Hero_EmberSpirit: HeroAssertInfo = {
        Ability1: {
            Cast: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_cast.vpcf",
        },
        Ability2: {},
        Ability3: {},
        Ability4: {},
    };
}

/**音效资源 */
export module Assert_Sounds {
    export namespace Hero {
        /**火猫 */
        export const EmberSpirit: HeroAssertInfo = {
            Ability1: {
                Cast: "Hero_EmberSpirit.SleightOfFist.Cast",
            },
            Ability2: {},
            Ability3: {},
            Ability4: {},
        };
        /**屠夫 */
        export const Pudge: HeroAssertInfo = {};
    }
    export namespace Game {
        export const Victory = "Game.Victory";
        export const Defeat = "Game.Defeat";
    }
    /**播音員 */
    export namespace Announcer {
        export const end_02 = "announcer_ann_custom_end_02";
        export const end_08 = "announcer_ann_custom_end_08";
    }
}
/**模型资源 */
export module Assert_Model {
    export namespace Hero {
        /**火猫 */
        export const EmberSpirit: HeroAssertInfo = {
            ModelName: "",
        };
    }
}
