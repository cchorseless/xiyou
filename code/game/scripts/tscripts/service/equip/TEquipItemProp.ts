import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TEquipItemProp extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public PropQuality: number;
    public PropId: number;
    public PropName: string;
    public PropValue: number;
    public PropMin: number;
    public PropMax: number;

}