import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { ToBase64 } from "../../lib/Base64";
import { CompressZlib } from "../../lib/zlib";
import { GameServiceConfig } from "../../shared/GameServiceConfig";
import { ET, serializeETProps } from "../../shared/lib/Entity";



@GReloadable
export class LuBanConfigComponent extends ET.Component {
    onSerializeToEntity() {
        this.onReload()
    }
    private _ClientSyncConfig = new GDictionary<
        string,
        string
    >();
    @serializeETProps()
    public get ClientSyncConfig() {
        return this._ClientSyncConfig;
    }

    public set ClientSyncConfig(data) {
        this._ClientSyncConfig.copy(data);
    }

    onReload() {
        let obj: { [l: string]: any } = {};
        this.ClientSyncConfig.forEach((k, v) => {
            obj[k] = GFromJson(v);
            // let _str2 = ToBase64(CompressZlib(v, { level: 9, strategy: "dynamic", }));
            let _str2 = ToBase64(CompressZlib(v));
            // 存到特定网表，一次一次的写数据，避免过大写不进去;
            NetTablesHelper.SetData(GameServiceConfig.ENetTables.sheetconfig, k, { _: _str2 })
            this.ClientSyncConfig.add(k, "");
        })
        // RefreshConfig(obj);
        this.SyncClient();
    }

}
