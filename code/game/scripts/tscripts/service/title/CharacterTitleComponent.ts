import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { reloadable } from "../../GameCache";

@reloadable
export class CharacterTitleComponent extends ET.Component {
    public DressTitleConfigId: number;

    private _Titles: Dictionary<number, string> = new Dictionary<number, string>();
    public get Titles() {
        return this._Titles;
    }
    public set Titles(data: Dictionary<number, string>) {
        this._Titles.copyData((data as any)[0], (data as any)[1]);
    }

    public get Character(): TCharacter {
        return this.GetParent<TCharacter>();
    }
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
