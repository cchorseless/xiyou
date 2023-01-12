import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TActivityGiftCommondItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public GiftCost: number;
    @serializeETProps()
    public GiftMax: number;

}