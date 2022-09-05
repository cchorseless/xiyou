import { registerET } from "../../../libs/Entity";
import { TItem } from "../bag/TItem";

export enum EEquipPropSlot {
    MinSlot = 0,

    MaxSlot = 5,
}

@registerET()
export class TEquipItem extends TItem {
    public Props: string[];
}