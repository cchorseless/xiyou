
export module ResHelper {

    export enum EDOTA_CAST_SOUND {
        FLAG_NONE = 0,
        FLAG_BOTH_TEAMS = 1,
        FLAG_WHILE_DEAD = 2,
        FLAG_GLOBAL = 4,
    }
    export enum EParticleName {
        atk_lifesteal = "particles/generic_gameplay/generic_lifesteal.vpcf",
        spell_lifesteal = "particles/items3_fx/octarine_core_lifesteal.vpcf",
    }
    export enum EProjectileName {
        lifesteal = "particles/item/lifesteal_mask/lifesteal_particle.vpcf",
    }


    export function LoadUnitRes(unit: IBaseNpc_Plus): void {
        let name = unit.GetUnitName();
        let TempData = unit.TempData();
        if (name.includes("tiny")) {
            TempData.ambient_pfx_effect = "particles/units/heroes/hero_tiny/tiny_ambient.vpcf"
            TempData.death_pfx = "particles/units/heroes/hero_tiny/tiny01_death.vpcf"
            TempData.avalanche_effect = "particles/units/heroes/hero_tiny/tiny_avalanche.vpcf"
            TempData.avalance_projectile_effect = "particles/units/heroes/hero_tiny/tiny_avalanche_projectile.vpcf"
            TempData.tree_model = "models/heroes/tiny_01/tiny_01_tree.vmdl"
            TempData.tree_linear_effect = "particles/units/heroes/hero_tiny/tiny_tree_linear_proj.vpcf"
            TempData.tree_tracking_effect = "particles/units/heroes/hero_tiny/tiny_tree_proj.vpcf"
            TempData.tree_ambient_effect = ""
            TempData.tree_grab_sound = "Hero_Tiny.Tree.Grab"
            TempData.tree_throw_sound = "Hero_Tiny.Tree.Throw"
            TempData.tree_throw_target_sound = "Hero_Tiny.Tree.Target"
            TempData.tree_channel_target_sound = "Hero_Tiny.TreeChannel.Target"
            TempData.grow_effect = "particles/units/heroes/hero_tiny/tiny_transform.vpcf"
            TempData.tree_cleave_effect = "particles/units/heroes/hero_tiny/tiny_craggy_cleave.vpcf"
        }
        else if (name.includes("drow_ranger")) {
            TempData.base_attack_projectile = "particles/units/heroes/hero_drow/drow_base_attack.vpcf"
            TempData.frost_arrows_debuff_pfx = "particles/units/heroes/hero_drow/drow_frost_arrow_debuff.vpcf"
            TempData.marksmanship_arrow_pfx = "particles/units/heroes/hero_drow/drow_marksmanship_attack.vpcf"
            TempData.marksmanship_frost_arrow_pfx = "particles/units/heroes/hero_drow/drow_marksmanship_frost_arrow.vpcf"
        }
    }

    export function GetAbilityTextureReplacement(res: string, npc: IBaseNpc_Plus): string {
        if (npc && npc.ETRoot) {
            let wearComp = npc.ETRoot.GetComponentByName<IWearableComponent>("WearableComponent");
            if (wearComp) {
                return wearComp.GetAbilityTextureReplacement(res)
            }
        }
        return res;
    }

    export function GetSoundReplacement(res: string, npc: IBaseNpc_Plus): string {
        if (npc && npc.ETRoot) {
            let wearComp = npc.ETRoot.GetComponentByName<IWearableComponent>("WearableComponent");
            if (wearComp) {
                return wearComp.GetSoundReplacement(res)
            }
        }
        return res;
    }

    export function GetModelReplacement(res: string, npc: IBaseNpc_Plus): string {
        if (npc && npc.ETRoot) {
            let wearComp = npc.ETRoot.GetComponentByName<IWearableComponent>("WearableComponent");
            if (wearComp) {
                return wearComp.GetModelReplacement(res)
            }
        }
        return res;
    }

    export function GetParticleReplacement(res: string, npc: IBaseNpc_Plus): string {
        if (npc && npc.ETRoot) {
            let wearComp = npc.ETRoot.GetComponentByName<IWearableComponent>("WearableComponent");
            if (wearComp) {
                return wearComp.GetParticleReplacement(res)
            }
        }
        return res;
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
        resNpc?: IBaseNpc_Plus;
        /**等级，用于帧率优化 */
        level?: PARTICLE_DETAIL_LEVEL;
        /**粒子绑定位置 */
        iAttachment: ParticleAttachment_t;
        /**父节点 */
        owner?: IBaseNpc_Plus;
        /**有效时间 */
        validtime?: number;
    }
    @GReloadable
    export class ParticleInfo implements IParticleInfo {
        /**资源路径 */
        resPath: string;
        /**资源NPC */
        resNpc?: IBaseNpc_Plus;
        /**等级，用于帧率优化 */
        level?: PARTICLE_DETAIL_LEVEL;
        /**粒子绑定位置 */
        iAttachment: ParticleAttachment_t;
        /**父节点 */
        owner?: IBaseNpc_Plus;
        validtime?: number;
        isimmediately: boolean = false;

        set_resPath(r: string) {
            this.resPath = r;
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
        set_owner(r: IBaseNpc_Plus) {
            this.owner = r;
            this.resNpc = r;
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
        if (resInfo.validtime != null && resInfo.validtime > 0) {
            GTimerHelper.AddTimer(resInfo.validtime, GHandler.create({}, () => {
                ParticleManager.ClearParticle(p_id, resInfo.isimmediately);
            }));
        }
        return p_id;
    }


    export function CreateParticleEx(res: string, iAttachment: ParticleAttachment_t, owner: IBaseNpc_Plus, npc: IBaseNpc_Plus = null, validtime: number = -1, level: PARTICLE_DETAIL_LEVEL = PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_ULTRA, isimmediately: boolean = false) {
        if (npc == null) npc = owner;
        let p_id = ParticleManager.CreateParticle(ResHelper.GetParticleReplacement(res, npc), iAttachment, owner);
        if (validtime != null && validtime > 0) {
            GTimerHelper.AddTimer(validtime, GHandler.create(null, () => {
                ParticleManager.ClearParticle(p_id, isimmediately);
            }));
        }
        return p_id;
    }
}
