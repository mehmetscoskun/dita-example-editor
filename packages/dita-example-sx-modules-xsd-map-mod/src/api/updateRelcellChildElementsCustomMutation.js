import blueprintMutations from 'fontoxml-blueprints/src/blueprintMutations.js';
import blueprintQuery from 'fontoxml-blueprints/src/blueprintQuery.js';
import CustomMutationResult from 'fontoxml-base-flow/src/CustomMutationResult.js';
import documentsHierarchy from 'fontoxml-documents/src/documentsHierarchy.js';
import evaluateXPathToBoolean from 'fontoxml-selectors/src/evaluateXPathToBoolean.js';
import evaluateXPathToNodes from 'fontoxml-selectors/src/evaluateXPathToNodes.js';
import evaluateXPathToString from 'fontoxml-selectors/src/evaluateXPathToString.js';
import namespaceManager from 'fontoxml-dom-namespaces/src/namespaceManager.js';

/**
 * Arguments:
 * @param {NodeId}   contextNodeId      The relcell node.
 * @param {Object[]} selectedItems      The hierarchy nodes that should be in the cell.
 *      An empty array means all items should be removed.
 * @param {Object[]} prevSelectedItems  The selectedItems that are currently in the cell.
 */
export default function updateRelcellChildElements(argument, blueprint) {
	const contextNode = blueprint.lookup(argument.contextNodeId);
	if (!contextNode || !blueprintQuery.isInDocument(blueprint, contextNode)) {
		return CustomMutationResult.notAllowed();
	}

	const currentHierarchyNodeIds = argument.prevSelectedItems.map(item => item.hierarchyNodeId);

	const currentHierarchyNodes = argument.prevSelectedItems.length
		? documentsHierarchy.findAll(hierarchyNode =>
				currentHierarchyNodeIds.includes(hierarchyNode.getId())
		  )
		: [];

	let newHierarchyNodes;

	if (
		currentHierarchyNodeIds.length !== currentHierarchyNodes.length ||
		currentHierarchyNodeIds.some(
			(hierarchyNodeId, index) => hierarchyNodeId !== currentHierarchyNodes[index].getId()
		)
	) {
		// The order in the cell was changed
		newHierarchyNodes = argument.selectedItems.map(selectedItem =>
			documentsHierarchy.find(
				hierarchyNode => hierarchyNode.getId() === selectedItem.hierarchyNodeId
			)
		);
	} else {
		// The order is still in document order, let's keep it that way
		const newHierarchyNodeIds = argument.selectedItems.map(item => item.hierarchyNodeId);
		newHierarchyNodes = documentsHierarchy.findAll(hierarchyNode =>
			newHierarchyNodeIds.includes(hierarchyNode.getId())
		);
	}

	const currentTopicrefNodes = evaluateXPathToNodes(
		'./*[fonto:dita-class(., "map/topicref")]',
		contextNode,
		blueprint
	);

	const removableNodes = currentTopicrefNodes;
	let currrentTopicrefsIndex = 0;
	newHierarchyNodes.forEach(selectedHierarchyNode => {
		const sourceNode =
			selectedHierarchyNode.documentReference &&
			selectedHierarchyNode.documentReference.getSourceNode();
		if (!sourceNode) {
			// This should never happen
			return;
		}
		const href = evaluateXPathToString('@href', sourceNode, blueprint);

		const existingTopicrefNodeIndex = removableNodes.findIndex(
			topicrefNode => evaluateXPathToString('@href', topicrefNode, blueprint) === href
		);

		if (existingTopicrefNodeIndex === -1) {
			const refNodeName = evaluateXPathToString('name()', sourceNode, blueprint);
			const newTopicrefNode = namespaceManager.createElement(contextNode, refNodeName);
			blueprint.setAttribute(newTopicrefNode, 'href', href);
			blueprint.insertBefore(
				contextNode,
				newTopicrefNode,
				currentTopicrefNodes[currrentTopicrefsIndex]
			);
			return;
		}

		const existingTopicrefNode = removableNodes[existingTopicrefNodeIndex];
		if (
			currentTopicrefNodes[currrentTopicrefsIndex] &&
			evaluateXPathToBoolean(
				'@href = $nextTopicrefNode/@href',
				existingTopicrefNode,
				blueprint,
				{ nextTopicrefNode: currentTopicrefNodes[currrentTopicrefsIndex] }
			)
		) {
			// The currrentTopicrefsIndex is already in the correct order
			currrentTopicrefsIndex++;
		} else {
			blueprintMutations.unsafeMoveNodes(
				removableNodes[existingTopicrefNodeIndex],
				removableNodes[existingTopicrefNodeIndex],
				blueprint,
				contextNode,
				currentTopicrefNodes[currrentTopicrefsIndex],
				false
			);
		}

		removableNodes.splice(existingTopicrefNodeIndex, 1);
	});

	removableNodes.forEach(removableNode => {
		blueprint.removeChild(contextNode, removableNode);
	});

	return CustomMutationResult.ok();
}
