
import { ET } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";


@GReloadable
export class ServerZoneShopComponent extends ET.Component {

    private _ShopUnit = new GDictionary<
        number,
        string
    >();
    public get ShopUnit() {
        return this._ShopUnit;
    }
    public set ShopUnit(data) {
        this._ShopUnit.copy(data);

    }
    public ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }


    onSerializeToEntity() {
        let serverzone = ET.EntitySystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.SyncClient(true);
    }
}
