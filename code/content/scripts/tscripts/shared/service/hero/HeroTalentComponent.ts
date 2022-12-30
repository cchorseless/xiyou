
import { ET } from "../../lib/Entity";
import { THeroUnit } from "../hero/THeroUnit";


@GReloadable
export class HeroTalentComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;

    TalentPoint: number;
    TotalTalentPoint: number;


    private _Talents = new GDictionary<
        number,
        string
    >();
    public get Talents() {
        return this._Talents;
    }
    public set Talents(data) {
        this._Talents.copy(data);

    }

    private _TalentLearn: IGDictionary<number, number[]> = new GDictionary<
        number,
        number[]
    >();
    public get TalentLearn() {
        return this._TalentLearn;
    }
    public set TalentLearn(data: IGDictionary<number, number[]>) {
        this._TalentLearn.copy(data);

    }


    public get HeroUnit(): THeroUnit { return this.GetParent<THeroUnit>(); }

    onSerializeToEntity() {
    }
}