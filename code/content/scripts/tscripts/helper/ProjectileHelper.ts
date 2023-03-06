import { ResHelper } from "./ResHelper";

declare global {
    interface ITrackingProjectile {
        hTarget: IBaseNpc_Plus;
        hCaster: IBaseNpc_Plus;
        hAbility: CDOTABaseAbility;
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

    interface ILineProjectile {
        EffectName?: string;
        vVelocity?: Vector;
        fDistance?: number;
        fStartRadius?: number;
        fEndRadius?: number;
        iPositionCP?: number;
        iVelocityCP?: number;
        fVisionTickTime?: number;
        fVisionLingerDuration?: number;
        fExpireTime?: number;
        vSpawnOrigin?: Vector;
        vSpawnOriginInfo?: { unit: IBaseNpc_Plus, attach: string, offset: number };
        iVisionTeamNumber?: DOTATeam_t;
        Source?: IBaseNpc_Plus;
        // vVelocity?: number;
        fRehitDelay?: number;
        TreeBehavior?: ProjectileHelper.ELineProjectBehavior;
        WallBehavior?: ProjectileHelper.ELineProjectBehavior;
        GroundBehavior?: ProjectileHelper.ELineProjectBehavior;
        UnitBehavior?: ProjectileHelper.ELineProjectBehavior;
        bIgnoreSource?: boolean;
        bMultipleHits?: boolean;
        bRecreateOnChange?: boolean;
        bZCheck?: boolean;
        bGroundLock?: boolean;
        bCutTrees?: boolean;
        bDestroyImmediate?: boolean;
        fGroundOffset?: number;
        nChangeMax?: number;
        fRadiusStep?: number;
        fChangeDelay?: number;
        OnThink?: IGHandler;
        UnitTest?: IGHandler;
        OnUnitHit?: IGHandler;
        OnTreeHit?: IGHandler;
        OnWallHit?: IGHandler;
        OnGroundHit?: IGHandler;
        bTreeFullCollision?: boolean;
        bFlyingVision?: boolean;
        bProvidesVision?: boolean;
        iVisionRadius?: number;
        ControlPoints?: [number, Vector][];
        ControlPointForwards?: [number, Vector][];
        ControlPointOrientations?: [number, Vector, Vector, Vector][];
        ControlPointEntityAttaches?: { controlPoint: number, unit: IBaseNpc_Plus, pattach: ParticleAttachment_t, attachPoint: string, origin: Vector }[];
    }
    type GLineProjectile = ProjectileHelper.LineProjectiles.LineProjectile;
}
export module ProjectileHelper {

    export function ProjectileDodgePlus(unit: IBaseNpc_Plus) {
        if (unit) {
            unit.TempData().dodged = true;
        }
        ProjectileManager.ProjectileDodge(unit);
    }


    export enum ELineProjectBehavior {
        PROJECTILES_NOTHING = 0,
        PROJECTILES_DESTROY = 1,
        PROJECTILES_BOUNCE = 2,
        PROJECTILES_FOLLOW = 3,
    }
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

    export module LineProjectiles {
        export function CalcSlope(pos: Vector, unit: IBaseNpc_Plus, dir: Vector) {
            dir = Vector(dir.x, dir.y, 0 as Vector).Normalized();
            let f = GetGroundPosition(pos + dir as Vector, unit);
            let b = GetGroundPosition(pos - dir as Vector, unit);
            return (f - b as Vector).Normalized();
        }
        export function CalcNormal(pos: Vector, unit: IBaseNpc_Plus, scale: number = 1) {
            let nscale = -1 * scale;
            let zl = GetGroundPosition(pos + Vector(nscale, 0, 0) as Vector, unit).z;
            let zr = GetGroundPosition(pos + Vector(scale, 0, 0) as Vector, unit).z;
            let zu = GetGroundPosition(pos + Vector(0, scale, 0) as Vector, unit).z;
            let zd = GetGroundPosition(pos + Vector(0, nscale, 0) as Vector, unit).z;
            return Vector(zl - zr, zd - zu, 2 * scale as Vector).Normalized();
        }
        export function CreateProjectile(projectile: ILineProjectile) {
            return LineProjectile.CreateOne(projectile);
        }

        export class LineProjectile {
            EffectName?: string;
            vVelocity?: Vector;
            fStartRadius?: number;
            fEndRadius?: number;
            iPositionCP?: number;
            iVelocityCP?: number;
            fVisionTickTime?: number;
            vSpawnOrigin?: Vector;
            // vVelocity?: number;
            TreeBehavior?: ProjectileHelper.ELineProjectBehavior;
            WallBehavior?: ProjectileHelper.ELineProjectBehavior;
            GroundBehavior?: ProjectileHelper.ELineProjectBehavior;
            UnitBehavior?: ProjectileHelper.ELineProjectBehavior;
            bRecreateOnChange?: boolean;
            nChangeMax?: number;
            fRadiusStep?: number;
            fChangeDelay?: number;
            OnThink?: IGHandler;
            UnitTest?: IGHandler;
            OnUnitHit?: IGHandler;
            OnTreeHit?: IGHandler;
            OnWallHit?: IGHandler;
            OnGroundHit?: IGHandler;
            ControlPoints?: [number, Vector][];
            ControlPointForwards?: [number, Vector][];
            ControlPointOrientations?: [number, Vector, Vector, Vector][];
            ControlPointEntityAttaches?: { controlPoint: number, unit: IBaseNpc_Plus, pattach: ParticleAttachment_t, attachPoint: string, origin: Vector }[];
            static CreateOne(info: ILineProjectile) {
                let projectile = new LineProjectile();
                if (info.OnThink) {
                    info.OnThink.once = false;
                    projectile.OnThink = info.OnThink;
                }
                if (info.UnitTest) {
                    info.UnitTest.once = false;
                    projectile.UnitTest = info.UnitTest;
                }
                if (info.OnUnitHit) {
                    info.OnUnitHit.once = false;
                    projectile.OnUnitHit = info.OnUnitHit;
                }
                if (info.OnTreeHit) {
                    info.OnTreeHit.once = false;
                    projectile.OnTreeHit = info.OnTreeHit;
                }
                if (info.OnWallHit) {
                    info.OnWallHit.once = false;
                    projectile.OnWallHit = info.OnWallHit;
                }
                if (info.OnGroundHit) {
                    info.OnGroundHit.once = false;
                    projectile.OnGroundHit = info.OnGroundHit;
                }
                projectile.EffectName = info.EffectName;
                projectile.vVelocity = info.vVelocity || Vector(0, 0, 0);
                projectile.fDistance = info.fDistance || 1000;
                projectile.fStartRadius = info.fStartRadius || 100;
                projectile.fEndRadius = info.fEndRadius || 100;
                projectile.iPositionCP = info.iPositionCP || 0;
                projectile.iVelocityCP = info.iVelocityCP || 1;
                projectile.fExpireTime = info.fExpireTime || 10;
                projectile.UnitBehavior = info.UnitBehavior || ELineProjectBehavior.PROJECTILES_DESTROY;
                projectile.bIgnoreSource = info.bIgnoreSource || true;
                projectile.bMultipleHits = info.bMultipleHits || false;
                projectile.bRecreateOnChange = info.bRecreateOnChange || true;
                projectile.bZCheck = info.bZCheck || true;
                projectile.fRehitDelay = info.fRehitDelay || 1;
                projectile.TreeBehavior = info.TreeBehavior || ELineProjectBehavior.PROJECTILES_DESTROY;
                projectile.bCutTrees = info.bCutTrees || false;
                projectile.bDestroyImmediate = info.bDestroyImmediate || true;
                projectile.WallBehavior = info.WallBehavior || ELineProjectBehavior.PROJECTILES_DESTROY;
                projectile.GroundBehavior = info.GroundBehavior || ELineProjectBehavior.PROJECTILES_DESTROY;
                projectile.bGroundLock = info.bGroundLock || false;
                projectile.fGroundOffset = info.fGroundOffset || 40;
                projectile.nChangeMax = info.nChangeMax || 1;
                projectile.fChangeDelay = info.fChangeDelay || .1;
                projectile.ControlPoints = info.ControlPoints || [];
                projectile.ControlPointForwards = info.ControlPointForwards || []
                projectile.ControlPointOrientations = info.ControlPointOrientations || []
                projectile.ControlPointEntityAttaches = info.ControlPointEntityAttaches || []
                projectile.bTreeFullCollision = info.bTreeFullCollision || false;
                projectile.bFlyingVision = info.bFlyingVision || true;
                projectile.bProvidesVision = info.bProvidesVision || false;
                projectile.iVisionRadius = info.iVisionRadius || 200;
                projectile.iVisionTeamNumber = info.iVisionTeamNumber || info.Source.GetTeam();
                projectile.fVisionTickTime = info.fVisionTickTime || 0.1;
                if (projectile.fVisionTickTime <= 0) {
                    projectile.fVisionTickTime = 0.1;
                }
                projectile.fVisionLingerDuration = info.fVisionLingerDuration || info.fVisionTickTime;
                if (projectile.fVisionLingerDuration < projectile.fVisionTickTime) {
                    projectile.fVisionLingerDuration = projectile.fVisionTickTime;
                }
                projectile.vSpawnOrigin = info.vSpawnOrigin || Vector(0, 0, 0);
                if (info.vSpawnOriginInfo && info.vSpawnOriginInfo.unit) {
                    let attach = info.vSpawnOriginInfo.unit.ScriptLookupAttachment(info.vSpawnOriginInfo.attach);
                    let attachPos = info.vSpawnOriginInfo.unit.GetAttachmentOrigin(attach);
                    projectile.vSpawnOrigin = attachPos + (info.vSpawnOriginInfo.offset || Vector(0, 0, 0)) as Vector;
                }

                projectile.pos = projectile.vSpawnOrigin;
                projectile.vel = projectile.vVelocity / 30 as Vector;
                projectile.prevPos = projectile.vSpawnOrigin;
                projectile.radius = projectile.fStartRadius;
                projectile.changes = projectile.nChangeMax;
                projectile.spawnTime = GameRules.GetGameTime();
                projectile.changeTime = projectile.spawnTime;
                projectile.distanceTraveled = 0;
                projectile.visionTick = math.ceil(projectile.fVisionTickTime * 30);
                projectile.currentFrame = projectile.visionTick;
                if (info.fRadiusStep) {
                    projectile.radiusStep = info.fRadiusStep / 30;
                } else {
                    projectile.radiusStep = (info.fEndRadius - info.fStartRadius) / (info.fDistance / projectile.vel.Length());
                }
                projectile.id = ResHelper.CreateParticleEx(info.EffectName, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleAlwaysSimulate(projectile.id);
                for (const [k, v] of (projectile.ControlPoints)) {
                    ParticleManager.SetParticleControl(projectile.id, k, v);
                }
                for (const [k, v] of (projectile.ControlPointForwards)) {
                    ParticleManager.SetParticleControlForward(projectile.id, k, v);
                }
                for (const [k, v1, v2, v3] of (projectile.ControlPointOrientations)) {
                    ParticleManager.SetParticleControlOrientation(projectile.id, k, v1, v2, v3);
                }
                for (const v of (projectile.ControlPointEntityAttaches)) {
                    let k = v.controlPoint;
                    let unit = v.unit || projectile.Source;
                    let pattach = v.pattach || ParticleAttachment_t.PATTACH_CUSTOMORIGIN;
                    let attachPoint = v.attachPoint;
                    let origin = v.origin || projectile.vSpawnOrigin;
                    ParticleManager.SetParticleControlEnt(projectile.id, k, unit, pattach, attachPoint, origin, true);
                }
                ParticleManager.SetParticleControl(projectile.id, info.iPositionCP, info.vSpawnOrigin);
                if (info.ControlPointForwards.length > 0 && info.ControlPointOrientations.length > 0) {
                    ParticleManager.SetParticleControlForward(projectile.id, info.iPositionCP, projectile.vel.Normalized());
                }
                if (info.GroundBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_FOLLOW) {
                    let future = projectile.pos + projectile.vel as Vector;
                    let ground = GetGroundPosition(projectile.pos, projectile.Source) + Vector(0, 0, projectile.fGroundOffset) as Vector;
                    if (ground.z > future.z) {
                        let slope = CalcSlope(ground, projectile.Source, projectile.vel);
                        ParticleManager.SetParticleControl(projectile.id, info.iVelocityCP, projectile.vel.Length() * slope * 30 as Vector);
                    } else {
                        ParticleManager.SetParticleControl(projectile.id, info.iVelocityCP, projectile.vel * 30 as Vector);
                    }
                } else {
                    ParticleManager.SetParticleControl(projectile.id, info.iVelocityCP, projectile.vel * 30 as Vector);
                }
                GTimerHelper.AddTimer(0, GHandler.create(projectile, () => {
                    if (projectile.OnThink) {
                        projectile.OnThink.runWith([projectile])
                    }
                    return projectile.Run();
                }));
            }

            GetCreationTime() {
                return this.spawnTime;
            }
            GetDistanceTraveled() {
                return this.distanceTraveled;
            }
            GetPosition() {
                return this.pos;
            }
            GetVelocity() {
                return this.vel * 30;
            }
            SetVelocity(newVel: Vector, newPos: Vector) {
                if (this.changes > 0) {
                    this.changes = this.changes - 1;
                    this.vel = newVel / 30 as Vector;
                    this.changeTime = GameRules.GetGameTime() + this.fChangeDelay;
                    if (this.bRecreateOnChange) {
                        ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                        this.id = ResHelper.CreateParticleEx(this.EffectName, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                        ParticleManager.SetParticleAlwaysSimulate(this.id);
                        for (const [k, v] of (this.ControlPoints)) {
                            ParticleManager.SetParticleControl(this.id, k, v);
                        }
                        for (const [k, v] of (this.ControlPointForwards)) {
                            ParticleManager.SetParticleControlForward(this.id, k, v);
                        }
                        for (const [k, v1, v2, v3] of (this.ControlPointOrientations)) {
                            ParticleManager.SetParticleControlOrientation(this.id, k, v1, v2, v3);
                        }
                        for (const v of (this.ControlPointEntityAttaches)) {
                            let k = v.controlPoint;
                            let unit = v.unit || this.Source;
                            let pattach = v.pattach || ParticleAttachment_t.PATTACH_CUSTOMORIGIN;
                            let attachPoint = v.attachPoint;
                            let origin = v.origin || this.vSpawnOrigin;
                            ParticleManager.SetParticleControlEnt(this.id, k, unit, pattach, attachPoint, origin, true);
                        }
                        ParticleManager.SetParticleControl(this.id, this.iPositionCP, newPos || (this.pos + this.vel) as Vector);
                        if (this.ControlPointForwards.length > 0 && this.ControlPointOrientations.length > 0) {
                            ParticleManager.SetParticleControlForward(this.id, this.iPositionCP, this.vel.Normalized());
                        }
                    }
                    ParticleManager.SetParticleControl(this.id, this.iVelocityCP, newVel);
                }
            }
            Destroy() {
                ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                GTimerHelper.ClearAll(this)
            }
            id: ParticleID;
            vel: Vector;
            prevPos: Vector;
            pos: Vector;
            bGroundLock: boolean;
            Source: IBaseNpc_Plus;
            fGroundOffset: number;
            spawnTime: number;
            radiusStep: number;
            fExpireTime: number;
            changes: number;
            changeTime: number;
            distanceTraveled: number;
            fDistance: number;
            bDestroyImmediate: boolean;
            bZCheck: boolean;
            bProvidesVision: boolean;
            bUseFindUnitsInRadius: boolean;
            radius: number;
            visionTick: number;
            fRehitDelay: number;
            iVisionTeamNumber: DOTATeam_t;
            iVisionRadius: number;
            fVisionLingerDuration: number;
            bFlyingVision: boolean;
            bIgnoreSource: boolean;
            bMultipleHits: boolean;
            bCutTrees: boolean;
            bTreeFullCollision: boolean;
            currentFrame: number;
            draw: { color: Vector, alpha: number };

            filter: IGHandler;
            OnFinish: IGHandler;

            rehit: { [key: string]: number } = {};
            Run() {
                let curTime = GameRules.GetGameTime();
                let vel = this.vel;
                let pos = this.pos;
                if (this.bGroundLock) {
                    pos.z = GetGroundPosition(pos, this.Source).z + this.fGroundOffset;
                }
                if (curTime > this.spawnTime + this.fExpireTime || this.distanceTraveled > this.fDistance) {
                    ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                    if (this.OnFinish) {
                        this.OnFinish.runWith([this, pos])
                    }
                    return;
                }
                let radius = this.radius;
                if (this.draw) {
                    let alpha = 1;
                    let color = Vector(200, 0, 0);
                    if (type(this.draw) == "table") {
                        alpha = this.draw.alpha || alpha;
                        color = this.draw.color || color;
                    }
                    DebugDrawSphere(pos, color, alpha, radius, true, .01);
                }
                let subpos = pos;
                let velLength = vel.Length();
                let tot = math.max(1, math.ceil(velLength / 32));
                let div = 1 / tot;
                let framehalf = pos + (vel * div * (tot - 1)) / 2 as Vector;
                let framerad = (framehalf - pos as Vector).Length() + radius;
                let ents: IBaseNpc_Plus[] = undefined;
                if (this.filter) {
                    ents = this.filter.runWith([this]);
                }
                else {
                    if (this.bUseFindUnitsInRadius != undefined) {
                        if (this.bUseFindUnitsInRadius) {
                            ents = FindUnitsInRadius(0, framehalf, undefined, framerad, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                        } else {
                            ents = Entities.FindAllInSphere(framehalf, framerad) as IBaseNpc_Plus[];
                        }
                    } else {
                        if (this.bZCheck) {
                            ents = Entities.FindAllInSphere(framehalf, framerad) as IBaseNpc_Plus[];
                        } else {
                            ents = FindUnitsInRadius(0, framehalf, undefined, framerad, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                        }
                    }
                }
                for (let index = 0; index < tot; index++) {
                    for (let i = 0; i <= ents.length; i++) {
                        let v = ents[i];
                        let zOffset = v.TempData().zOffset || 0;
                        let height = (v.TempData().height || 150) + zOffset;
                        let org = v.GetAbsOrigin();
                        let nozorg = Vector(org.x, org.y, 0);
                        let nozpos = Vector(subpos.x, subpos.y, 0);
                        let nozCheck = (nozpos - nozorg as Vector).Length2D() <= this.radius;
                        let zCheck = true;
                        if (this.bZCheck) {
                            zCheck = subpos.z >= org.z + zOffset && subpos.z <= org.z + height;
                        }
                        if (IsValidEntity(v) && v.GetUnitName && v.IsAlive() && (!this.bIgnoreSource || (this.bIgnoreSource && v != this.Source)) && nozCheck && zCheck) {
                            let time = this.rehit[v.entindex()];
                            if (time == undefined || curTime > time) {
                                let test = false;
                                if (this.UnitTest) {
                                    test = this.UnitTest.runWith([this, v]);
                                }
                                if (test) {
                                    if (this.OnUnitHit) {
                                        this.OnUnitHit.runWith([this, v]);
                                    }
                                    if (this.UnitBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY) {
                                        ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                                        if (this.OnFinish) {
                                            this.OnFinish.runWith([this, subpos])
                                        }
                                        return;
                                    } else if (this.UnitBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_BOUNCE) {
                                    }
                                    if (this.bMultipleHits) {
                                        this.rehit[v.entindex() + ""] = curTime + this.fRehitDelay;
                                    } else {
                                        this.rehit[v.entindex() + ""] = curTime + 10000;
                                    }
                                }
                            }
                        }
                    }
                    let navConnect = !GridNav.IsTraversable(subpos) || GridNav.IsBlocked(subpos);
                    let ground = GetGroundPosition(subpos, this.Source) + Vector(0, 0, this.fGroundOffset) as Vector;
                    let groundConnect = ground.z > pos.z;
                    if (navConnect) {
                        if (this.bCutTrees || this.TreeBehavior != ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING) {
                            let ents = GridNav.GetAllTreesAroundPoint(subpos, this.radius, this.bTreeFullCollision);
                            for (let i = 0; i < ents.length; i++) {
                                let tree = ents[i];
                                if (!this.bZCheck || (pos.z < ground.z + 280 + radius - this.fGroundOffset && pos.z + radius + this.fGroundOffset > ground.z)) {
                                    if (this.bCutTrees) {
                                        tree.CutDown(this.Source.GetTeamNumber());
                                        navConnect = !GridNav.IsTraversable(subpos) || GridNav.IsBlocked(subpos);
                                    }
                                    if (this.bCutTrees || this.TreeBehavior != ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING) {
                                        if (this.OnTreeHit) {
                                            this.OnTreeHit.runWith([this, tree])
                                        }
                                    }
                                    if (this.TreeBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY) {
                                        ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                                        if (this.OnFinish) {
                                            this.OnFinish.runWith([this, subpos])
                                        }
                                        return;
                                    } else if (this.TreeBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_BOUNCE && this.changes > 0 && curTime >= this.changeTime) {
                                    }
                                }
                            }
                        }
                    }
                    if (this.WallBehavior != ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING && groundConnect) {
                        let normal = CalcNormal(ground, this.Source, 32);
                        if (normal.z < .6) {
                            let vec = Vector(GridNav.GridPosToWorldCenterX(GridNav.WorldToGridPosX(subpos.x)), GridNav.GridPosToWorldCenterY(GridNav.WorldToGridPosY(subpos.y)), ground.z);
                            if (this.OnWallHit) {
                                this.OnWallHit.runWith([this, vec]);
                            }

                            if (this.WallBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY) {
                                ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                                if (this.OnFinish) {
                                    this.OnFinish.runWith([this, subpos]);
                                }
                                return;
                            } else if (this.WallBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_BOUNCE && this.changes > 0 && curTime >= this.changeTime) {
                                normal.z = 0;
                                normal = normal.Normalized();
                                this.SetVelocity(((-2 * vel.Dot(normal) * normal) + vel) * 30 as Vector, subpos);
                                return;
                            }
                        }
                    }
                    if (this.GroundBehavior != ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING && groundConnect) {
                        if (this.GroundBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY) {
                            ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                            if (this.OnGroundHit) {
                                this.OnGroundHit.runWith([this, ground])
                            }
                            if (this.OnFinish) {
                                this.OnFinish.runWith([this, subpos])
                            }
                            return;
                        } else if (this.GroundBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_BOUNCE && this.changes > 0 && curTime >= this.changeTime) {
                            if (this.OnGroundHit) {
                                this.OnGroundHit.runWith([this, ground])
                            }
                            let normal = CalcNormal(ground, this.Source);
                            this.SetVelocity(((-2 * vel.Dot(normal) * normal) + vel) * 30 as Vector, subpos);
                            return;
                        } else if (this.GroundBehavior == ProjectileHelper.ELineProjectBehavior.PROJECTILES_FOLLOW && this.changes > 0 && curTime >= this.changeTime) {
                            let slope = CalcSlope(ground, this.Source, vel);
                            let dir = vel.Normalized();
                            if (dir.z < slope.z && slope.Dot(dir) < 1) {
                                if (this.OnGroundHit) {
                                    this.OnGroundHit.runWith([this, ground])
                                }
                                this.SetVelocity(velLength * 30 * slope as Vector, subpos);
                            }
                            return;
                        }
                    }
                    subpos = pos + vel * (div * index) as Vector;
                    if (this.distanceTraveled + (subpos - pos as Vector).Length() > this.fDistance) {
                        ParticleManager.DestroyParticle(this.id, this.bDestroyImmediate);
                        if (this.OnFinish) {
                            this.OnFinish.runWith([this, subpos])
                        }
                        return;
                    }
                    if (this.bGroundLock) {
                        subpos.z = GetGroundPosition(subpos, this.Source).z + this.fGroundOffset;
                    }
                }
                if (this.bProvidesVision) {
                    if (this.currentFrame == this.visionTick) {
                        AddFOWViewer(this.iVisionTeamNumber, this.pos, this.iVisionRadius, this.fVisionLingerDuration, !this.bFlyingVision);
                        this.currentFrame = 0;
                    } else {
                        this.currentFrame = this.currentFrame + 1;
                    }
                }
                this.radius = radius + this.radiusStep;
                this.prevPos = this.pos;
                this.distanceTraveled = this.distanceTraveled + velLength;
                this.pos = pos + vel as Vector;
                return curTime;
            }

        }
    }

    export function Init() {

    }
}