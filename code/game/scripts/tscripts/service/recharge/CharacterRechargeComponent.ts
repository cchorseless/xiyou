import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterRechargeComponent extends ET.Component {
    public TotalCharge: number;
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
    }
}