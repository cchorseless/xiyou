
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

interface ICCOverHeadBaseItem extends NodePropsData {
    entityid: EntityIndex
}

export class CCOverHeadBaseItem extends CCPanel<ICCOverHeadBaseItem> {

    updatePos(scale: number) {
        const entityid = this.props.entityid as EntityIndex;
        if (!this.HasOverhead(entityid)) {
            this.close()
            return
        }
        let vOrigin = Entities.GetAbsOrigin(entityid);
        let fScreenX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2]);
        let fScreenY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2]);
        if (fScreenX < 0 || fScreenX > Game.GetScreenWidth() || fScreenY < 0 || fScreenY > Game.GetScreenHeight()) {
            this.close()
            return
        }
        let fOffset = Entities.GetHealthBarOffset(entityid);
        fOffset = fOffset == -1 ? 275 : fOffset;
        fOffset = fOffset + scale * 80 - 75;
        let fX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
        let fY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
        let fYY = 0;
        let pPanel = this.__root__.current!;
        pPanel.SetPositionInPixels((fX - pPanel.actuallayoutwidth / 2) / pPanel.actualuiscale_x, (fY - (pPanel.actuallayoutheight - fYY)) / pPanel.actualuiscale_y, 0);
        this.__root__.current!.visible = true;
    }

    HasOverhead(iEntIndex: EntityIndex): boolean {
        return false;
    }

    HasHpUI(iEntIndex: EntityIndex): boolean {
        return this.HasOverhead(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }
}