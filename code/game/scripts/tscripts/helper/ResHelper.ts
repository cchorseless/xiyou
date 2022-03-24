import { BaseNpc_Plus } from "../npc/entityPlus/BaseNpc_Plus";

export module ResHelper {


    export function GetAbilityTextureReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res
        }
    }

    export function GetSoundReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res
        }
    }

    export function GetModelReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res
        }
    }

    export function GetParticleReplacement(res: string, npc: BaseNpc_Plus = null): string {
        if (res && res.length > 0) {
            return res
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

    export interface ParticleInfo {
        /**资源路径 */
        resPath: string,
        /**资源NPC */
        resNpc?: BaseNpc_Plus,
        /**等级，用于帧率优化 */
        level?: PARTICLE_DETAIL_LEVEL,
        /**粒子绑定位置 */
        iAttachment: ParticleAttachment_t,
        /**父节点 */
        owner?: BaseNpc_Plus

    }
    /**
     * todo
     * @param res 资源路径
     * @param npc
     * @param iAttachment
     * @param owner
     * @returns
     */
    export function CreateParticle(resInfo: ParticleInfo) {
        if (resInfo.level == null) {
            resInfo.level = PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_ULTRA
        }
        let p_id = ParticleManager.CreateParticle(ResHelper.GetParticleReplacement(resInfo.resPath, resInfo.resNpc), resInfo.iAttachment, resInfo.owner);
        return p_id
    }

    /**
     * 释放特效
     * @param particle
     */
    export function ReleaseParticleIndex(particle: ParticleID) {
        ParticleManager.ReleaseParticleIndex(particle);
    }
}

interface AbilityAssertInfo {
    /**施法 */
    Cast?: string
}

interface HeroAssertInfo {
    Ability1?: AbilityAssertInfo,
    Ability2?: AbilityAssertInfo,
    Ability3?: AbilityAssertInfo,
    Ability4?: AbilityAssertInfo,
    ModelName?: string,
}

export module Assert_Particles {
    const Hero_EmberSpirit: HeroAssertInfo = {
        Ability1: {
            Cast: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_cast.vpcf",
        },
        Ability2: {},
        Ability3: {},
        Ability4: {},
    }
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
        }
        /**屠夫 */
        export const Pudge: HeroAssertInfo = {

        }

    }
    export namespace Game {
        export const Victory = 'Game.Victory';
        export const Defeat = 'Game.Defeat';
    }
    /**播音員 */
    export namespace Announcer {
        export const end_02 = "announcer_ann_custom_end_02"
        export const end_08 = "announcer_ann_custom_end_08"

    }

}
/**模型资源 */
export module Assert_Model {
    export namespace Hero {
        /**火猫 */
        export const EmberSpirit: HeroAssertInfo = {
            ModelName: '',
        }
    }
}

