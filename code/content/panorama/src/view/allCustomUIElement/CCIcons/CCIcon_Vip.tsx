import { CCIcon } from "./CCIcon";

export class CCIcon_Vip extends CCIcon<{ type?: "Blue" | "Purple" | "Vip" | "Sun"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Blue":
				styles.src = "s2r://panorama/images/eom_design/icon/eom/vip_mon_png.vtex";
				break;
			case "Purple":
				styles.src = "s2r://panorama/images/eom_design/icon/eom/vip_sem_png.vtex";
				break;
			case "Vip":
				styles.src = "s2r://panorama/images/eom_design/icon/eom/vip_large_png.vtex";
				break;
			case "Sun":
				styles.src = "s2r://panorama/images/eom_design/icon/eom/vip_sun_png.vtex";
				break;
			default:
				styles.src = "s2r://panorama/images/eom_design/icon/eom/vip_mon_png.vtex";
				break;
		}
		return styles;
	}
}