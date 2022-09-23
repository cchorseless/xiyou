import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterShopComponent extends ET.Component {
    public ShopUnit: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _ShopUnit(data: Dictionary<number, string>) {
        this.ShopUnit.copy(data);
    }

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

}
