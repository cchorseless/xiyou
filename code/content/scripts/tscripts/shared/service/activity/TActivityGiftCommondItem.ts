import { ET } from "../../lib/Entity";


@GReloadable
export class TActivityGiftCommondItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public GiftCost: number;
    public GiftMax: number;

}