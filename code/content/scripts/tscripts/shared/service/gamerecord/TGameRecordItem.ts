import { ET, ETEntitySystem, serializeETProps } from "../../lib/Entity";
import { TServerZone } from "../serverzone/TServerZone";


@GReloadable
export class TGameRecordItem extends ET.Entity {
    static readonly CurRecordID: string;
    static GameRecord(): TGameRecordItem | null {
        if (TGameRecordItem.CurRecordID != null) {
            return TGameRecordItem.GetOneInstanceById(TGameRecordItem.CurRecordID);
        }
        return null;
    }

    @serializeETProps()
    public Players: string[];

    @serializeETProps()
    public RecordInfo: { [playerid: string]: { [k: string]: any } } = {};

    onSerializeToEntity() {
        let serverzone = ETEntitySystem.GetEntity(this.Id + "TServerZone") as TServerZone;
        if (serverzone != null && serverzone.GameRecordComp != null) {
            serverzone.GameRecordComp.addRecord(this);
        }
        this.onReload()
    }


    onReload() {
        this.SyncClient(true, true);
    }

    AddGameRecord(playerid: PlayerID, data: { [k: string]: any }, syncClient = false) {
        this.RecordInfo[playerid + ""] = this.RecordInfo[playerid + ""] || {};

    }


}

declare global {
    var GTGameRecordItem: typeof TGameRecordItem;
}
if (_G.GTGameRecordItem == null) {
    _G.GTGameRecordItem = TGameRecordItem;
}