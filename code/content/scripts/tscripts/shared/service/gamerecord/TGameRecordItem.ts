import { ET, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";


@GReloadable
export class TGameRecordItem extends ET.Entity {

    @serializeETProps()
    public Players: string[];

    onSerializeToEntity() {
        let serverzone = ET.EntitySystem.GetEntity(this.Id + "TServerZone") as TServerZone;
        if (serverzone != null && serverzone.GameRecordComp != null) {
            serverzone.GameRecordComp.addRecord(this);
        }
    }
}