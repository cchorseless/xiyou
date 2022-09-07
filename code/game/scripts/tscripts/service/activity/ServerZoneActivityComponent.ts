import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TServerZone } from "../serverzone/TServerZone";

@registerET()
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
        this._Activity.clear();
        for (let _d of data as any) {
            this._Activity.add(_d[0], _d[1]);
        }
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
