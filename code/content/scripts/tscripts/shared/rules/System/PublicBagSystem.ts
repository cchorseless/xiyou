import { ET, serializeETProps } from "../../lib/Entity";
import { PublicBagConfig } from "../../PublicBagConfig";



export class PublicBagSystem extends ET.SingletonComponent {
    @serializeETProps()
    AllItem: { [key: string]: string } = {};
    IsEmpty() {
        const count = PublicBagConfig.PUBLIC_ITEM_SLOT_MAX - PublicBagConfig.PUBLIC_ITEM_SLOT_MIN + 1
        return Object.values(this.AllItem).length < count;
    }

}