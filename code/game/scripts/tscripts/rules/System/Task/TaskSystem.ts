import { TaskComponent } from "../../Components/Task/TaskComponent";

export class TaskSystem {
    static Init() {
        // TaskEventHandler.startListen()
    }
    static readonly AllManager: { [k: string]: TaskComponent } = {};

    public static RegComponent(comp: TaskComponent) {
        TaskSystem.AllManager[comp.PlayerID] = comp;
    }

    public static GetPlayerTask(playerid: PlayerID | number | string) {
        return TaskSystem.AllManager[playerid];
    }

}