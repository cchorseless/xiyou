import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TServerZone } from "../serverzone/TServerZone";

@registerET()
export class ServerZoneBuffComponent extends ET.Component {
    private _GlobalBuffs: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get GlobalBuffs() {
        return this._GlobalBuffs;
    }
    public set GlobalBuffs(data: Dictionary<number, string>) {
        this._GlobalBuffs.clear();
        for (let _d of data as any) {
            this._GlobalBuffs.add(_d[0], _d[1]);
        }
    }
    public get ServerZone() { return this.GetParent<TServerZone>(); }
    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
        }
    }
}
