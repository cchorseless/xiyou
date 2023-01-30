import { ET, ETEntitySystem, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";


@GReloadable
export class TGameRecordItem extends ET.Entity {

    @serializeETProps()
    public Players: string[];

    onSerializeToEntity() {
        let serverzone = ETEntitySystem.GetEntity(this.Id + "TServerZone") as TServerZone;
        if (serverzone != null && serverzone.GameRecordComp != null) {
            serverzone.GameRecordComp.addRecord(this);
        }
    }
}