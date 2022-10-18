import { ET, serializeETProps } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { TGameRecordItem } from "./TGameRecordItem";
import { reloadable } from "../../GameCache";

@reloadable
export class CharacterGameRecordComponent extends ET.Component {
    public Records: string[];
    public CurRecordID: string;

    public GetCurGameRecord(): TGameRecordItem {
        if (this.CurRecordID != null) {
            return GameRules.Addon.ETRoot.TServerZone().GameRecordComp().GetChild<TGameRecordItem>(this.CurRecordID);
        }
        return null;
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