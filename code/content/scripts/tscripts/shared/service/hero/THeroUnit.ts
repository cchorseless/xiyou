import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterBuffComponent } from "../buff/CharacterBuffComponent";



@GReloadable
export class THeroUnit extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;

    @serializeETProps()
    public Level: number;
    @serializeETProps()
    public Exp: number;
    @serializeETProps()
    public TotalExp: number;
    @serializeETProps()
    public BattleScore: number;

    public get BuffComp(): CharacterBuffComponent { return this.GetParent<CharacterBuffComponent>(); }

    onSerializeToEntity() {

    }
}
