import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { reloadable } from "../../GameCache";


@reloadable
export class CharacterMailComponent extends ET.Component {
    public MaxSize: number;
    public LastMailId: string;
    public Mails: string[];

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
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
