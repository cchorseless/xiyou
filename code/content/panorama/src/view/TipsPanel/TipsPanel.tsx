/** Create By Editor*/
import { NodePropsData } from "../../libs/BasePureComponent";
import { TipsPanel_UI } from "./TipsPanel_UI";
interface IProps extends NodePropsData {
	str: string
}

export class TipsPanel extends TipsPanel_UI<IProps> {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount()
		let s = this.props.str;
		if (s) {
			this.lbl.current!.text = s;
		}
		GTimerHelper.AddTimer(1, GHandler.create(this, () => {
			this.destroy()
		}))
	};

}
