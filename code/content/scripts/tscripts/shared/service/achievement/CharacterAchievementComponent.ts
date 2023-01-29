

import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";

@GReloadable
export class CharacterAchievementComponent extends ET.Component {
    private _Achievements = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get Achievements() {
        return this._Achievements;
    }
    public set Achievements(data) {
        this._Achievements.copy(data);
    }
    get Character(): TCharacter { return this.GetParent<TCharacter>(); }
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
