import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterActivityComponent extends ET.Component {
    @serializeETProps()
    private _ActivityData: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get ActivityData() {
        return this._ActivityData;
    }
    public set ActivityData(data: Dictionary<number, string>) {
        this._ActivityData.copyData((data as any)[0], (data as any)[1]);
    }
    public Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }
}
