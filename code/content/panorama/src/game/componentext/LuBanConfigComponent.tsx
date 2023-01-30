import { Base64 } from 'js-base64';
import { GameServiceConfig } from '../../../../scripts/tscripts/shared/GameServiceConfig';
import { RefreshConfig } from '../../../../scripts/tscripts/shared/Gen/JsonConfig';
import { ET } from "../../../../scripts/tscripts/shared/lib/Entity";
import { FuncHelper } from '../../helper/FuncHelper';
import { NetHelper } from '../../helper/NetHelper';


@GReloadable
export class LuBanConfigComponent extends ET.Component {
    onSerializeToEntity() {
        this.onReload()
    }
    private _ClientSyncConfig = new GDictionary<
        string,
        string
    >();
    public get ClientSyncConfig() {
        return this._ClientSyncConfig;
    }

    public set ClientSyncConfig(data) {
        this._ClientSyncConfig.copy(data);
    }

    onReload() {
        let obj: { [l: string]: any } = {};
        const zlib = (GameUI.CustomUIConfig() as any).Zlib as typeof Zlib;
        this.ClientSyncConfig.forEach((k, v) => {
            try {
                const _config = NetHelper.GetTableValue(GameServiceConfig.ENetTables.sheetconfig, k) || {};
                if (_config._) {
                    const _str = new zlib.Inflate(Base64.toUint8Array(_config._)).decompress() as any;
                    let dataString = FuncHelper.Utf8ArrayToStr(_str);
                    obj[k] = GFromJson(dataString);
                }
            }
            catch (e) {
                GLogHelper.error(e);
            }

        })
        RefreshConfig(obj);
    }
}
