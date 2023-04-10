import { CCIcon } from "./CCIcon";

interface ICCIcon_CoinType {
    cointype: ICoinType;
}

export class CCIcon_CoinType extends CCIcon<ICCIcon_CoinType> {
    defaultStyle() {
        let superStyle = super.defaultStyle();
        let src = "";
        switch (this.props.cointype) {
            case GEEnum.EMoneyType.Gold:
                src = "s2r://panorama/images/custom_game/icon/gold_png.vtex";
                break;
            case GEEnum.EMoneyType.SoulCrystal:
                src = "s2r://panorama/images/custom_game/icon/soulcrystal_png.vtex";
                break;
            case GEEnum.EMoneyType.Wood:
                src = "s2r://panorama/images/custom_game/icon/wood_png.vtex";
                break;
            case GEEnum.EMoneyType.Population:
                src = "s2r://panorama/images/custom_game/icon/population_png.vtex";
                break;
            case GEEnum.EMoneyType.MetaStone:
                src = "s2r://panorama/images/custom_game/icon/metastone_png.vtex";
                break;
            case GEEnum.EMoneyType.StarStone:
                src = "s2r://panorama/images/custom_game/icon/starstone_png.vtex";
                break;
        }
        if (src.length > 0) {
            superStyle.src = src;
        }
        return superStyle;
    }
}