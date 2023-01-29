
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class CharacterShopComponent extends ET.Component {
    private _ShopUnit = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get ShopUnit() {
        return this._ShopUnit;
    }
    public set ShopUnit(data) {
        this._ShopUnit.copy(data);

    }



    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onGetBelongPlayerid() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        this.onReload();
    }
    onReload() {
        this.SyncClient();
    }
}
