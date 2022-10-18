import { ET } from "../../rules/Entity/Entity";
import { TRankCommon } from "./TRankCommon";
import { reloadable } from "../../GameCache";

@reloadable
export class TRankHeroBattleScore extends TRankCommon {
    public HeroConfigId: number;
}