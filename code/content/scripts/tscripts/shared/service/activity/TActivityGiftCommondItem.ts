import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TActivityGiftCommondItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: string;
    @serializeETProps()
    public GiftCost: number;
    @serializeETProps()
    public GiftMax: number;
    @serializeETProps()
    public Des: string;
    @serializeETProps()
    public IsShowUI: boolean;
}