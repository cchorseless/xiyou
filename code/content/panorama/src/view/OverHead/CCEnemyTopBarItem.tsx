/** Create By Editor*/
import React from "react";
import { CCEntityHpBarItem } from "./CCEntityHpBarItem";
import { CCOverHeadBaseItem } from "./CCOverHeadBaseItem";


export class CCEnemyTopBarItem extends CCOverHeadBaseItem {

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
