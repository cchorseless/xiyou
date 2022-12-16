import { ET } from "./Entity";

export class BaseEntityRoot extends ET.Entity {
    Playerid: PlayerID;
    ConfigID: string;
    EntityId: EntityIndex;
}