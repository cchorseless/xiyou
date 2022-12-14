import { CCIcon } from "./CCIcon";

export class CCIcon_Star extends CCIcon<{ type?: "Favorite" | "Selected" | "Lock" | "UnFilled" | "Filled" | "Tui7Task"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Favorite":
				styles.src = "s2r://panorama/images/control_icons/star_favorite_psd.vtex"
				break;
			case "Selected":
				styles.src = "s2r://panorama/images/control_icons/star_favorite_selected_psd.vtex"
				break;
			case "Lock":
				styles.src = "s2r://panorama/images/control_icons/star_locked_png.vtex"
				break;
			case "Filled":
				styles.src = "s2r://panorama/images/custom_game/icon/star_png.vtex";
				break;
			case "Tui7Task":
				styles.src = "s2r://panorama/images/eom_design/icon/Tui7/task_point_png.vtex";
				break;
			case "UnFilled":
				styles.src = "s2r://panorama/images/custom_game/icon/starbg_png.vtex";
				break;
			default:
				styles.src = "s2r://panorama/images/custom_game/icon/star_png.vtex";
				break;
		}
		return styles;
	}
}