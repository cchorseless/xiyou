import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";

@registerET()
export class ServerZoneShopComponent extends ET.Component {

    private _ShopUnit: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get ShopUnit() {
        return this._ShopUnit;
    }
    public set ShopUnit(data: Dictionary<number, string>) {
        this._ShopUnit.clear();
        for (let _d of data as any) {
            this._ShopUnit.add(_d[0], _d[1]);
        }
    }
    public get ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }


    onSerializeToEntity() {
    }
}
