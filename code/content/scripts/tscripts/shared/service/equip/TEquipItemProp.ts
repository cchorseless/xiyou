import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TEquipItemProp extends ET.Entity {


    @serializeETProps()
    public PropQuality: number;
    @serializeETProps()
    public PropId: number;
    @serializeETProps()
    public PropName: string;
    @serializeETProps()
    public PropValue: number;
    @serializeETProps()
    public PropMin: number;
    @serializeETProps()
    public PropMax: number;

}