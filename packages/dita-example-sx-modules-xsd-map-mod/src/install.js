import addCustomMutation from 'fontoxml-base-flow/src/addCustomMutation.js';
import addTransform from 'fontoxml-operations/src/addTransform.js';
import documentsHierarchy from 'fontoxml-documents/src/documentsHierarchy.js';
import documentsManager from 'fontoxml-documents/src/documentsManager.js';
import domInfo from 'fontoxml-dom-utils/src/domInfo.js';
import evaluateXPathToBoolean from 'fontoxml-selectors/src/evaluateXPathToBoolean.js';
import evaluateXPathToNodes from 'fontoxml-selectors/src/evaluateXPathToNodes.js';
import getNodeId from 'fontoxml-dom-identification/src/getNodeId.js';
import readOnlyBlueprint from 'fontoxml-blueprints/src/readOnlyBlueprint.js';
import uiManager from 'fontoxml-modular-ui/src/uiManager.js';

import RelcolspecTypePopover from './ui/RelcolspecTypePopover.jsx';
import moveTopicrefToCell from './api/moveTopicrefToCellCustomMutation.js';
import updateRelcellChildElements from './api/updateRelcellChildElementsCustomMutation.js';

export default function install() {
	uiManager.registerReactComponent('RelcolspecTypePopover', RelcolspecTypePopover);

	addCustomMutation('move-topicref-to-cell', moveTopicrefToCell);
	addCustomMutation('update-relcell-child-elements', updateRelcellChildElements);

	addTransform('disableWhenSelectedItemsIsEmptyArray', stepData => {
		if (stepData.selectedItems && stepData.selectedItems.length === 0) {
			stepData.operationState = { enabled: false };
		}
		return stepData;
	});

	addTransform(
		'setSelectedItemsForTopicrefs',
		stepData => {
			stepData.selectedItems = [];
			const contextNode = documentsManager.getNodeById(stepData.contextNodeId);
			if (!contextNode) {
				return stepData;
			}

			const currentTopicrefNodes = evaluateXPathToNodes(
				'./*[fonto:dita-class(., "map/topicref")]',
				contextNode,
				readOnlyBlueprint
			);

			stepData.selectedItems = currentTopicrefNodes.reduce(
				(selectedItems, currentTopicrefNode) => {
					const currentHierarchyNode = documentsHierarchy.find(hierarchyNode => {
						const sourceNode =
							hierarchyNode.documentReference &&
							hierarchyNode.documentReference.getSourceNode();
						if (!sourceNode) {
							return false;
						}

						return evaluateXPathToBoolean(
							'@href = $sourceNode/@href',
							currentTopicrefNode,
							readOnlyBlueprint,
							{ sourceNode: sourceNode }
						);
					});

					if (!currentHierarchyNode) {
						return selectedItems;
					}

					const selectedItem = { hierarchyNodeId: currentHierarchyNode.getId() };

					if (
						currentHierarchyNode.documentReference &&
						currentHierarchyNode.documentReference.isLoaded()
					) {
						const traversalRootNode = currentHierarchyNode.documentReference.getTraversalRootNode();
						selectedItem.contextNodeId = getNodeId(
							domInfo.isDocument(traversalRootNode)
								? traversalRootNode.documentElement
								: traversalRootNode
						);
					}

					selectedItems.push(selectedItem);

					return selectedItems;
				},
				[]
			);

			return stepData;
		},
		stepData => {
			// Add a getStateStep, because retrieving the existing selectedItems is not a light task.
			stepData.selectedItems = [];
			return stepData;
		}
	);

	function mapForLength(n, mapper) {
		const result = [];
		for (let i = 0; i < n; ++i) {
			result.push(mapper(i));
		}
		return result;
	}

	addTransform('setStructureForReltable', function(stepData) {
		const tableStencil = ['reltable'];

		mapForLength(stepData.rows, rowIndex => {
			if (stepData.hasHeader && rowIndex === 0 && stepData.rows > 1) {
				tableStencil.push(
					['relheader'].concat(
						mapForLength(stepData.columns, columnIndex => {
							if (columnIndex === 0) {
								return ['relcolspec', [{ bindTo: 'selection', empty: true }]];
							}
							return ['relcolspec'];
						})
					)
				);
				return;
			}

			tableStencil.push(
				['relrow'].concat(
					mapForLength(stepData.columns, columnIndex => {
						if (rowIndex === 0 && columnIndex === 0) {
							return ['relcell', [{ bindTo: 'selection', empty: true }]];
						}
						return ['relcell'];
					})
				)
			);
		});

		stepData.tableStencil = tableStencil;

		return stepData;
	});
}
