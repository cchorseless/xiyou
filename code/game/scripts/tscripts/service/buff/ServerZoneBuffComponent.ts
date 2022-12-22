import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TServerZone } from "../serverzone/TServerZone";
import { reloadable } from "../../GameCache";

@reloadable
export class ServerZoneBuffComponent extends ET.Component {
    private _GlobalBuffs: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get GlobalBuffs() {
        return this._GlobalBuffs;
    }
    public set GlobalBuffs(data: Dictionary<number, string>) {
        this._GlobalBuffs.copyData((data as any)[0], (data as any)[1]);

    }
    public get ServerZone() { return this.GetParent<TServerZone>(); }
    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        GGameEntityRoot.GetInstance().SyncClientEntity(this, true);
    }
}
