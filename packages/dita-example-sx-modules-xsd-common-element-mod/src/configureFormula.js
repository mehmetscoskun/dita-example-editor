import configureAsSimpletableTableElements from 'fontoxml-dita/src/configureAsSimpletableTableElements.js';
import configureAsBlock from 'fontoxml-families/src/configureAsBlock.js';
import configureAsDefinitionsTableRow from 'fontoxml-families/src/configureAsDefinitionsTableRow.js';
import configureAsFrame from 'fontoxml-families/src/configureAsFrame.js';
import configureAsFrameWithBlock from 'fontoxml-families/src/configureAsFrameWithBlock.js';
import configureAsGroupWithBlock from 'fontoxml-families/src/configureAsGroupWithBlock.js';
import configureAsImageInFrame from 'fontoxml-families/src/configureAsImageInFrame.js';
import configureAsInlineAnchorToStructure from 'fontoxml-families/src/configureAsInlineAnchorToStructure.js';
import configureAsInlineFrame from 'fontoxml-families/src/configureAsInlineFrame.js';
import configureAsInlineImageInFrame from 'fontoxml-families/src/configureAsInlineImageInFrame.js';
import configureAsInlineLink from 'fontoxml-families/src/configureAsInlineLink.js';
import configureAsInlineObject from 'fontoxml-families/src/configureAsInlineObject.js';
import configureAsInlineStructure from 'fontoxml-families/src/configureAsInlineStructure.js';
import configureAsRemoved from 'fontoxml-families/src/configureAsRemoved.js';
import configureAsStructure from 'fontoxml-families/src/configureAsStructure.js';
import configureAsTitleFrame from 'fontoxml-families/src/configureAsTitleFrame.js';
import configureContextualOperations from 'fontoxml-families/src/configureContextualOperations.js';
import configureMarkupLabel from 'fontoxml-families/src/configureMarkupLabel.js';
import configureProperties from 'fontoxml-families/src/configureProperties.js';
import createElementMenuButtonWidget from 'fontoxml-families/src/createElementMenuButtonWidget.js';
import createMarkupLabelWidget from 'fontoxml-families/src/createMarkupLabelWidget.js';
import createLabelWidget from 'fontoxml-families/src/createLabelWidget.js';
import configureAsListElements from 'fontoxml-list-flow/src/configureAsListElements.js';
import configureAsReadOnly from 'fontoxml-families/src/configureAsReadOnly.js';
import t from 'fontoxml-localization/src/t.js';
import parsePseudoAttributes from 'fontoxml-dom-utils/src/parsePseudoAttributes.js';
import contentBoundaryType from 'fontoxml-base-flow/src/contentBoundaryType.js';
import defaultTraverser from 'fontoxml-families/src/shared/defaultTraverser.js';

import InsertFormulaCommand from './api/InsertFormulaCommand.js';
import FormulaTemplate from './api/FormulaTemplate.js';

const TEXT_SELECTOR_FOR_FORMULA =
	'self::text()[preceding-sibling::processing-instruction()[name(.)="fontoxml-formula"] and following-sibling::processing-instruction()[name(.)="fontoxml-formula-end"]]';

export default function configureFormula(sxModule) {
	sxModule.configure('commands').addCommand('insert-formula', new InsertFormulaCommand());

	sxModule
		.configure('fontoxml-base-flow')
		.forNodesMatching(TEXT_SELECTOR_FOR_FORMULA)
		.isAutogenerated(false)
		.isAutomergeable(false)
		.isClosed(false)
		.isDetached(false)
		.isIgnoredForNavigation(false)
		.isRemovableIfEmpty(true)
		.isSplittable(false)
		.nodeIsContent(false)
		.selectBeforeDelete(true)
		.withContentBoundaryType(contentBoundaryType.NONE);

	sxModule
		.configure('fontoxml-block-flow')
		.forNodesMatching(TEXT_SELECTOR_FOR_FORMULA)
		.withBlockTypes([]);

	sxModule
		.configure('fontoxml-families')
		.forNodesMatching(TEXT_SELECTOR_FOR_FORMULA)
		.isSheetFrame(false)
		.withInnerLayoutType('inline')
		.withLayoutType('inline');

	sxModule
		.configure('fontoxml-templated-views')
		.stylesheet('content')
		.renderNodesMatching(TEXT_SELECTOR_FOR_FORMULA)
		.withTraverser(defaultTraverser)
		.withTemplate(new FormulaTemplate());

	// configureAsReadOnly(
	// 	sxModule,
	// 	'self::text()[preceding-sibling::processing-instruction()[name(.)="fontoxml-formula"] and following-sibling::processing-instruction()[name(.)="fontoxml-formula-end"]]'
	// );

	// configureAsInlineFrame(sxModule, 'self::text()');
	// configureAsInlineObject(
	// 	sxModule,
	// 	'self::processing-instruction()[name(.)="fontoxml-formula"]',
	// 	t('formula'),
	// 	{
	// 		clickOperation: 'do-nothin',
	// 		createInnerJsonMl: (sourceNode, renderer) => {
	// 			const data = sourceNode.data;
	// 			const attributes = parsePseudoAttributes(data);
	// 			return [
	// 				'div',
	// 				{
	// 					style: 'background-color: yellow; margin: 0px 4px 0px 4px;'
	// 				},
	// 				attributes.result
	// 			];
	// 		}
	// 	}
	// );
}