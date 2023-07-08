import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TPayOrderItem extends ET.Entity {
    @serializeETProps()
    Account: string;
    @serializeETProps()
    State: number[] = [];
    @serializeETProps()
    ItemConfigId: number;
    @serializeETProps()
    ItemCount: number;
    @serializeETProps()
    ErrorMsg: string;
    onGetBelongPlayerid() {
        const all = GTCharacter.GetAllInstance();
        for (let character of all) {
            if (character.Name == this.Account) {
                return character.BelongPlayerid;
            }
        }
        return -1;
    }
    onSerializeToEntity() {
        this.onReload();
    }
    onReload() {
        this.SyncClient(true);
    }
}
