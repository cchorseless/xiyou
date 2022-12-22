import { reloadable } from "../../GameCache";
import Dictionary from "../../helper/DataContainerHelper";
import { ET, serializeETProps } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";

@reloadable
export class ServerZoneActivityComponent extends ET.Component {
    @serializeETProps()
    private _Activity: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Activity() {
        return this._Activity;
    }
    public set Activity(data: Dictionary<number, string>) {
        this._Activity.copyData((data as any)[0], (data as any)[1]);

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
        GGameEntityRoot.GetInstance().SyncClientEntity(this, true);
    }
}
