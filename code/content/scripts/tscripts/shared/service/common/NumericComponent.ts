
import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class NumericComponent extends ET.Component {

    private _NumericDic = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get NumericDic() {
        return this._NumericDic;
    }

    public set NumericDic(data) {
        this._NumericDic.copy(data);
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

    onReload(): void {
        GCharacterDataComponent.GetOneInstance(this.BelongPlayerid).SyncClient()
    }
}
