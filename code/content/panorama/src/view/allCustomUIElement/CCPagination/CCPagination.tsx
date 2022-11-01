import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPagination.less";

interface ICCPagination {
	/** 当前页数左右两侧显示的数量 */
	boundaryCount: number,
	/** 总页数 */
	pageCount: number,
	/** 初始页数 */
	defaultPage: number,
	/** 更改事件 */
	onChange?: (page: number) => void,
	/** 显示跳转部件 */
	showJumpButton: boolean;
}

/** 分页组件 */
export class CCPagination extends CCPanel<ICCPagination> {
	defaultClass = () => { return "CC_Pagination"; };
	static defaultProps = {
		defaultPage: 1,
		boundaryCount: 1,
		showJumpButton: false,
	};
	state = { page: this.props.defaultPage, group: Number(Math.random().toString().substring(3, 3) + Date.now()).toString(36) + "_CC_Pagination" };
	/** 变更页数 */
	changePage = (page: number) => {
		if (this.props.onChange) {
			this.props.onChange(page);
		}
		this.setState({ page: page });
	};
	render() {
		const { boundaryCount, pageCount, showJumpButton } = this.props;
		const { page, group } = this.state;
		return (
			<CCPanel  {...this.initRootAttrs()} >
				<Button className="CC_Pagination_Button CC_Pagination_LeftArrow" enabled={page > 1} onactivate={() => this.changePage(Math.max(1, page - 1))} />
				{(() => {
					let res: JSX.Element[] = [];
					let showCount = boundaryCount * 2 + 3;
					let num1 = showCount - 1;
					let num2 = pageCount - showCount + 2;
					if (pageCount <= showCount + 2) {
						for (let index = 0; index < pageCount; index++) {
							res.push(<TabButton group={group} key={index} selected={page == index + 1} localizedText={String(index + 1)} className="CC_Pagination_Button" onactivate={() => this.changePage(index + 1)} />);
						}
					} else {
						res.push(<TabButton group={group} key={1} selected={page == 1} localizedText={String(1)} className="CC_Pagination_Button" onactivate={() => this.changePage(1)} />);
						let startIndex = Math.min(Math.max(2, page - boundaryCount - 1), pageCount - showCount);
						for (let index = startIndex; index < Math.min(startIndex + showCount, pageCount); index++) {
							// 第一个元素
							if (index == startIndex) {
								if (page > num1) {
									res.push(
										<Panel key={index} enabled={false} className="CC_Pagination_Button" >
											<Label text="..." />
										</Panel>
									);
								} else {
									res.push(<TabButton group={group} key={index} selected={page == index} localizedText={String(index)} className="CC_Pagination_Button" onactivate={() => this.changePage(index)} />);
								}
							}
							// 末尾元素
							else if (index == startIndex + showCount - 1) {
								if (page < num2) {
									res.push(
										<Panel key={index} enabled={false} className="CC_Pagination_Button" >
											<Label text="..." />
										</Panel>
									);
								} else {
									res.push(<TabButton group={group} key={index} selected={page == index} localizedText={String(index)} className="CC_Pagination_Button" onactivate={() => this.changePage(index)} />);
								}
							} else {
								res.push(<TabButton group={group} key={index} selected={page == index} localizedText={String(index)} className="CC_Pagination_Button" onactivate={() => this.changePage(index)} />);
							}
						}
						res.push(<TabButton group={group} key={pageCount} selected={page == pageCount} localizedText={String(pageCount)} className="CC_Pagination_Button" onactivate={() => this.changePage(pageCount)} />);
					}
					return res;
				})()}
				<Button className="CC_Pagination_Button CC_Pagination_RightArrow" enabled={page < pageCount} onactivate={() => this.changePage(Math.min(pageCount, page + 1))} />
				{showJumpButton &&
					<>
						<Panel className="CC_Pagination_JumpExtry">
							<TextEntry text={String(page)} multiline={false} textmode="numeric" oninputsubmit={self => {
								let text = Number(self.text);
								if (Number.isInteger(text)) {
									if (text >= 1 && text <= pageCount) {
										this.changePage(text);
									}
								}
							}} />
						</Panel>
						<Label text={" / " + pageCount} className="CC_Pagination_JumpLabel" />
					</>
				}
			</CCPanel>
		);
	}
}