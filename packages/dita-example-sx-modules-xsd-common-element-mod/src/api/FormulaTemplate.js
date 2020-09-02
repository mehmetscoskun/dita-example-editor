import JsonMlTemplate from 'fontoxml-templated-views/src/JsonMlTemplate.js';
import createInlineFrameJsonMl from 'fontoxml-families/src/createInlineFrameJsonMl.js';
import mapTextVisualizationOptionsToCvAttributes from 'fontoxml-families/src/shared/mapTextVisualizationOptionsToCvAttributes.js';
import determineCommonVisualizationOptions from 'fontoxml-families/src/determineCommonVisualizationOptions.js';
import getNodeId from 'fontoxml-dom-identification/src/getNodeId.js';

const DEFAULT_VISUALIZATION = {
	backgroundColor: 'grey',
	showWhen: 'always',
	startDelimiter: '',
	endDelimiter: ''
};

class FormulaTemplate extends JsonMlTemplate {
	constructor() {
		super((sourceNode, renderer) => {
			const finalVisualization = Object.assign(
				{},
				DEFAULT_VISUALIZATION,
				determineCommonVisualizationOptions(sourceNode, renderer)
			);

			const popoverDetails = {
				'popover-component-name': 'FormulaPopover',
				'popover-context-node-id': getNodeId(sourceNode.previousSibling),
				'popover-data': JSON.stringify({}),
				'block-context-menu': 'true',
				'block-selection-change-on-click': 'true',
				'contenteditable': false,
				'style': 'cursor:pointer;'
			};

			const attributes = Object.assign(
				{},
				mapTextVisualizationOptionsToCvAttributes(finalVisualization),
				popoverDetails
			);

			return createInlineFrameJsonMl(
				['cv-content', attributes, sourceNode.data],
				sourceNode,
				renderer,
				finalVisualization
			);
		});
	}
}

export default FormulaTemplate;
