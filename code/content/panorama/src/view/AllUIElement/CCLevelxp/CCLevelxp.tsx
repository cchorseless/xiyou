import React from 'react';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCLevelxp.less";

interface ICCLevelxp {
    level: number;
}

export class CCLevelxp extends CCPanel<ICCLevelxp> {
    render() {
        return (
            <Panel className='CC_Levelxp' ref={this.__root__}  {...this.initRootAttrs()}>
                <Image className="CC_LevelxpBorder" />
                <Label className="CC_LevelxpLabel" text={this.props.level} />
            </Panel>
        );
    }
}
