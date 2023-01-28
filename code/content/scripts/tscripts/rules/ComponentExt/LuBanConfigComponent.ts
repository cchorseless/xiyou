import { ToBase64 } from "../../lib/Base64";
import { CompressZlib } from "../../lib/zlib";
import { RefreshConfig } from "../../shared/Gen/JsonConfig";
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
            let _str2 = ToBase64(CompressZlib(v));
            this.ClientSyncConfig.add(k, _str2);
        })
        RefreshConfig(obj);
        this.SyncClient();
    }
}
