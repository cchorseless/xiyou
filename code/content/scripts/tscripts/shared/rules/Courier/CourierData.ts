import { ET, serializeETProps } from "../../lib/Entity";

export class CourierData extends ET.Component {
    @serializeETProps()
    health: number = 100;
    @serializeETProps()
    maxHealth: number = 100;
    @serializeETProps()
    steamID: string;
    @serializeETProps()
    damage: number = 0;

}