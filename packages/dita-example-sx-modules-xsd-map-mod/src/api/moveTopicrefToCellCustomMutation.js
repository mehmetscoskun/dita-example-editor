import blueprintMutations from 'fontoxml-blueprints/src/blueprintMutations.js';
import blueprintQuery from 'fontoxml-blueprints/src/blueprintQuery.js';
import CustomMutationResult from 'fontoxml-base-flow/src/CustomMutationResult.js';
import evaluateXPathToFirstNode from 'fontoxml-selectors/src/evaluateXPathToFirstNode.js';

/**
 * Arguments:
 * @param {NodeId}   contextNodeId      The topicref node that you want to move
 * @param {string}   direction          Up, down, right, or left
 */
export default function moveTopicrefToCell(argument, blueprint) {
	const contextNode = blueprint.lookup(argument.contextNodeId);
	if (
		!argument.direction ||
		!contextNode ||
		!blueprintQuery.isInDocument(blueprint, contextNode)
	) {
		return CustomMutationResult.notAllowed();
	}

	let newParentCell;

	if (argument.direction === 'up' || argument.direction === 'down') {
		newParentCell = evaluateXPathToFirstNode(
			`let $cell := parent::*[self::relcell or self::relcolspec],
			$cellIndex := fonto:get-column-index($cell) return
			$cell/parent::*/${
				argument.direction === 'up' ? 'preceding' : 'following'
			}-sibling::*[1]/*[(self::relcell or self::relcolspec)
				and fonto:get-column-index(.) = $cellIndex]`,
			contextNode,
			blueprint
		);
	} else if (argument.direction === 'left' || argument.direction === 'right') {
		newParentCell = evaluateXPathToFirstNode(
			`parent::*[self::relcell or self::relcolspec]/${
				argument.direction === 'left' ? 'preceding' : 'following'
			}-sibling::*[1]`,
			contextNode,
			blueprint
		);
	}

	if (!newParentCell) {
		return CustomMutationResult.notAllowed();
	}

	blueprintMutations.unsafeMoveNodes(
		contextNode,
		contextNode,
		blueprint,
		newParentCell,
		null,
		true
	);

	return CustomMutationResult.ok();
}
