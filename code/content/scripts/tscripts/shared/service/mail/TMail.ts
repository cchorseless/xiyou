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
    public State: number[];
    @serializeETProps()
    public From: string;
    @serializeETProps()
    public FromDes: string;
    @serializeETProps()
    public To: string[];
    @serializeETProps()
    public ToDes: string;
    @serializeETProps()
    public Time: string;
    @serializeETProps()
    public ValidTime: number;
    @serializeETProps()
    public Items: { Item1: number, Item2: number }[];
}