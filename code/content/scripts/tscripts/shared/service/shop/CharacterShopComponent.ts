
import { ET, serializeETProps } from "../../lib/Entity";


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
    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
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
