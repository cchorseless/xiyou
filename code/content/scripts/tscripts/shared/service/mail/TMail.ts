import { ET, serializeETProps } from "../../lib/Entity";


export enum EMailState {
    Read = 1,
    UnRead = 2,
    ItemGet = 4,
    UnItemGet = 8,
}

@GReloadable
export class TMail extends ET.Entity {


    @serializeETProps()
    public Title: number;
    @serializeETProps()
    public Content: number;
    @serializeETProps()
    public State: number[] = [];
    @serializeETProps()
    public From: string;
    @serializeETProps()
    public FromDes: string;
    @serializeETProps()
    public To: string[];
    @serializeETProps()
    public ToDes: string;
    @serializeETProps()
    public Time: string = "";
    @serializeETProps()
    public ValidTime: number = 0;
    @serializeETProps()
    public IsDelete: boolean = false;
    @serializeETProps()
    public Items: { ItemConfigId: number, ItemCount: number }[];


    CanGetItem() {
        return this.IsDelete == false && this.Items && this.Items.length > 0 && this.State && this.State.includes(EMailState.UnItemGet);
    }

    onReload() {
        this.SyncClient();
    }
}