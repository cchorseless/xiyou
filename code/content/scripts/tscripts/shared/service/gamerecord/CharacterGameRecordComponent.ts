import { ET } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { TGameRecordItem } from "./TGameRecordItem";


@GReloadable
export class CharacterGameRecordComponent extends ET.Component {
    public Records: string[];
    public CurRecordID: string;

    public GetCurGameRecord(): TGameRecordItem | null {
        if (this.CurRecordID != null) {
            return GTServerZone.GetInstance().GameRecordComp.GetChild<TGameRecordItem>(this.CurRecordID);
        }
        return null;
    }

    get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.SyncClient();
    }
}