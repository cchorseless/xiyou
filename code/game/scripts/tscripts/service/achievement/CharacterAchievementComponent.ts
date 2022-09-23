import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterAchievementComponent extends ET.Component {
    @serializeETProps()
    private _Achievements: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Achievements() {
        return this._Achievements;
    }
    public set Achievements(data: Dictionary<number, string>) {
        this._Achievements.copyData((data as any)[0], (data as any)[1]);
    }
    public Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }
}
