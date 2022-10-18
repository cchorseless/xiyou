import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";

@registerET()
export class ServerZoneActivityComponent extends ET.Component {

    public Activity: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public set _Activity(data: Dictionary<number, string>) {
        this.Activity.copy(data);
    }
    public get ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }


    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone) {
            serverzone.AddOneComponent(this);
        }
    }
}
