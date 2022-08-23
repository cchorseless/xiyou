import { registerET } from "../../rules/Entity/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityHeroRecordLevelData extends TActivityData {

    public ItemGetRecord: number[];
    public HeroSumLevel: number;
}