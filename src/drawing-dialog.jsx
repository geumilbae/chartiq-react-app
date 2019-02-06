import React from 'react'
import { Dialog, DrawingDialog, Menu, MenuDropdown } from './js/components'
import { ChartContext } from './react-chart-context'

export default class DrawingMenus extends React.Component {

	constructor(props) {
		super(props)
		this.mounts=0
	}

	componentDidMount () {
		let UIContext = this.context.UIContext;
		let ciqChart = $$$('div.ciq-chart')
		console.log(`drawing-dialog.jsx mounted count: ${this.mounts}`)

		var UIDrawingEdit = new CIQ.UI.DrawingEdit(null, UIContext);

		UIDrawingEdit.preventAutoClose = true;

		UIDrawingEdit.node.addEventListener("drawing-edit-begin", function(event) {
			if ($("body").hasClass("toolbar-on")) return;
			UIDrawingEdit.preventAutoClose = false;

			$(".ciq-draw").each(function() {
				this.priorVectorType = event.detail.tool;
				this.set(true);
			});
		}, false);

		UIDrawingEdit.node.addEventListener("drawing-edit-end", function(event) {
			if (UIDrawingEdit.preventAutoClose) return;
			if (event.detail.action !== "edit") UIDrawingEdit.preventAutoClose = true;
			if (event.detail.action !== "close") return;

			$(".ciq-draw").each(function() {
				this.set(false);
			});
		}, false);

		this.UIDrawingEdit = UIDrawingEdit;
	}

	componentWillUnmount() {
		console.log(`unmount drawing-dialog.jsx ${this.mounts}`)
		let stx = this.context.stx;
		stx.removeEventListener(this.UIDrawingEdit.drawingCB)
		stx.removeEventListener(this.UIDrawingEdit.drawingEditCB)
	}

	render () {
		return (
<cq-dialog>
	<cq-drawing-context>
		<div stxtap="DrawingEdit.edit()">Edit Settings</div>
		<div stxtap="DrawingEdit.clone()">Clone Drawing</div>
		<cq-menu stxtap="resize()" cq-close-top="cq-dialog[cq-drawing-context]">
			<cq-menu-dropdown cq-no-scroll="true" class="context-menu-right">
				<cq-item stxtap="DrawingEdit.reorderLayer('top')">Bring to Top</cq-item>
				<cq-item stxtap="DrawingEdit.reorderLayer('up')">Bring Forward</cq-item>
				<cq-item stxtap="DrawingEdit.reorderLayer('down')">Send Backward</cq-item>
				<cq-item stxtap="DrawingEdit.reorderLayer('bottom')">Send to Bottom</cq-item>
			</cq-menu-dropdown>
			
			<div>Layer Management<div className="context-button-right-arrow"></div></div>
		</cq-menu>
		<div stxtap="DrawingEdit.remove()">Delete Drawing</div>
	</cq-drawing-context>
</cq-dialog>
		)
	}
}

DrawingMenus.contextType = ChartContext
