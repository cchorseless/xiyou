import { serializeETProps } from "../../lib/Entity";
import { TRankCommon } from "./TRankCommon";


@GReloadable
export class TRankHeroSumBattleScore extends TRankCommon {
    @serializeETProps()
    public HeroConfigId: number;
}