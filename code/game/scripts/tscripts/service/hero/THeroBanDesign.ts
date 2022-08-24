import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class THeroBanDesign extends ET.Entity {
    public Slot: number;
    public BanConfigInfo: number[];
}