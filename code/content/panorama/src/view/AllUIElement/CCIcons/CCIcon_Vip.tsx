import { CCIcon } from "./CCIcon";

export class CCIcon_Vip extends CCIcon<{ type?: "Blue" | "Purple" | "Gold" | "Vip" | "Sun"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Blue":
				styles.src = "s2r://panorama/images/custom_game/icon/vip_mon_png.vtex";
				break;
			case "Purple":
				styles.src = "s2r://panorama/images/custom_game/icon/vip_sem_png.vtex";
				break;
			case "Gold":
				styles.src = "s2r://panorama/images/custom_game/icon/vip_yrs_png.vtex";
				break;
			case "Vip":
				styles.src = "s2r://panorama/images/custom_game/icon/vip_large_png.vtex";
				break;
			case "Sun":
				styles.src = "s2r://panorama/images/custom_game/icon/vip_sun_png.vtex";
				break;
			default:
				styles.src = "s2r://panorama/images/custom_game/icon/vip_mon_png.vtex";
				break;
		}
		return styles;
	}
}