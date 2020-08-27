import applyCss from 'fontoxml-styles/src/applyCss.js';
import configurationManager from 'fontoxml-configuration/src/configurationManager.js';
import configureAsBasicTableElements from 'fontoxml-table-flow-basic/src/configureAsBasicTableElements.js';
import configureAsInlineFrame from 'fontoxml-families/src/configureAsInlineFrame.js';
import configureAsInlineLink from 'fontoxml-families/src/configureAsInlineLink.js';
import configureAsInlineObjectInFrame from 'fontoxml-families/src/configureAsInlineObjectInFrame.js';
import configureAsInlineStructure from 'fontoxml-families/src/configureAsInlineStructure.js';
import configureAsMapSheetFrame from 'fontoxml-dita/src/configureAsMapSheetFrame.js';
import configureAsRemoved from 'fontoxml-families/src/configureAsRemoved.js';
import configureAsStructure from 'fontoxml-families/src/configureAsStructure.js';
import configureAsTitleFrame from 'fontoxml-families/src/configureAsTitleFrame.js';
import configureProperties from 'fontoxml-families/src/configureProperties.js';
import createIconWidget from 'fontoxml-families/src/createIconWidget.js';
import createLabelQueryWidget from 'fontoxml-families/src/createLabelQueryWidget.js';
import createMarkupLabelWidget from 'fontoxml-families/src/createMarkupLabelWidget.js';
import createRelatedNodesQueryWidget from 'fontoxml-families/src/createRelatedNodesQueryWidget.js';
import evaluateXPathToBoolean from 'fontoxml-selectors/src/evaluateXPathToBoolean.js';
import evaluateXPathToString from 'fontoxml-selectors/src/evaluateXPathToString.js';
import readOnlyBlueprint from 'fontoxml-blueprints/src/readOnlyBlueprint.js';
import t from 'fontoxml-localization/src/t.js';

const mapUsesPermanentReferences = configurationManager.get('map-manager-use-permanent-references');

export default function configureSxModule(sxModule) {
	// anchor
	configureAsRemoved(sxModule, 'self::anchor', t('anchor'));

	// linktext
	configureAsRemoved(sxModule, 'self::linktext', t('link text'));

	// map
	configureAsMapSheetFrame(sxModule, 'self::map', t('map'), {
		defaultTextContainer: 'title',
		titleQuery:
			'title//text()[not(ancestor::*[name() = ("sort-at", "draft-comment", "foreign", "unknown", "required-cleanup", "image")])]/string() => string-join()',
		variation: 'compact-vertical',
		visibleChildSelectorOrNodeSpec: 'self::title or self::reltable',
		blockFooter: [
			createRelatedNodesQueryWidget(
				'descendant::fn[not(@conref) and fonto:in-inline-layout(.)]'
			)
		],
		blockHeaderLeft: [createMarkupLabelWidget()]
	});

	// title in map
	configureAsTitleFrame(sxModule, 'self::title[parent::map]', undefined, {
		fontVariation: 'collection-title'
	});

	// navref
	configureAsRemoved(sxModule, 'self::navref', t('navref'));

	// relcell
	configureProperties(sxModule, 'self::relcell', {
		markupLabel: t('cell'),
		contextualOperations: [
			{ name: ':contextual-insert-topicref--reltable', hideIn: ['context-menu'] },
			{ name: ':contextual-edit-topicref--reltable', hideIn: ['context-menu'] },
			{ name: ':contextual-open-properties-panel-for-relcell', hideIn: ['context-menu'] },
			{ name: ':contextual-remove-all-topicrefs--reltable', hideIn: ['context-menu'] }
		]
	});

	// relcolspec
	configureProperties(sxModule, 'self::relcolspec', {
		markupLabel: t('header cell'),
		contextualOperations: [
			{ name: ':contextual-insert-topicref--reltable', hideIn: ['context-menu'] },
			{ name: ':contextual-edit-topicref--reltable', hideIn: ['context-menu'] },
			{ name: ':contextual-open-properties-panel-for-relcell', hideIn: ['context-menu'] },
			{ name: ':contextual-remove-all-topicrefs--reltable', hideIn: ['context-menu'] }
		]
	});

	// relheader
	configureProperties(sxModule, 'self::relheader', {
		markupLabel: t('header row')
	});

	// relrow
	configureProperties(sxModule, 'self::relrow', {
		markupLabel: t('row')
	});

	// reltable
	configureAsBasicTableElements(sxModule, {
		table: {
			localName: 'reltable'
		},
		headerRow: {
			localName: 'relheader'
		},
		headerCell: {
			localName: 'relcolspec'
		},
		row: {
			localName: 'relrow'
		},
		cell: {
			localName: 'relcell'
		},
		columnBefore: [
			function(sourceNode, renderer) {
				if (
					evaluateXPathToBoolean('not(self::relcolspec)', sourceNode, readOnlyBlueprint)
				) {
					return null;
				}
				const typeValue = evaluateXPathToString('@type', sourceNode, readOnlyBlueprint);
				return createIconWidget('edit', {
					isInline: true,
					clickPopoverComponentName: 'RelcolspecTypePopover',
					popoverData: {
						initialTypeValue: typeValue
					}
				})(sourceNode, renderer);
			},
			createLabelQueryWidget('self::relcolspec/@type', {
				inline: true,
				tooltipQuery: 'self::relcolspec/@type'
			})
		],
		showInsertionWidget: true,
		showHighlightingWidget: true
	});
	configureProperties(sxModule, 'self::reltable', {
		markupLabel: t('relationship table'),
		blockHeaderLeft: [createMarkupLabelWidget()]
	});

	// searchtitle
	configureAsRemoved(sxModule, 'self::searchtitle', t('searchtitle'));

	// shortdesc
	//     The short description (<shortdesc>) element occurs between the topic title and the topic body, as
	//     the initial paragraph-like content of a topic, or it can be embedded in an abstract element. The
	//     short description, which represents the purpose or theme of the topic, is also intended to be used
	//     as a link preview and for searching. When used within a DITA map, the short description of the
	//     <topicref> can be used to override the short description in the topic. Category: Topic elements
	configureAsRemoved(sxModule, 'self::shortdesc', t('introduction'));

	// topichead
	//     The <topichead> element provides a title-only entry in a navigation map, as an alternative to the
	//     fully-linked title provided by the <topicref> element. Category: Mapgroup elements
	configureAsMapSheetFrame(sxModule, 'self::topichead', t('topic group'), {
		titleQuery:
			'if (topicmeta/navtitle) then (topicmeta/navtitle//text()[not(ancestor::*[name() = ("sort-at", "draft-comment", "foreign", "unknown", "required-cleanup", "image")])]/string() => string-join()) else string(./@navtitle)',
		variation: 'compact-vertical',
		visibleChildSelectorOrNodeSpec: 'self::topicmeta',
		blockHeaderLeft: [createMarkupLabelWidget()]
	});

	// topicgroup
	//     The <topicgroup> element is for creating groups of <topicref> elements without affecting the
	//     hierarchy, as opposed to nested < topicref> elements within a <topicref>, which does imply a
	//     structural hierarchy. It is typically used outside a hierarchy to identify groups for linking
	//     without affecting the resulting toc/navigation output. Category: Mapgroup elements
	configureAsMapSheetFrame(sxModule, 'self::topicgroup', t('untitled topic group'), {
		variation: 'compact-vertical',
		visibleChildSelectorOrNodeSpec: 'self::topicmeta',
		blockHeaderLeft: [createMarkupLabelWidget()]
	});

	// topicmeta
	configureAsRemoved(sxModule, 'self::topicmeta', t('topic metadata'));

	configureAsStructure(sxModule, 'self::topicmeta[parent::topichead]', undefined);

	configureAsInlineFrame(
		sxModule,
		'self::topicmeta[parent::*[fonto:dita-class(., "map/topicref")][parent::relcell or parent::relcolspec]]',
		undefined,
		{
			isAutoremovableIfEmpty: true,
			defaultTextContainer: 'navtitle',
			showWhen: 'never'
		}
	);

	// navtitle in topicmeta in topichead
	configureAsTitleFrame(
		sxModule,
		'self::navtitle and parent::topicmeta[parent::topichead]',
		undefined,
		{
			fontVariation: 'document-title'
		}
	);

	// navtitle in topicmeta in topicref in reltable
	configureAsInlineStructure(
		sxModule,
		'self::navtitle[parent::topicmeta[parent::*[fonto:dita-class(., "map/topicref")][parent::relcell or parent::relcolspec]]]',
		undefined
	);

	// topicref
	configureAsRemoved(sxModule, 'self::topicref', t('link to topic'));

	configureAsInlineLink(
		sxModule,
		'self::*[fonto:dita-class(., "map/topicref") and @href and (parent::relcell or parent::relcolspec)]',
		t('link'),
		mapUsesPermanentReferences ? 'href' : null,
		{
			priority: 3,
			contextualOperations: [
				{
					contents: [
						{ name: ':topicref-move-up--reltable' },
						{ name: ':topicref-move-down--reltable' }
					]
				},
				{
					contents: [
						{ name: ':topicref-move-up--in-relcell' },
						{ name: ':topicref-move-down--in-relcell' },
						{ name: ':topicref-move-right--in-relcell' },
						{ name: ':topicref-move-left--in-relcell' }
					]
				},
				{
					contents: [
						{
							name: ':contextual-open-properties-panel-for-topicref'
						}
					]
				}
			],
			popoverComponentName: 'DitaCrossReferencePopover',
			popoverData: {
				deleteOperationName: ':contextual-remove-topicref--reltable',
				targetIsPermanentId: mapUsesPermanentReferences,
				targetQuery: '@href'
			},
			inlineBefore: [
				createIconWidget('link', {
					clickOperation: ':contextual-convert-to-automatic-topicref',
					tooltipContent: t('Click to make the link text automatically generated')
				})
			]
		}
	);

	configureProperties(
		sxModule,
		'self::*[fonto:dita-class(., "map/topicref") and @href and (parent::relcell or parent::relcolspec) and following-sibling::*[fonto:dita-class(., "map/topicref")]]',
		{
			priority: 4,
			inlineAfter: [
				() => {
					return '\n';
				}
			]
		}
	);

	const CROSSREF_STYLES = applyCss({
		color: '#2196f3',
		textDecoration: 'underline solid',
		cursor: 'pointer'
	});
	configureAsInlineObjectInFrame(
		sxModule,
		`self::*[fonto:dita-class(., "map/topicref") and @href and (parent::relcell or parent::relcolspec)] and
	(: Ignore any PIs + comments, which are likely placeholders :)
	 empty((./text(), ./element())) and
	(: When the selection is here, just render it as a link :)
	 not(fonto:selection-in-node(.))`,
		undefined,
		{
			priority: 5,
			createInnerJsonMl: (sourceNode, _renderer) => [
				'cv-ref',
				{ ...CROSSREF_STYLES, contentEditable: 'false' },
				evaluateXPathToString(
					'import module namespace dita="http://www.fontoxml.com/functions/dita-example"; dita:compute-title(.)',
					sourceNode,
					readOnlyBlueprint
				)
			],
			backgroundColor: 'grey',
			clickOperation: 'select-node',
			doubleClickOperation: ':contextual-convert-to-manual-topicref',
			inlineBefore: []
		}
	);

	// ux-window
	configureAsRemoved(sxModule, 'self::ux-window', t('ux-window'));
}
