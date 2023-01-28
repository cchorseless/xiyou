import { ET, serializeETProps } from "../../lib/Entity";


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
        let obj: { [l: string]: string } = {};
        GLogHelper.print(this.ClientSyncConfig)
        // this.ClientSyncConfig.forEach((k, v) => {
        //     obj[k] = GFromJson(v);
        // })
        // RefreshConfig(obj);
        // this.SyncClient();
    }
}
