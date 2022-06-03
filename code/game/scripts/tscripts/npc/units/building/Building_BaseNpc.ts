import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";


export interface IBuilding_BaseNpc {
    FindEnemyToAttack?(): BaseNpc_Plus;
    [k:string]:any
}
