import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { reloadable } from "../../GameCache";

@reloadable
export class TRankSingleData extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public Score: number;
    public RankIndex: number;
    public CharacterId: string;
}