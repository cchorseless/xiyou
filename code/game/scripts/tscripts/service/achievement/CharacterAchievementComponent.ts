import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterAchievementComponent extends ET.Component {
    private _Achievements: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Achievements() {
        return this._Achievements;
    }
    public set Achievements(data: Dictionary<number, string>) {
        this._Achievements.clear();
        for (let _d of data as any) {
            this._Achievements.add(_d[0], _d[1]);
        }
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
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
