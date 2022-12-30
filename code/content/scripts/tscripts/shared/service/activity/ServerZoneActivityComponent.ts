

import { ET, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";

@GReloadable
export class ServerZoneActivityComponent extends ET.Component {
    private _Activity = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get Activity() {
        return this._Activity;
    }
    public set Activity(data) {
        this._Activity.copy(data);

    }
    get ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }


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
