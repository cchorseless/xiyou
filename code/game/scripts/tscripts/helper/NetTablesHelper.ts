import { GameEnum } from "../GameEnum";
import { ET } from "../rules/Entity/Entity";
import { EventHelper } from "./EventHelper";

export module NetTablesHelper {
    /**
     * 获取表
     * @param tablename
     * @param key
     * @returns
     */
    export function GetData(tablename: ENetTables, key: string) {
        let _tablename = tablename as never;
        return (CustomNetTables.GetTableValue(_tablename, key) || {}) as any;
    }
    export function SetData<T>(tablename: ENetTables, key: string, data: T) {
        let _tablename = tablename as never;
        CustomNetTables.SetTableValue(_tablename, key, data as never);
    }

    export function SetETEntityPart(obj: ET.Entity, props: string[], ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        if (obj.IsDisposed()) {
            return;
        }
        let data = NetTablesHelper.GetData(ENetTables.etentity, obj.InstanceId);
        let new_data = obj.toJsonPartObject(props);
        for (let k in new_data) {
            data[k] = new_data[k];
        }
        NetTablesHelper.SetData(ENetTables.etentity, obj.InstanceId, data);
        let event: JS_TO_LUA_DATA = {};
        event.state = true;
        event.data = { instanceId: obj.InstanceId, props: props };
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.push_update_nettable_partprop_etentity, event);
        } else {
            playerID.forEach((_id) => {
                EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.push_update_nettable_partprop_etentity, event, _id as PlayerID);
            });
        }
    }
    export function SetETEntity(obj: ET.Entity, ignoreChild: boolean = false, ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        if (obj == null || obj.IsDisposed()) {
            return;
        }
        NetTablesHelper.SetData(ENetTables.etentity, obj.InstanceId, obj.toJsonObject(ignoreChild));
        let event: JS_TO_LUA_DATA = {};
        event.state = true;
        event.data = obj.InstanceId;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.push_update_nettable_etentity, event);
        } else {
            playerID.forEach((_id) => {
                EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.push_update_nettable_etentity, event, _id as PlayerID);
            });
        }
    }

    export enum ENetTables {
        common = "common",
        building = "building",
        enemy = "enemy",
        etentity = "etentity",
    }
}
