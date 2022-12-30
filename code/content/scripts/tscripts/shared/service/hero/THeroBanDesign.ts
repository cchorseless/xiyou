import { ET } from "../../lib/Entity";


@GReloadable
export class THeroBanDesign extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public Slot: number;
    public BanConfigInfo: number[];
}