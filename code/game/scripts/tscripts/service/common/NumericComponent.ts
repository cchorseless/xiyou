import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";

@registerET()
export class NumericComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;
    @serializeETProps()
    private _NumericDic: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public get NumericDic() {
        return this._NumericDic;
    }

    public set NumericDic(data: Dictionary<number, string>) {
        this._NumericDic.copyData((data as any)[0], (data as any)[1]);
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
    onSerializeToEntity() {
    }
}
