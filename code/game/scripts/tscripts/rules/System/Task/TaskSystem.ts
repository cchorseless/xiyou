import { TaskComponent } from "../../Components/Task/TaskComponent";
import { AwalonConfig } from "../Awalon/AwalonConfig";
import { TaskConfig } from "./TaskConfig";
import { TaskState } from "./TaskState";

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

    /**
     * 获取任务数据
     *
     * @param type
     * @param count 任务数量
     * @param RoleType
     * @param Camptype
     * @returns
     */
    static GetTaskByType(type: TaskConfig.TaskType, count: number = 1, RoleType: AwalonConfig.Avalon_RoleType = null, Camptype: AwalonConfig.Avalon_CampType = null) {
        let r = TaskState.allTaskInfo[type];
        if (r == null) return;
        let r_isFirst: string[] = []
        // 只添加任务链
        r.forEach(
            (taskid) => {
                // let info = KVHelper.KvServerConfig.task_config[taskid as "1001"]
                // if (info.LastTask == null) {
                //     r_isFirst.push(taskid)
                // }
            }
        )
        let _r: string[] = [];
        if (RoleType != null) {
            // r_isFirst.forEach((taskid) => {
            //     let info = KVHelper.KvServerConfig.task_config[taskid as "1001"]
            //     if (info.TaskJob == null || info.TaskJob && tonumber(info.TaskJob) == RoleType) {
            //         _r.push(taskid)
            //     }
            // })
        }
        else {
            _r = _r.concat(r);
        }
        let __r: string[] = [];
        if (Camptype != null) {
            _r.forEach((taskid) => {
                // let info = KVHelper.KvServerConfig.task_config[taskid as "1001"]
                // if (info.TaskCamp == null || info.TaskCamp && tonumber(info.TaskCamp) == Camptype) {
                //     __r.push(taskid)
                // }
            })
        }
        else {
            __r = __r.concat(_r);
        }
        let task: any = {};
        let wight = [];
        // for (let taskid of __r) {
        //     let _weight = KVHelper.KvServerConfig.task_config[taskid as "1001"].TaskWeight || 0
        //     wight.push(_weight)
        // }
        // let r_temp = GameFunc.ArrayFunc.RandomArrayByWeight(__r, wight, count)
        // for (let taskid of r_temp) {
        //     let info = KVHelper.KvServerConfig.task_config[taskid as "1001"]
        //     if (RoleType && info.TaskJob && tonumber(info.TaskJob) != RoleType) {
        //         throw new Error('type error')
        //     }
        //     task[taskid] = info
        // }
        return task
    }
}