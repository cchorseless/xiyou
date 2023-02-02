import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

@registerModifier()
export class modifier_task extends BaseModifier_Plus {
    IsHidden() { return true }
    IsDebuff() { return true }
    IsPurgable() { return false }
    IsPurgeException() { return false }
    IsStunDebuff() { return false }
    AllowIllusionDuplicate() { return false }

    // CheckState() {
    //     return {
    //         [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
    //         // [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
    //         [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
    //     }
    // }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    // GetVision() {
    //     return 0
    // }
    // /**杀怪计数 */
    // @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    // onOtherDeath(event: ModifierInstanceEvent) {
    //     let deathUnit = event.unit;
    //     let entityIndex = deathUnit.entindex();
    //     let playerid = this.GetParentPlus().GetPlayerOwnerID()
    //     let tasklist = TaskSystem.GetPlayerTask(playerid).CheckIsTaskUnit(deathUnit.GetUnitName());
    //     if (tasklist && tasklist.length > 0) {
    //         tasklist.forEach(
    //             (taskid) => {
    //                 // let info = KVHelper.KvServerConfig.task_config[taskid as '1001'];
    //                 // if (tonumber(info.TaskFinishType) == System_Task.Sys_config.TaskFinishType.Kill) {
    //                 //     this.addFrameTimer(1, () => {
    //                 //         EventHelper.fireServerEvent(
    //                 //             GameEnum.CustomServer.onserver_finish_task,
    //                 //             {
    //                 //                 PlayerID: playerid,
    //                 //                 data: {
    //                 //                     taskid: taskid,
    //                 //                     entityIndex: entityIndex,
    //                 //                 }
    //                 //             }
    //                 //         );
    //                 //     })
    //                 // }
    //             }
    //         )
    //     }

    // };
    // /**采集计数 */
    // onCollectFinish(unit: IBaseNpc_Plus) {
    //     let entityIndex = unit.entindex();
    //     let playerid = this.GetParentPlus().GetPlayerOwnerID()
    //     let tasklist = TaskSystem.GetPlayerTask(playerid).CheckIsTaskUnit(unit.GetUnitName());
    //     if (tasklist && tasklist.length > 0) {
    //         tasklist.forEach(
    //             (taskid) => {
    //                 // let info = KVHelper.KvServerConfig.task_config[taskid as '1001'];
    //                 // if (tonumber(info.TaskFinishType) == System_Task.Sys_config.TaskFinishType.Collect) {
    //                 //     this.addFrameTimer(1, () => {
    //                 //         EventHelper.fireServerEvent(
    //                 //             GameEnum.CustomServer.onserver_finish_task,
    //                 //             {
    //                 //                 PlayerID: playerid,
    //                 //                 data: {
    //                 //                     taskid: taskid,
    //                 //                     entityIndex: entityIndex,
    //                 //                 }
    //                 //             }
    //                 //         );
    //                 //     })
    //                 // }
    //             }
    //         )
    //     }
    // };
    // /**收集道具计数-获取 */
    // @registerEvent(Enum_MODIFIER_EVENT.ON_ITEM_GET)
    // onItemGet(e: DotaInventoryItemAddedEvent) {
    //     let entityIndex = e.item_entindex;
    //     let playerid = this.GetParentPlus().GetPlayerOwnerID()
    //     LogHelper.print(e.itemname)
    //     let tasklist = TaskSystem.GetPlayerTask(playerid).CheckIsTaskUnit(e.itemname);
    //     if (tasklist && tasklist.length > 0) {
    //         tasklist.forEach(
    //             (taskid) => {
    //                 // let info = KVHelper.KvServerConfig.task_config[taskid as '1001'];
    //                 // if (tonumber(info.TaskFinishType) == System_Task.Sys_config.TaskFinishType.HasItem) {
    //                 //     this.addFrameTimer(1, () => {
    //                 //         EventHelper.fireServerEvent(
    //                 //             GameEnum.CustomServer.onserver_finish_task,
    //                 //             {
    //                 //                 PlayerID: playerid,
    //                 //                 data: {
    //                 //                     taskid: taskid,
    //                 //                 }
    //                 //             }
    //                 //         );
    //                 //     })
    //                 // }
    //             }
    //         )
    //     }

    // };
    // /**收集道具计数-移除 */
    // @registerEvent(Enum_MODIFIER_EVENT.ON_ITEM_LOSE)
    // onItemLost(e: DotaHeroInventoryItemChangeEvent) {
    //     let entityIndex = e.item_entindex;
    //     let playerid = this.GetParentPlus().GetPlayerOwnerID();
    //     let unit = EntIndexToHScript(entityIndex) as IBaseItem_Plus;
    //     let tasklist = TaskSystem.GetPlayerTask(playerid).CheckIsTaskUnit(unit.GetAbilityName());
    //     if (tasklist && tasklist.length > 0) {
    //         tasklist.forEach(
    //             (taskid) => {
    //                 // let info = KVHelper.KvServerConfig.task_config[taskid as '1001'];
    //                 // if (tonumber(info.TaskFinishType) == System_Task.Sys_config.TaskFinishType.HasItem) {
    //                 //     this.addFrameTimer(1, () => {
    //                 //         EventHelper.fireServerEvent(
    //                 //             GameEnum.CustomServer.onserver_finish_task,
    //                 //             {
    //                 //                 PlayerID: playerid,
    //                 //                 data: {
    //                 //                     taskid: taskid,
    //                 //                 }
    //                 //             }
    //                 //         );
    //                 //     })
    //                 // }
    //             }
    //         )
    //     }

    // }

    // /**道具使用计数 */
    // @registerEvent(Enum_MODIFIER_EVENT.ON_ITEM_USE_FINISH)
    // onItemUse(e: ModifierAbilityEvent) {
    //     let ability = e.ability;
    //     let playerid = this.GetParentPlus().GetPlayerOwnerID()
    //     let tasklist = TaskSystem.GetPlayerTask(playerid).CheckIsTaskUnit(ability.GetAbilityName());
    //     if (tasklist && tasklist.length > 0) {
    //         tasklist.forEach(
    //             (taskid) => {
    //                 // let info = KVHelper.KvServerConfig.task_config[taskid as '1001'];
    //                 // if (tonumber(info.TaskFinishType) == System_Task.Sys_config.TaskFinishType.UseItem) {
    //                 //     this.addFrameTimer(1, () => {
    //                 //         EventHelper.fireServerEvent(
    //                 //             GameEnum.CustomServer.onserver_finish_task,
    //                 //             {
    //                 //                 PlayerID: playerid,
    //                 //                 data: {
    //                 //                     taskid: taskid,
    //                 //                 }
    //                 //             }
    //                 //         );
    //                 //     })
    //                 // }
    //             }
    //         )
    //     }
    // }
};

@registerModifier()
export class modifier_task_npc extends BaseModifier_Plus {
    IsHidden() { return true }
    IsDebuff() { return true }
    IsPurgable() { return false }
    IsPurgeException() { return false }
    IsStunDebuff() { return false }
    AllowIllusionDuplicate() { return false }
    /**收集道具计数，用于上交道具 */
    //     @registerEvent(Enum_MODIFIER_EVENT.ON_ITEM_GET)
    //     onItemGet(e: DotaInventoryItemAddedEvent) {
    //         let item = EntIndexToHScript(e.item_entindex) as IBaseItem_Plus;
    //         let oldowner = item.GetPurchaser() as IBaseNpc_Hero_Plus;
    //         let playerid = oldowner.GetPlayerOwnerID();
    //         // 检查道具是否是任务道具
    //         let tasklist1 = TaskSystem.GetPlayerTask(playerid).CheckIsTaskUnit(e.itemname);
    //         // 检查自己是不是任务关联对象
    //         let tasklist2 = TaskSystem.GetPlayerTask(playerid).CheckIsTaskUnitWith(this.GetParentPlus().GetUnitName());
    //         let tasklist: string[] = [];
    //         // 交集
    //         tasklist2.forEach((s) => { if (tasklist1.indexOf(s) > -1) { tasklist.push(s) } })
    //         if (tasklist && tasklist.length > 0) {
    //             tasklist.forEach(
    //                 (taskid) => {
    //                     // let info = KVHelper.KvServerConfig.task_config[taskid as '1001'];
    //                     // if (tonumber(info.TaskFinishType) == System_Task.Sys_config.TaskFinishType.GiveItem) {
    //                     //     this.addFrameTimer(1, () => {
    //                     //         EventHelper.fireServerEvent(
    //                     //             GameEnum.CustomServer.onserver_finish_task,
    //                     //             {
    //                     //                 PlayerID: playerid,
    //                     //                 data: {
    //                     //                     taskid: taskid,
    //                     //                 }
    //                     //             }
    //                     //         );
    //                     //     })
    //                     // }
    //                 }
    //             )
    //         }

    //     };
}