import { ET, registerET } from "../../../libs/Entity";
import { TRankCommon } from "./TRankCommon";

@registerET()
export class TRankHeroBattleScore extends TRankCommon {
    public HeroConfigId: number;
}