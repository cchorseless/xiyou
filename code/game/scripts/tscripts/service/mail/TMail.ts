import { ET, registerET } from "../../rules/Entity/Entity";

export enum EMailState {
    Read = 1,
    UnRead = 2,
    ItemGet = 4,
    UnItemGet = 8,
}

@registerET()
export class TMail extends ET.Entity {
    public Title: number;
    public Content: number;
    public State: number[];
    public From: string;
    public FromDes: string;
    public To: string[];
    public ToDes: string;
    public Time: string;
    public ValidTime: number;

    public Items: { Item1: number, Item2: number }[];
}