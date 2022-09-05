import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class NumericComponent extends ET.Component {
    private _NumericDic: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get NumericDic() {
        return this._NumericDic;
    }
    public set NumericDic(data: Dictionary<number, string>) {
        this._NumericDic.clear();
        for (let _d of data as any) {
            this._NumericDic.add(_d[0], _d[1]);
        }
    }

    onSerializeToEntity() {
    }
    public GetAsInt(numericType: number) {
        let v = this.NumericDic.get(numericType);
        if (v != null) {
            return parseInt(v);
        }
        return 0
    }
    public GetAsFloat(numericType: number) {
        let v = this.NumericDic.get(numericType);
        if (v != null) {
            return parseFloat(v);
        }
        return 0.0
    }
}
