import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TRankSingleData extends ET.Entity {
    public Score: number;
    public RankIndex: number;
    public CharacterId: string;
}