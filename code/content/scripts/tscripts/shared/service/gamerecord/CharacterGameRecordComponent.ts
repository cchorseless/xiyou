import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { TGameRecordItem } from "./TGameRecordItem";


@GReloadable
export class CharacterGameRecordComponent extends ET.Component {
    @serializeETProps()
    public Records: string[];
    @serializeETProps()
    public CurRecordID: string;

    public GetCurGameRecord(): TGameRecordItem | null {
        if (this.CurRecordID != null) {
            return GTServerZone.GetInstance().GameRecordComp.GetChild<TGameRecordItem>(this.CurRecordID);
        }
        return null;
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