import JsonMlTemplate from 'fontoxml-templated-views/src/JsonMlTemplate.js';
import createInlineFrameJsonMl from 'fontoxml-families/src/createInlineFrameJsonMl.js';
import mapTextVisualizationOptionsToCvAttributes from 'fontoxml-families/src/shared/mapTextVisualizationOptionsToCvAttributes.js';
import determineCommonVisualizationOptions from 'fontoxml-families/src/determineCommonVisualizationOptions.js';
import getNodeId from 'fontoxml-dom-identification/src/getNodeId.js';
import parsePseudoAttributes from 'fontoxml-dom-utils/src/parsePseudoAttributes.js';
import readOnlyBlueprint from 'fontoxml-blueprints/src/readOnlyBlueprint.js';
import evaluateXPathToString from 'fontoxml-selectors/src/evaluateXPathToString.js';
import evaluateXPathToFirstNode from 'fontoxml-selectors/src/evaluateXPathToFirstNode.js';
import BlueprintRange from 'fontoxml-blueprints/src/BlueprintRange.js';
import operationsManager from 'fontoxml-operations/src/operationsManager.js';

import utils from './utils.js';

const getNodeForId = utils.getNodeForId;

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

			const unwrappedNode = sourceNode.unwrap();

			const formulaNode = evaluateXPathToFirstNode(
				'preceding::processing-instruction()[name(.)="fontoxml-formula"]',
				sourceNode,
				readOnlyBlueprint
			);
			const attr = parsePseudoAttributes(formulaNode.data);
			const formulaNodeId = getNodeId(formulaNode);
			const dependants = attr.dependants.split(',');

			const nodes = dependants.map(dependant =>
				getNodeForId(unwrappedNode.ownerDocument, dependant, readOnlyBlueprint)
			);

			const result = evaluateXPathToString('$node', null, readOnlyBlueprint, {
				node: nodes[0]
			});
			const range = new BlueprintRange(readOnlyBlueprint);
			range.selectNodeContents(unwrappedNode);

			// replace text is not good enough
			// we need to find another command
			operationsManager.executeOperation('replace-text', {
				overrideRange: {
					startContainerNodeId: getNodeId(range.startContainer),
					startOffset: range.startOffset,
					endContainerNodeId: getNodeId(range.endContainer),
					endOffset: range.endOffset
				},
				text: result
			});

			const popoverDetails = {
				'popover-component-name': 'FormulaPopover',
				'popover-context-node-id': sourceNode.nodeId,
				'popover-data': JSON.stringify({ contextNodeId: formulaNodeId }),
				'block-context-menu': 'true',
				'block-selection-change-on-click': 'true',
				'contenteditable': false,
				'style': 'cursor:pointer;',
				'result': result
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
