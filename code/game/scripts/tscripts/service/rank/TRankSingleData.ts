import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class TRankSingleData extends ET.Entity {
    public Score: number;
    public RankIndex: number;
    public CharacterId: string;
}