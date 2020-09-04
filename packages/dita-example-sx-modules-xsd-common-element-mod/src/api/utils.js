import evaluateXPathToFirstNode from 'fontoxml-selectors/src/evaluateXPathToFirstNode.js';

const query = 'fonto:id-lookup($id)';
function getNodeForId(contextNode, nodeId, blueprint) {
	const node = evaluateXPathToFirstNode(query, contextNode, blueprint, {
		id: nodeId
	});
	return node;
}

export default {
	getNodeForId
};
