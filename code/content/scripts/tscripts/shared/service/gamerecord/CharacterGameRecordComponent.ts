import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { TGameRecordItem } from "./TGameRecordItem";


@GReloadable
export class CharacterGameRecordComponent extends ET.Component {
    @serializeETProps()
    public Records: string[];
    @serializeETProps()
    public CurRecordID: string;



    get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        if (this.CurRecordID) {
            (TGameRecordItem.CurRecordID as any) = this.CurRecordID;
        }
        this.onReload();
    }
    onReload() {
        this.SyncClient();
    }
    @serializeETProps()
    public ItemUseRecordInfo: { [itemid: string]: number } = {};

    AddItemUseRecord(itemid: string, count: number) {
        if (!this.ItemUseRecordInfo[itemid]) {
            this.ItemUseRecordInfo[itemid] = 0;
        }
        this.ItemUseRecordInfo[itemid] += count;
        this.SyncClient(true);
    }

    GetItemUseRecord(itemid: string) {
        if (!this.ItemUseRecordInfo[itemid]) {
            return 0
        }
        return this.ItemUseRecordInfo[itemid];
    }





}