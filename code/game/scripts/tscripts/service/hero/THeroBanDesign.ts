import { ET } from "../../rules/Entity/Entity";
import { reloadable } from "../../GameCache";

@reloadable
export class THeroBanDesign extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public Slot: number;
    public BanConfigInfo: number[];
}