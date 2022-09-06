import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { THeroUnit } from "../hero/THeroUnit";
@registerET()
export class HeroTalentComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;

    TalentPoint: number;
    TotalTalentPoint: number;


    private _Talents: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Talents() {
        return this._Talents;
    }
    public set Talents(data: Dictionary<number, string>) {
        this._Talents.clear();
        for (let _d of data as any) {
            this._Talents.add(_d[0], _d[1]);
        }
    }

    private _TalentLearn: Dictionary<number, number[]> = new Dictionary<
        number,
        number[]
    >();
    public get TalentLearn() {
        return this._TalentLearn;
    }
    public set TalentLearn(data: Dictionary<number, number[]>) {
        this._TalentLearn.clear();
        for (let _d of data as any) {
            this._TalentLearn.add(_d[0], _d[1]);
        }
    }


    public get HeroUnit(): THeroUnit { return this.GetParent<THeroUnit>(); }

    onSerializeToEntity() {
    }
}