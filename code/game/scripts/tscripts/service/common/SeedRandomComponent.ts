import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { reloadable } from "../../GameCache";

@reloadable
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
