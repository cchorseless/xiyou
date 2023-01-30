
import { ET, ETEntitySystem } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";


@GReloadable
export class ServerZoneBuffComponent extends ET.Component {
    private _GlobalBuffs = new GDictionary<
        number,
        string
    >();
    public get GlobalBuffs() {
        return this._GlobalBuffs;
    }
    public set GlobalBuffs(data) {
        this._GlobalBuffs.copy(data);

    }
    public get ServerZone() { return this.GetParent<TServerZone>(); }
    onSerializeToEntity() {
        let serverzone = ETEntitySystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.SyncClient(true);
    }
}
