import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { ET } from "../../Entity/Entity";
import { TaskConfig } from "../../System/Task/TaskConfig";
import { TaskSystem } from "../../System/Task/TaskSystem";

export class TaskComponent extends ET.Component {

    /**所有玩家任务 */
    allTaskInfo: { [tasktype: string]: any } = {};
    /**所有任务进度 */
    TaskJinDu: { [taskid: string]: number } = {};

    readonly PlayerID: number;

    onAwake() {
        let domain = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).PlayerID = domain.GetPlayerID();
        TaskSystem.RegComponent(this);
    }
    /**
   * 检查是否是任务目标
   * @param unitname
   */
    CheckIsTaskUnit( unitname: string) {
        let alltaskInfo = this.allTaskInfo;
        let r = [];
        if (alltaskInfo != null) {
            for (let tasktype in alltaskInfo) {
                let taskinfo = alltaskInfo[tasktype];
                for (let taskid in taskinfo) {
                    let task = taskinfo[taskid as "1001"];
                    if (task.TaskFinishRequire == unitname) {
                        r.push(taskid)
                    }
                }
            }
        }
        return r;
    }
    /**
     * 检查是否是任务关联目标
     * @param playerid
     * @param unitname
     * @returns
     */
    CheckIsTaskUnitWith( unitname: string) {
        let alltaskInfo = this.allTaskInfo;
        let r = [];
        if (alltaskInfo != null) {
            for (let tasktype in alltaskInfo) {
                let taskinfo = alltaskInfo[tasktype];
                for (let taskid in taskinfo) {
                    let task = taskinfo[taskid as "1001"];
                    if (task.TaskFinishRequireWith && task.TaskFinishRequireWith == unitname) {
                        r.push(taskid)
                    }
                }
            }
        }
        return r;
    }

    /**
     * 获取任务信息
     * @param playerid
     * @param tasktype
     * @returns
     */
    GetPlayerTaskInfo(tasktype: TaskConfig.TaskType) {
        return this.allTaskInfo[tasktype];
    }
}