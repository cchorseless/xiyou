
import { TActivityData } from "./TActivityData";
import { reloadable } from "../../GameCache";

@reloadable
export class TActivityHeroRecordLevelData extends TActivityData {

    public ItemGetRecord: number[];
    public HeroSumLevel: number;
}