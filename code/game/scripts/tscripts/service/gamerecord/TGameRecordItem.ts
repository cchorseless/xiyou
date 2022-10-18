import { ET } from "../../rules/Entity/Entity";
import { TServerZone } from "../serverzone/TServerZone";
import { reloadable } from "../../GameCache";

@reloadable
export class TGameRecordItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public Players: string[];

    onSerializeToEntity() {
        let serverzone = ET.EntityEventSystem.GetEntity(this.Id + "TServerZone") as TServerZone;
        if (serverzone != null && serverzone.GameRecordComp() != null) {
            serverzone.GameRecordComp().addRecord(this);
        }
    }
}