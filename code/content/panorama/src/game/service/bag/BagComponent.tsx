import { EEnum } from "../../../../../../game/scripts/tscripts/shared/Gen/Types";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";
import { TItem } from "./TItem";

@registerET()
export class BagComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

    public Items: string[];
    public MaxSize: number;
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }

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
