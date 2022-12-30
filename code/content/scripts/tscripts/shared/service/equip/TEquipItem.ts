
import { TItem } from "../bag/TItem";


export enum EEquipPropSlot {
    MinSlot = 0,

    MaxSlot = 5,
}

@GReloadable
export class TEquipItem extends TItem {
    public Props: string[];
}