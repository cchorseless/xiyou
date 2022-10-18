
import { TItem } from "../bag/TItem";
import { reloadable } from "../../GameCache";

export enum EEquipPropSlot {
    MinSlot = 0,

    MaxSlot = 5,
}

@reloadable
export class TEquipItem extends TItem {
    public Props: string[];
}