import { GameEnum } from "../shared/GameEnum";
import { ET } from "../rules/Entity/Entity";
import { EventHelper } from "./EventHelper";
import { LogHelper } from "./LogHelper";
import { GameStateConfig } from "../shared/GameStateConfig";

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

    export function SetETEntityPart(belongPlayerId: PlayerID, obj: ET.Entity, props: string[], ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        if (obj.IsDisposed()) {
            return;
        }
        let data = NetTablesHelper.GetData(ENetTables.etentity, obj.InstanceId);
        if (GameStateConfig.NetTableSaveDataAsSring) {
            data = json.decode(data)[0];
            if (!data) { return }
        }
        let new_data = obj.toJsonPartObject(props);
        for (let k in new_data) {
            data[k] = new_data[k];
        }
        data._playerid = belongPlayerId;
        // let event: JS_TO_LUA_DATA = {};
        // event.state = true;
        // event.data = { instanceId: obj.InstanceId, props: props, nettable: "" };
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            NetTablesHelper.SetData(ENetTables.etentity, obj.InstanceId, GameStateConfig.NetTableSaveDataAsSring ? json.encode(data) : data);
            // event.data.nettable = ENetTables.etentity;
            // EventHelper.fireProtocolEventToClient(GameEnum.CustomProtocol.push_update_nettable_partprop_etentity, event);
        } else {
            playerID.forEach((_id) => {
                let nettable = GetETEntityNetTableName(_id);
                NetTablesHelper.SetData(nettable, obj.InstanceId, GameStateConfig.NetTableSaveDataAsSring ? json.encode(data) : data);
                // event.data.nettable = nettable;
                // EventHelper.fireProtocolEventToPlayer(GameEnum.CustomProtocol.push_update_nettable_partprop_etentity, event, _id as PlayerID);
            });
        }
    }
    export function SetShareETEntity(obj: ET.Entity, ignoreChild: boolean = false) {
        SetETEntity(-1, obj, ignoreChild);
    }

    export function SetETEntity(belongPlayerId: PlayerID, obj: ET.Entity, ignoreChild: boolean = false, ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        if (obj == null || obj.IsDisposed()) {
            return;
        }
        let jsonobj = obj.toJsonObject(ignoreChild);
        jsonobj._playerid = belongPlayerId;
        if (obj.Parent && obj.Parent.InstanceId) {
            jsonobj._p_instanceid = obj.Parent.InstanceId;
        }
        // let event: JS_TO_LUA_DATA = {};
        // event.state = true;
        // event.data = { instanceId: obj.InstanceId, nettable: "" };
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            // event.data.nettable = ENetTables.etentity;
            NetTablesHelper.SetData(ENetTables.etentity, obj.InstanceId, GameStateConfig.NetTableSaveDataAsSring ? json.encode(jsonobj) : jsonobj);
            // EventHelper.fireProtocolEventToClient(GameEnum.CustomProtocol.push_update_nettable_etentity, event);
        } else {
            playerID.forEach((_id) => {
                let nettable = GetETEntityNetTableName(_id);
                // event.data.nettable = nettable;
                NetTablesHelper.SetData(nettable, obj.InstanceId, GameStateConfig.NetTableSaveDataAsSring ? json.encode(jsonobj) : jsonobj);
                // EventHelper.fireProtocolEventToPlayer(GameEnum.CustomProtocol.push_update_nettable_etentity, event, _id as PlayerID);
            });
        }
    }
    export function DelETEntity(obj: ET.Entity, ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        if (obj == null || obj.IsDisposed()) {
            return;
        }
        if (!NetTablesHelper.GetData(ENetTables.etentity, obj.InstanceId)) {
            return;
        }
        // let event: JS_TO_LUA_DATA = {};
        // event.state = true;
        // event.data = { instanceId: obj.InstanceId, nettable: "" };;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            NetTablesHelper.SetData(ENetTables.etentity, obj.InstanceId, null);
            // event.data.nettable = ENetTables.etentity;
            // EventHelper.fireProtocolEventToClient(GameEnum.CustomProtocol.push_del_nettable_etentity, event);
        } else {
            playerID.forEach((_id) => {
                let nettable = GetETEntityNetTableName(_id);
                NetTablesHelper.SetData(nettable, obj.InstanceId, null);
                // event.data.nettable = nettable;
                // EventHelper.fireProtocolEventToPlayer(GameEnum.CustomProtocol.push_del_nettable_etentity, event, _id as PlayerID);
            });
        }
    }

    export function GetETEntityNetTableName(playerid: PlayerID = null): ENetTables {
        if (playerid == null) {
            return ENetTables.etentity;
        }
        switch (playerid) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return ENetTables.etentity + playerid as any;
        }
        LogHelper.error("miss playerId =>", playerid);
    }

    export enum ENetTables {
        common = "common",
        etentity = "etentity",
        etentity0 = "etentity0",
        etentity1 = "etentity1",
        etentity2 = "etentity2",
        etentity3 = "etentity3",
        etentity4 = "etentity4",
        etentity5 = "etentity5",
    }
}
