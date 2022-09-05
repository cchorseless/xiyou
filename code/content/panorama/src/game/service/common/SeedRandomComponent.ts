import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class SeedRandomComponent extends ET.Component {
    BeginSeed: number;
    Seed: number;
    SeedCount: number;
    onSerializeToEntity() {
    }

}
