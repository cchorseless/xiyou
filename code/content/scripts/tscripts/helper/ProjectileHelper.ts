import { ResHelper } from "./ResHelper";

declare global {
    interface ITrackingProjectile {
        hTarget: IBaseNpc_Plus;
        hCaster: IBaseNpc_Plus;
        hAbility: IBaseAbility_Plus;
        iMoveSpeed: number;
        EffectName: string;
        SoundName?: string;
        flRadius: number;
        bDodgeable: boolean;
        bDestroyOnDodge: boolean;
        iSourceAttachment?: DOTAProjectileAttachment_t;
        OnProjectileHitUnit?: IGHandler;
        OnProjectileDestroy?: IGHandler
        flMaxDistance?: number;
        vSpawnOrigin?: Vector;
        vColor?: Vector;
        vColor2?: Vector;
        bProjectileDodged?: boolean;
        bDestroyOnGroundHit?: boolean;
        bDestroyOnWallHit?: boolean;
        creation_time?: number;
        flVisionRadius?: number;
        /**帧数 */
        flAcceleration?: number;
        flExpireTime?: number;
    }
    interface ITrackingProjectileInfo {
        projectile: Vector;
        particle: ParticleID;
        destroy?: boolean;
        flSpeed?: number;
        position?: Vector;
        hTarget?: IBaseNpc_Plus;
        /**帧数 */
        flAcceleration?: number;
    }
}
export module ProjectileHelper {
    export module TrackingProjectiles {

        export function Projectile<T = {}>(params: ITrackingProjectile & T): ITrackingProjectileInfo {
            let target = params.hTarget;
            let caster = params.hCaster;
            let speed = params.iMoveSpeed;
            target.TempData().dodged = false;
            params.creation_time = GameRules.GetGameTime();
            let projectile;
            if (params.vSpawnOrigin) {
                projectile = params.vSpawnOrigin;
            } else if (params.iSourceAttachment) {
                projectile = caster.GetAttachmentOrigin(params.iSourceAttachment);
            } else {
                projectile = caster.GetAbsOrigin();
            }
            let particle = ResHelper.CreateParticleEx(params.EffectName, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            ParticleManager.SetParticleControl(particle, 0, projectile);
            ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(particle, 2, Vector(speed, 0, 0));
            if (params.vColor) {
                ParticleManager.SetParticleControl(particle, 4, params.vColor);
            }
            if (params.vColor2) {
                ParticleManager.SetParticleControl(particle, 5, params.vColor2);
            }
            params.bProjectileDodged = false;
            let projectileID = {
                projectile: projectile,
                particle: particle
            }
            TrackingProjectiles.Think(params, projectileID);
            return projectileID;
        }
        export function Think(params: ITrackingProjectile, projectileID: ITrackingProjectileInfo): void {
            let target = params.hTarget;
            let caster = params.hCaster;
            let speed = params.iMoveSpeed;
            let projectile = projectileID.projectile;
            let particle = projectileID.particle;
            let visionRadius = params.flVisionRadius || 0;
            let acceleration = params.flAcceleration || 1;
            GTimerHelper.AddFrameTimer(acceleration, GHandler.create(params, () => {
                if (projectileID.destroy) {
                    ParticleManager.DestroyParticle(particle, false);
                    ParticleManager.ReleaseParticleIndex(particle);
                    OnProjectileDestroy(params, projectileID)
                    return;
                }
                if (params.bDestroyOnDodge && params.bDodgeable && target.TempData().dodged) {
                    ParticleManager.DestroyParticle(particle, false);
                    ParticleManager.ReleaseParticleIndex(particle);
                    OnProjectileDestroy(params, projectileID)
                    return;
                }
                if (params.bDodgeable && target.TempData().dodged) {
                    params.bProjectileDodged = true;
                }
                if (params.flExpireTime && GameRules.GetGameTime() - params.creation_time > params.flExpireTime) {
                    ParticleManager.DestroyParticle(particle, false);
                    ParticleManager.ReleaseParticleIndex(particle);
                    OnProjectileDestroy(params, projectileID)
                    return;
                }
                if (projectileID.flSpeed) {
                    speed = projectileID.flSpeed;
                    projectileID.flSpeed = undefined;
                }
                if (projectileID.flAcceleration) {
                    acceleration = projectileID.flAcceleration;
                    projectileID.flAcceleration = undefined;
                }
                if (projectileID.hTarget) {
                    target = projectileID.hTarget;
                    projectileID.hTarget = undefined;
                }
                let target_location = target.GetAbsOrigin();
                let time = GTimerHelper.GetUpdateInterval()
                let movedt = speed * acceleration * time;
                projectile = projectile + (target_location - projectile as Vector).Normalized() * movedt as Vector;
                projectileID.position = projectile;
                if (visionRadius) {
                    AddFOWViewer(caster.GetTeam(), projectile, visionRadius, time * 2, true);
                }
                if (params.bDestroyOnGroundHit && GetGroundPosition(projectile, undefined).z - 50 > projectile.z) {
                    ParticleManager.DestroyParticle(particle, false);
                    ParticleManager.ReleaseParticleIndex(particle);
                    OnProjectileDestroy(params, projectileID)
                    return;
                }
                if (params.bDestroyOnWallHit && !GridNav.IsTraversable(projectile)) {
                    ParticleManager.DestroyParticle(particle, false);
                    ParticleManager.ReleaseParticleIndex(particle);
                    OnProjectileDestroy(params, projectileID)
                    return;
                }
                if ((target_location - projectile as Vector).Length() - params.flRadius < movedt) {
                    TrackingProjectiles.OnProjectileHitUnit(params, projectileID);
                    ParticleManager.DestroyParticle(particle, false);
                    ParticleManager.ReleaseParticleIndex(particle);
                    return;
                } else if (params.flMaxDistance && (target_location - projectile as Vector).Length() > params.flMaxDistance) {
                    ParticleManager.DestroyParticle(particle, false);
                    ParticleManager.ReleaseParticleIndex(particle);
                    OnProjectileDestroy(params, projectileID)
                    return;
                }
                return acceleration;

            }));
        }
        export function GetProjectilePosition(projectileID: ITrackingProjectileInfo) {
            return projectileID.position;
        }
        export function DestroyProjectile(projectileID: ITrackingProjectileInfo) {
            projectileID.destroy = true;
        }
        export function ChangeTarget(projectileID: ITrackingProjectileInfo, hTarget: IBaseNpc_Plus) {
            projectileID.hTarget = hTarget;
        }
        export function ChangeSpeed(projectileID: ITrackingProjectileInfo, flSpeed: number) {
            projectileID.flSpeed = flSpeed;
        }
        /**
         * 改变弹道检查帧数
         * @param projectileID 
         * @param flAcceleration 
         */
        export function ChangeAcceleration(projectileID: ITrackingProjectileInfo, flAcceleration: number) {
            projectileID.flAcceleration = flAcceleration;
        }
        export function OnProjectileHitUnit(params: ITrackingProjectile, projectileID: ITrackingProjectileInfo) {
            if (!params.bProjectileDodged && params.OnProjectileHitUnit) {
                params.OnProjectileHitUnit.runWith([params, projectileID])
            }
        }
        export function OnProjectileDestroy(params: ITrackingProjectile, projectileID: ITrackingProjectileInfo) {
            if (params.OnProjectileDestroy) {
                params.OnProjectileDestroy.runWith([params, projectileID])
            }
        }

    }

    export function Init() {
        let oldProjectileDodge = ProjectileManager.ProjectileDodge;
        ProjectileManager.ProjectileDodge = (unit) => {
            if (unit) {
                unit.TempData().dodged = true;
            }
            oldProjectileDodge(unit);
        }
    }
}