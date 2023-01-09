import { RefreshConfig } from "../../Gen/JsonConfig";
import { ET } from "../../lib/Entity";


@GReloadable
export class LuBanConfigComponent extends ET.Component {

    public ClientSyncConfig: string;
    onSerializeToEntity() {
        this.onReload()
    }

    onReload() {
        if (_CODE_IN_LUA_) {
            //#region LUA
            const obj = (_G as any).json.decode(this.ClientSyncConfig)[0]
            RefreshConfig(obj);
            //#endregion LUA
        }
        else {
            //#region JS
            const obj = JSON.parse(this.ClientSyncConfig);
            RefreshConfig(obj);
            //#endregion JS
        }
        this.SyncClient()
    }
}
