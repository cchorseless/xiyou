import { ET } from "../../../libs/Entity";

export class PlayerCreateUnitEntityRoot extends ET.Entity {
    Playerid: PlayerID;
    ConfigID: string;
    EntityId: EntityIndex;
}