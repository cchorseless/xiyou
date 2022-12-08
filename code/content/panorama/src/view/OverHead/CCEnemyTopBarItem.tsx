/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { EntityHpBarItem } from "../Common/EntityHpBarItem";
import { CCEntityHpBarItem } from "./CCEntityHpBarItem";
import { CCOverHeadBaseItem } from "./CCOverHeadBaseItem";


export class CCEnemyTopBarItem extends CCOverHeadBaseItem {

    HasOverhead(iEntIndex: EntityIndex): boolean {
        let EntityRootManage = PlayerScene.EntityRootManage;
        let entityroot = EntityRootManage.getEnemy(iEntIndex);
        if (entityroot && entityroot.EnemyUnitComp!.IsShowOverhead) {
            return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.IsInvisible(iEntIndex);
        }
        return false;
        // return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }

    HasHpUI(iEntIndex: EntityIndex): boolean {
        return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }

    render() {
        const entityid = this.props.entityid as EntityIndex;
        return (<Panel ref={this.__root__}   {...this.initRootAttrs()}>
            <CCEntityHpBarItem entityid={entityid} />
            <Label id="EnemyHealthCount" localizedText="×{d:enemy_health_count}" />
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}
