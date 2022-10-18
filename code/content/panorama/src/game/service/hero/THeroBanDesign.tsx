import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class THeroBanDesign extends ET.Entity {
    public Slot: number;
    public BanConfigInfo: number[];
}