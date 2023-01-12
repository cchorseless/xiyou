
import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityHeroRecordLevelData extends TActivityData {

    @serializeETProps()
    public ItemGetRecord: number[];
    @serializeETProps()
    public HeroSumLevel: number;
}