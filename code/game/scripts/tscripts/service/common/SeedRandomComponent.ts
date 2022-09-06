import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class SeedRandomComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;

    BeginSeed: number;
    Seed: number;
    SeedCount: number;
    onSerializeToEntity() {
    }
    onReload() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }
}
