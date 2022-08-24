import { ET, registerET } from "../../rules/Entity/Entity";
import { CharacterBuffComponent } from "../buff/CharacterBuffComponent";

@registerET()
export class THeroUnit extends ET.Entity {
    public ConfigId: number;

    public Level: number;
    public Exp: number;
    public TotalExp: number;
    public BattleScore: number;

    public get BuffComp(): CharacterBuffComponent { return this.GetParent<CharacterBuffComponent>(); }

    onSerializeToEntity() {

    }
}
