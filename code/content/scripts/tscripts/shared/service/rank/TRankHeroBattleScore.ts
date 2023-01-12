import { serializeETProps } from "../../lib/Entity";
import { TRankCommon } from "./TRankCommon";


@GReloadable
export class TRankHeroBattleScore extends TRankCommon {
    @serializeETProps()
    public HeroConfigId: number;
}