import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class THeroBanDesign extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public Slot: number;
    public BanConfigInfo: number[];
}