import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { TServerZone } from "../serverzone/TServerZone";
import { TGameRecordItem } from "./TGameRecordItem";

@registerET()
export class ServerZoneGameRecordComponent extends ET.Component {
    public Records: string[] = [];

    addRecord(record: TGameRecordItem) {
        this.AddOneChild(record);
        this.Records.push(record.Id);
    }

    public ServerZone(): TServerZone { return this.GetParent<TServerZone>(); }

    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone");
        if (serverzone != null) {
            serverzone.AddOneComponent(this);
            this.onReload();
        }
    }

    onReload() {
        GameRules.Addon.ETRoot.PlayerSystem().SyncClientEntity(this, true);
    }
}