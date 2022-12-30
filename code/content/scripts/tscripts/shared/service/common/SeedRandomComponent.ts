import { ET } from "../../lib/Entity";


@GReloadable
export class SeedRandomComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;

    BeginSeed: number;
    Seed: number;
    SeedCount: number;
    onSerializeToEntity() {
    }
    onReload() {
    }
}
