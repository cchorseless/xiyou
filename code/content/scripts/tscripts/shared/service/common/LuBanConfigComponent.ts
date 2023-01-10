import { RefreshConfig } from "../../Gen/JsonConfig";
import { ET } from "../../lib/Entity";


@GReloadable
export class LuBanConfigComponent extends ET.Component {

    public ClientSyncConfig: string;
    onSerializeToEntity() {
        this.onReload()
    }

    onReload() {
        let obj: { [l: string]: string };
        if (_CODE_IN_LUA_) {
            //#region LUA
            obj = (_G as any).json.decode(this.ClientSyncConfig)[0];
            for (let key in obj) {
                obj[key] = (_G as any).json.decode(obj[key])[0];
            }
            //#endregion LUA
        }
        else {
            //#region JS
            obj = JSON.parse(this.ClientSyncConfig);
            for (let key in obj) {
                obj[key] = JSON.parse(obj[key])
            }
            //#endregion JS
        }
        RefreshConfig(obj);
        this.SyncClient()
    }
}
