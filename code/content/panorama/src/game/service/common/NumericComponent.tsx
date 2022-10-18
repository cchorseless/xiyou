import Dictionary from "../../../helper/DataContainerHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class NumericComponent extends ET.Component {
    public NumericDic: Dictionary<number, string> = new Dictionary<number, string>();
    public set _NumericDic(data: Dictionary<number, string>) {
        this.NumericDic.copy(data);
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
