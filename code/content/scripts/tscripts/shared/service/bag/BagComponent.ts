import { EEnum } from "../../Gen/Types";
import { ET, serializeETProps } from "../../lib/Entity";
import { TItem } from "./TItem";


@GReloadable
export class BagComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }

    onReload() {
        this.SyncClient();
    }

    @serializeETProps()
    public Items: string[];
    public MaxSize: number;

    getItemByType(itemtype: EEnum.EItemType) {
        let items: TItem[] = [];
        this.Items.forEach(entityid => {
            let entity = this.GetChild<TItem>(entityid);
            if (entity && entity.IsValid && entity.Config && entity.Config.ItemType == itemtype) {
                items.push(entity)
            }
        })
        return items;
    }

}
