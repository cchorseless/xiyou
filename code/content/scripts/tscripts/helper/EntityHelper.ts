import { GameFunc } from "../GameFunc";

export module EntityHelper {

    /**
      * 检查是否是第一次创建
      */
    export function checkIsFirstSpawn(hTarget: IBaseNpc_Plus) {
        let r = hTarget.__bIsFirstSpawn
        if (!r) {
            hTarget.__bIsFirstSpawn = true;
            return true
        }
        else {
            return false
        }
    };


    /**
     * 回复怒气
     * @param hCaster
     * @param n
     */
    export function ModifyEnergy(hCaster: IBaseNpc_Plus, n: number) {

    }



    export namespace ItemFunc {

        /**
         * 扔东西到对象附近
         * @param hDropUnit
         * @param item
         * @param hTargetUnit
         * @returns
         */
        export function DropItemAroundUnit(hDropUnit: IBaseNpc_Plus, item: IBaseItem_Plus, hTargetUnit: IBaseNpc_Plus) {
            if (!GameFunc.IsValid(hDropUnit)) {
                return
            }
            if (!GameFunc.IsValid(hTargetUnit)) {
                hTargetUnit = hDropUnit
            }
            hDropUnit.TakeItem(item)
            CreateItemOnPositionRandom(hTargetUnit.GetAbsOrigin(), item)
        }


        export function CreateItemOnPosition(position: Vector, item: IBaseItem_Plus) {
            let hContainer = CreateItemOnPositionForLaunch(position, item)
            //  let iTier = DotaTD.GetNeutralItemTier(item.GetName())
            //  if ( iTier != -1 ) {
            //  	hContainer.SetMaterialGroup(tostring(iTier))
            //  }
            return hContainer
        }

        /**
         * 在地面创建道具
         * @param vCenter
         * @param hItem
         * @returns
         */
        export function CreateItemOnPositionRandom(vCenter: Vector, hItem: IBaseItem_Plus) {
            let vPosition = (vCenter + RandomVector(125)) as Vector
            let hContainer = CreateItemOnPositionForLaunch(vPosition, hItem)
            return hContainer
        }


    }


}