import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";
import { reloadable } from "../../GameCache";

@reloadable
export class ServerZoneShopComponent extends ET.Component {

    private _ShopUnit: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get ShopUnit() {
        return this._ShopUnit;
    }
    public set ShopUnit(data: Dictionary<number, string>) {
        this._ShopUnit.copyData((data as any)[0], (data as any)[1]);

    }
    public ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }


    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        GameRules.Addon.ETRoot.PlayerSystem().SyncClientEntity(this, true);
    }
}
