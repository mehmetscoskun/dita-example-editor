import BlueprintedCommand from 'fontoxml-core/src/BlueprintedCommand.js';
import blueprintMutations from 'fontoxml-blueprints/src/blueprintMutations.js';
import parseXmlDocument from 'fontoxml-dom-utils/src/parseXmlDocument.js';
import BlueprintPosition from 'fontoxml-blueprints/src/BlueprintPosition.js';

const unsafeInsertNodes = blueprintMutations.unsafeInsertNodes;
const INITIAL_FORMULA_XML_STRING =
	'<p><?fontoxml-formula formula=""?>###<?fontoxml-formula-end?></p>';

function draftValidBlueprint(_argument, blueprint, format, selectionRange) {
	const formulaDocument = parseXmlDocument(INITIAL_FORMULA_XML_STRING);
	const nodesToInsert = Array.from(
		blueprint.getChildNodes(blueprint.getFirstChild(formulaDocument))
	);
	const positionToInsert = BlueprintPosition.fromOffset(
		selectionRange.endContainer,
		selectionRange.endOffset,
		blueprint
	);

	unsafeInsertNodes(nodesToInsert, positionToInsert, blueprint);

	return format.synthesizer.completeStructure(selectionRange.endContainer, blueprint);
}

export default class InsertRowCommand extends BlueprintedCommand {
	constructor() {
		super(draftValidBlueprint);
	}

	getState(commandContext, argument) {
		let toReturn;
		try {
			argument.getState = true;
			toReturn = super.getState(commandContext, argument);
		} finally {
			argument.getState = false;
		}
		return toReturn;
	}
}
