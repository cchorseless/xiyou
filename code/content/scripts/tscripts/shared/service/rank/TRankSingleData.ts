
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TRankSingleData extends ET.Entity {


    @serializeETProps()
    public Score: number;
    @serializeETProps()
    public RankIndex: number;
    @serializeETProps()
    public CharacterId: string;
}