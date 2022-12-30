import { ET, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";
import { TGameRecordItem } from "./TGameRecordItem";


@GReloadable
export class ServerZoneGameRecordComponent extends ET.Component {
    public Records: string[] = [];

    addRecord(record: TGameRecordItem) {
        this.AddOneChild(record);
        this.Records.push(record.Id);
    }

    public ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }

    onSerializeToEntity() {
        let serverzone = ET.EntitySystem.GetEntity(this.Id + "TServerZone");
        if (serverzone != null) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }

    onReload() {
        this.SyncClient(true);
    }
}