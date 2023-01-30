/*
 * @Author: Jaxh
 * @Date: 2021-04-30 13:32:45
 * @LastEditors: your name
 * @LastEditTime: 2021-04-30 15:35:55
 * @Description: file content
 */

interface triggerInfo {
    // 激活
    activator: CDOTA_BaseNPC,
    // 被激活
    caller: CDOTA_BaseNPC
}

@GReloadable
export class TriggerHelper {
    /**
     * 打印对象
     * @param t
     * @param des
     */
    public static Gate_OnStartTouch(trigger: triggerInfo): void {
        let hHero = trigger.activator;
        let thisEntity = trigger.caller;
        let sGateTriggerName = thisEntity.GetName()
        print("Gate_OnStartTouch. " + sGateTriggerName + " activated by " + hHero.GetUnitName())
        // -- Look through the hero's inventory to see if (it's holding the right key
        let bHasKey = false
        for (let i = 0; i < 5; i++) {
            let hItem = hHero.GetItemInSlot(i)
            if (hItem && hItem.GetName() == "item_orb_of_passage") {
                print("Found desired item named " + hItem.GetName() + " on " + hHero.GetUnitName())
                bHasKey = true
            }
        }
        if (bHasKey) {
            let hRelay = Entities.FindByName(null, sGateTriggerName + "_relay")
            hRelay.Trigger()
            print("Triggered relay named " + hRelay.GetName());
            thisEntity.Destroy()
        }

    }

    public static Checkpoint_OnStartTouch(trigger: triggerInfo): void {
        // let hHero = trigger.activator as CDOTA_BaseNPC_Hero;
        // let thisEntity = trigger.caller;
        // let sCheckpointTriggerName = thisEntity.GetName()
        // let hBuilding = Entities.FindByName(null, sCheckpointTriggerName + "_building")
        // // -- If it's already activated, we're done
        // if (hBuilding.GetTeamNumber() == GameData.nGOOD_TEAM) {
        //     return
        // }
        // hBuilding.SetTeam(GameData.nGOOD_TEAM)
        // // GameRules.Addon.RecordActivatedCheckpoint(hHero.GetPlayerID(), sCheckpointTriggerName)
        // if (sCheckpointTriggerName != "checkpoint00") {
        //     GameFunc.BroadcastMessage("Activated " + sCheckpointTriggerName, 3)
        //     EmitGlobalSound("DOTA_Item.Refresher.Activate")// Checkpoint.Activate
        // }
    }
}