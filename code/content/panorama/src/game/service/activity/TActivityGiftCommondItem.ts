import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TActivityGiftCommondItem extends ET.Entity {
    public ConfigId: number;
    public GiftCost: number;
    public GiftMax: number;

}