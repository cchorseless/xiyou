import { Base64 } from 'js-base64';
import { RefreshConfig } from '../../../../scripts/tscripts/shared/Gen/JsonConfig';
import { ET } from "../../../../scripts/tscripts/shared/lib/Entity";


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
        this.ClientSyncConfig.forEach((k, v) => {
            const zlib = (GameUI.CustomUIConfig() as any).Zlib as typeof Zlib;
            try {
                const _str = new zlib.Inflate(Base64.toUint8Array(v)).decompress() as any;
                let dataString = String.fromCharCode.apply(null, _str);
                obj[k] = GFromJson(dataString);

            }
            catch (e) {
                GLogHelper.error(e);
            }

        })
        RefreshConfig(obj);
    }
}
