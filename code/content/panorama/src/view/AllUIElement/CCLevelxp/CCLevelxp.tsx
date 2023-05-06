import React from 'react';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCLevelxp.less";

interface ICCLevelxp {
    level: number;
    exp?: number;
    min?: number;
    max?: number;
}

export class CCLevelxp extends CCPanel<ICCLevelxp> {
    render() {
        const showExpProgress = this.props.max !== null;
        const exp = this.props.exp || 0;
        const min = this.props.min || 0;
        const max = this.props.max || 100;
        return (
            <Panel className='CC_Levelxp' ref={this.__root__}  {...this.initRootAttrs()}>

                {
                    showExpProgress ?
                        <CCPanel tooltip={`${exp}/${max}`}>
                            <CircularProgressBar className='CCLevelxpProgressBar' max={max} min={min} value={exp} />
                        </CCPanel>
                        : <Image className="CC_LevelxpBorder" />
                }
                <Label className="CC_LevelxpLabel" text={this.props.level} />
            </Panel>
        );
    }
}

