import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TServerZone } from "../serverzone/TServerZone";

@registerET()
export class ServerZoneBuffComponent extends ET.Component {
    public GlobalBuffs: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _GlobalBuffs(data: Dictionary<number, string>) {
        this.GlobalBuffs.copy(data);
    }
    public get ServerZone() { return this.GetParent<TServerZone>(); }
    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
        }
    }
}
