import { GameServiceConfig } from "../shared/GameServiceConfig";
import { ET } from "../shared/lib/Entity";
import { LogHelper } from "./LogHelper";

export module NetTablesHelper {
    /**
     * @Both
     * @param entityid npc的entityid，不要用ability的entityid,方便清理
     * @returns 
     */
    export function GetDotaEntityData(entityid: EntityIndex | string, extkey = "") {
        let _tablename = GameServiceConfig.ENetTables.dotaentity as never;
        entityid += "";
        let olddata = (CustomNetTables.GetTableValue(_tablename, entityid) || {}) as { [key: string]: any };
        if (extkey && extkey.length > 0) {
            return olddata[extkey];
        }
        return olddata;
    }
    /**
     * @Server
     * @param entityid npc的entityid，不要用ability的entityid,方便清理
     * @param data 
     * @returns 
     */
    export function SetDotaEntityData(entityid: EntityIndex | string, data: { [key: string]: any }, extkey = "") {
        let _tablename = GameServiceConfig.ENetTables.dotaentity as never;
        entityid += "";
        let olddata = (CustomNetTables.GetTableValue(_tablename, entityid) || {}) as { [key: string]: any };
        if (extkey && extkey.length > 0) {
            olddata[extkey] = data;
        }
        else {
            olddata = Object.assign(olddata, data);
        }
        return (CustomNetTables.SetTableValue(_tablename, entityid, olddata as never));
    }
    /**
     * @Server
     * @param entityid 
     */
    export function ClearDotaEntityData(entityid: EntityIndex | string) {
        if (IsServer()) {
            let _tablename = GameServiceConfig.ENetTables.dotaentity as never;
            entityid += "";
            if (CustomNetTables.GetTableValue(_tablename, entityid) != null) {
                CustomNetTables.SetTableValue(_tablename, entityid, null as never);
            }
        }
    }

    /**
     * 获取表
     * @param tablename
     * @param key
     * @returns
     */
    export function GetData(tablename: GameServiceConfig.ENetTables, key: string) {
        let _tablename = tablename as never;
        return (CustomNetTables.GetTableValue(_tablename, key) || {}) as any;
    }
    export function SetData<T>(tablename: GameServiceConfig.ENetTables, key: string, data: T) {
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
        let jsonobj = NetTablesHelper.GetData(GameServiceConfig.ENetTables.etentity, obj.InstanceId);
        if (GameServiceConfig.NetTableSaveDataAsSring) {
            jsonobj = json.decode(jsonobj._)[0];
            if (!jsonobj) { return }
        }
        let new_data = obj.toJsonPartObject(props);
        for (let k in new_data) {
            jsonobj[k] = new_data[k];
        }
        // let event: JS_TO_LUA_DATA = {};
        // event.state = true;
        // event.data = { instanceId: obj.InstanceId, props: props, nettable: "" };
        const data = GameServiceConfig.NetTableSaveDataAsSring ? { _: json.encode(jsonobj) } : jsonobj;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            obj.AddNetTableKey(GameServiceConfig.ENetTables.etentity);
            NetTablesHelper.SetData(GameServiceConfig.ENetTables.etentity, obj.InstanceId, data);
            // event.data.nettable = GameServiceConfig.ENetTables.etentity;
            // EventHelper.fireProtocolEventToClient(GameEnum.CustomProtocol.push_update_nettable_partprop_etentity, event);
        } else {
            playerID.forEach((_id) => {
                let nettable = GetETEntityNetTableName(_id);
                obj.AddNetTableKey(nettable);
                NetTablesHelper.SetData(nettable, obj.InstanceId, data);
                // event.data.nettable = nettable;
                // EventHelper.fireProtocolEventToPlayer(GameEnum.CustomProtocol.push_update_nettable_partprop_etentity, event, _id as PlayerID);
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
        let jsonobj = obj.toJsonObject(ignoreChild);
        if (obj.Parent && obj.Parent.InstanceId) {
            jsonobj._p_instanceid = obj.Parent.InstanceId;
        }
        // let event: JS_TO_LUA_DATA = {};
        // event.state = true;
        // event.data = { instanceId: obj.InstanceId, nettable: "" };
        const data = GameServiceConfig.NetTableSaveDataAsSring ? { _: json.encode(jsonobj) } : jsonobj;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            // event.data.nettable = GameServiceConfig.ENetTables.etentity;
            obj.AddNetTableKey(GameServiceConfig.ENetTables.etentity);
            NetTablesHelper.SetData(GameServiceConfig.ENetTables.etentity, obj.InstanceId, data);
            // EventHelper.fireProtocolEventToClient(GameEnum.CustomProtocol.push_update_nettable_etentity, event);
        } else {
            playerID.forEach((_id) => {
                let nettable = GetETEntityNetTableName(_id);
                // event.data.nettable = nettable;
                obj.AddNetTableKey(nettable);
                NetTablesHelper.SetData(nettable, obj.InstanceId, data);
                // EventHelper.fireProtocolEventToPlayer(GameEnum.CustomProtocol.push_update_nettable_etentity, event, _id as PlayerID);
            });
        }
    }

    export function GetETEntityNetTableName(playerid: PlayerID = null): GameServiceConfig.ENetTables {
        if (playerid == null) {
            return GameServiceConfig.ENetTables.etentity;
        }
        switch (playerid) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return GameServiceConfig.ENetTables.etentity + playerid as any;
        }
        LogHelper.error("miss playerId =>", playerid);
    }
}
