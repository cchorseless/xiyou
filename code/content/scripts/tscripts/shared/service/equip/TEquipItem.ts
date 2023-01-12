
import { serializeETProps } from "../../lib/Entity";
import { TItem } from "../bag/TItem";


export enum EEquipPropSlot {
    MinSlot = 0,

    MaxSlot = 5,
}

@GReloadable
export class TEquipItem extends TItem {
    @serializeETProps()
    public Props: string[];
}