import { BaseNpc_Plus } from "../npc/entityPlus/BaseNpc_Plus";
import { LogHelper } from "./LogHelper";
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
        isimmediately?: boolean;
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
        isimmediately: boolean = false;

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
        set_isimmediately(r: boolean) {
            this.isimmediately = r;
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
            TimerHelper.addTimer(resInfo.validtime, () => {
                ParticleManager.DestroyParticle(p_id, resInfo.isimmediately);
                ParticleManager.ReleaseParticleIndex(p_id);
            });
        }
        return p_id;
    }

}
