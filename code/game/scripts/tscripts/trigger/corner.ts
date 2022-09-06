import { LogHelper } from "../helper/LogHelper";
import { BaseNpc_Plus } from "../npc/entityPlus/BaseNpc_Plus";
import { EnemyMoveComponent } from "../rules/Components/Enemy/EnemyMoveComponent";

interface ITriggerParam {
    activator: CBaseEntity | undefined;
    caller: CBaseEntity | undefined;
}
function _OnStartTouch(this: void, param: ITriggerParam): void {
    let hUnit = param.activator as BaseNpc_Plus;
    if (hUnit.ETRoot!= null) {
        let move = hUnit.ETRoot.GetComponent(EnemyMoveComponent);
        if (move != null) {
            let myway = move.getMoveWay();
            let cornerName = param.caller.GetName();
            if (myway.indexOf(cornerName) > -1) {
                move.CornerTurning(cornerName);
            }
        }
    }
}

OnStartTouch = _OnStartTouch;
