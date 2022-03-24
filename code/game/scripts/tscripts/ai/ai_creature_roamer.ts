import { LogHelper } from "../helper/LogHelper";

export class ai_creature_roamer {

    // public static awake(entity: BaseNpc_Plus) {
    //     LogHelper.print("ai_creature_roamer");
    //     // -- Defer the initialization to first tick, to allow spawners to set state.
    //     entity.aiState = {
    //         hAggroTarget: null,
    //         flShoutRange: 300,
    //         nWalkingMoveSpeed: 140,
    //         nAggroMoveSpeed: 280,
    //         flAcquisitionRange: 900,
    //         vTargetWaypoint: null
    //     }
    //     entity.SetContextThink("init_think", () => {
    //         entity.SetAcquisitionRange(entity.aiState.flAcquisitionRange)
    //         entity.bIsRoaring = false;
    //         // --Generate nearby waypoints for this unit
    //         let tWaypoints: Vector[] = [];
    //         let nWaypointsPerRoamNode = 10
    //         let nMinWaypointSearchDistance = 0
    //         let nMaxWaypointSearchDistance = 2048

    //         while (tWaypoints.length < nWaypointsPerRoamNode) {
    //             let vWaypoint = (entity.GetAbsOrigin() + RandomVector(RandomFloat(nMinWaypointSearchDistance, nMaxWaypointSearchDistance))) as Vector;
    //             if (GridNav.CanFindPath(entity.GetAbsOrigin(), vWaypoint)) {
    //                 tWaypoints.push(vWaypoint);
    //             }
    //         }
    //         entity.aiState.tWaypoints = tWaypoints
    //         entity.SetContextThink("ai_base_creature.aiThink", () => {
    //             return ai_creature_roamer.aiThink(entity);
    //         }, 0)
    //         return undefined
    //     }, 0)
    // }
    // public static aiThink(entity: BaseNpc_Plus) {
    //     if (!entity.IsAlive()) {
    //         return
    //     }
    //     if (GameRules.IsGamePaused()) {
    //         return 0.1
    //     }
    //     if (ai_creature_roamer.CheckIfHasAggro(entity)) {
    //         return RandomFloat(0.5, 1.5)
    //     }
    //     return ai_creature_roamer.RoamBetweenWaypoints(entity)
    // }

    // public static CheckIfHasAggro(entity: BaseNpc_Plus) {
    //     if (entity.GetAggroTarget() != null) {
    //         entity.SetBaseMoveSpeed(entity.aiState.nAggroMoveSpeed)
    //         if (entity.GetAggroTarget() != entity.aiState.hAggroTarget) {
    //             entity.aiState.hAggroTarget = entity.GetAggroTarget()
    //             ai_creature_roamer.ShoutInRadius(entity)

    //         }
    //         let existingParticle = entity.Attribute_GetIntValue("particleID", -1)
    //         if (existingParticle == -1) {
    //             let nAggroParticleID = ParticleManager.CreateParticle("particles/items2_fx/mask_of_madness.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, entity)
    //             ParticleManager.SetParticleControlEnt(nAggroParticleID, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, entity, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "follow_overhead", entity.GetAbsOrigin(), true)
    //             entity.Attribute_SetIntValue("particleID", nAggroParticleID)
    //         }
    //         if (entity.bIsRoaring) {
    //             ai_creature_roamer.PlayRoarSound(entity)
    //         }
    //         return true
    //     }
    //     else {
    //         let nAggroParticleID = entity.Attribute_GetIntValue("particleID", -1) as ParticleID;
    //         if (nAggroParticleID != -1) {
    //             ParticleManager.DestroyParticle(nAggroParticleID, true)
    //             entity.DeleteAttribute("particleID")
    //         }
    //         entity.SetBaseMoveSpeed(entity.aiState.nWalkingMoveSpeed)
    //         entity.bIsRoaring = false
    //         return false
    //     }

    // }
    // public static PlayRoarSound(entity: BaseNpc_Plus) {
    //     if (entity.GetUnitName() == "npc_dota_creature_zombie"
    //         || entity.GetUnitName() == "npc_dota_creature_zombie_crawler") {
    //         EmitSoundOn("Zombie.Roar", entity)
    //     }
    //     else if (entity.GetUnitName() == "npc_dota_creature_bear"
    //         || entity.GetUnitName() == "npc_dota_creature_bear_large") {
    //         EmitSoundOn("Bear.Roar", entity)
    //     }
    //     entity.bIsRoaring = true
    // }



    // public static ShoutInRadius(entity: BaseNpc_Plus) {
    //     let tNearbyCreatures = Entities.FindAllByClassnameWithin("npc_dota_creature", entity.GetOrigin(), entity.aiState.flShoutRange)
    //     for (let _hCreature of tNearbyCreatures) {
    //         let hCreature = _hCreature as CDOTA_BaseNPC
    //         if (hCreature.GetAggroTarget() == null) { //-- only set new attack target on the creature if it doesn't already have an aggro target
    //             hCreature.MoveToTargetToAttack(entity.aiState.hAggroTarget)
    //         }
    //     }
    // }



    // public static RoamBetweenWaypoints(entity: BaseNpc_Plus) {
    //     let gameTime = GameRules.GetGameTime()
    //     let aiState = entity.aiState
    //     if (aiState.vWaypoint != null) {
    //         let flRoamTimeLeft = aiState.flNextWaypointTime - gameTime
    //         if (flRoamTimeLeft <= 0) {
    //             aiState.vWaypoint = null
    //         }
    //     }
    //     if (aiState.vWaypoint == null) {
    //         aiState.vWaypoint = aiState.tWaypoints[RandomInt(1, aiState.tWaypoints.length)]
    //         aiState.flNextWaypointTime = gameTime + RandomFloat(2, 4)
    //         entity.MoveToPositionAggressive(aiState.vWaypoint)
    //     }
    //     return RandomFloat(0.5, 1.0)
    // }
}