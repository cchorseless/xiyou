import { ET } from "../../lib/Entity";


@GReloadable
export class SeedRandomComponent extends ET.Component {


    BeginSeed: number;
    Seed: number;
    SeedCount: number;
    onSerializeToEntity() {
    }
    onReload() {
    }
}
