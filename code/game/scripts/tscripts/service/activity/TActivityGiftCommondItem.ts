import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TActivityGiftCommondItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public GiftCost: number;
    public GiftMax: number;

}