import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { THeroUnit } from "../hero/THeroUnit";
@registerET()
export class HeroTalentComponent extends ET.Component {

    TalentPoint: number;
    TotalTalentPoint: number;


    public Talents: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _Talents(data: Dictionary<number, string>) {
        this.Talents.copy(data);

    }

    public TalentLearn: Dictionary<number, number[]> = new Dictionary<
        number,
        number[]
    >();

    public set _TalentLearn(data: Dictionary<number, number[]>) {
        this.TalentLearn.copy(data);
    }


    public get HeroUnit(): THeroUnit { return this.GetParent<THeroUnit>(); }

    onSerializeToEntity() {
    }
}