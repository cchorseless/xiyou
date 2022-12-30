
import { ET } from "../../lib/Entity";


@GReloadable
export class TRankSingleData extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public Score: number;
    public RankIndex: number;
    public CharacterId: string;
}