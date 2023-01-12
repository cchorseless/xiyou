import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class THeroBanDesign extends ET.Entity {


    @serializeETProps()
    public Slot: number;
    @serializeETProps()
    public BanConfigInfo: number[];
}