import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon } from "./CCIcon";

export class CCIcon_History extends CCIcon<{ type?: "Tui7"; }> {
	static defaultProps = {
		type: CSSHelper.DEFAULT_ADDON_TYPE
	};
	defaultStyle = () => {
		switch (this.props.type) {
			case "Tui7":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui7/history_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/control_icons/history_png.vtex",
				};
		}
	}
}