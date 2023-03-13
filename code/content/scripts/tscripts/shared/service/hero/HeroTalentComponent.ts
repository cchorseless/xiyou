
import { ET, serializeETProps } from "../../lib/Entity";
import { THeroUnit } from "../hero/THeroUnit";


@GReloadable
export class HeroTalentComponent extends ET.Component {


    @serializeETProps()
    TalentPoint: number;
    @serializeETProps()
    TotalTalentPoint: number;

    @serializeETProps()
    public TalentLearn: number[] = [];


    public get HeroUnit(): THeroUnit { return this.GetParent<THeroUnit>(); }


    GetTalentLearn(level: number, isleft: boolean) {
        let index = level * 100 + (isleft ? 0 : 1);
        return this.TalentLearn.includes(index);
    }

    onSerializeToEntity() {
    }
}