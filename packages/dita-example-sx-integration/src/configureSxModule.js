import configureAsConref from 'fontoxml-dita/src/configureAsConref.js';
import configureAsInlineLink from 'fontoxml-families/src/configureAsInlineLink.js';
import configureAsRemoved from 'fontoxml-families/src/configureAsRemoved.js';
import configureProperties from 'fontoxml-families/src/configureProperties.js';
import namespaceManager from 'fontoxml-dom-namespaces/src/namespaceManager.js';
import registerObjectReviewAnnotationType from 'fontoxml-feedback/src/registerObjectReviewAnnotationType.js';
import t from 'fontoxml-localization/src/t.js';

import configureImageWithoutPermanentId from 'dita-example-sx-modules-xsd-common-element-mod/src/configureImageWithoutPermanentId.js';
import configureHazardsymbolWithoutPermanentId from 'dita-example-sx-modules-xsd-hazard-domain/src/configureHazardsymbolWithoutPermanentId.js';
import CommentCardContent from 'fontoxml-review-reference-configuration/src/ui/comment/CommentCardContent.jsx';

export default function configureSxModule(sxModule) {
	// Mark this configureSxModule.js file as an addon entry file, so that we don't have to explicitly depend on
	// this package from an *-sx-shell. The best practice is to always depend on the specific *-sx-module packages
	// from your own shell.
	sxModule.markAsAddon();

	// Declare the namespace for the dita-example-sx-modules-xsd-mathml-domain / dita-example-sx-modules-xsd-equation-domain packages.
	namespaceManager.addNamespace('mathml', 'http://www.w3.org/1998/Math/MathML');

	// Configuring any element (with a very low priority selector) as "removed" makes sure Fonto will never crash
	// if it encounters an unconfigured element - it will simply be hidden.
	//
	// Make sure you've tested your application without this configuration, in order to more easily detect elements
	// that are lacking configuration.
	configureAsRemoved(sxModule, 'self::*', undefined, {
		priority: -2
	});

	// This is an example configuration for conreffed <note> elements, which is a reuse mechanism in DITA. The
	// configureAsConref family will itself determine wether an XML tag indeed has all the required conref
	// information. Fonto will then render the note in the location of the conref, regardless of which document
	// actually contains the conreffed content.
	configureAsConref(sxModule, 'self::note', 'reused note', {
		contextualOperations: [],
		popoverData: {
			editOperationName: 'contextual-edit-note[@conref]'
		},
		blockHeaderLeft: [],
		blockOutsideAfter: []
	});

	registerObjectReviewAnnotationType('topicref-comment', {
		enabledSelector:
			'self::*[fonto:dita-class(., "map/topicref") and @href and (parent::relcell or parent::relcolspec)]',
		// This has the same name and icon as the 'comment' text range annotation.
		// The "Insert comment" dropdown and the popover that shows on selection change on the
		// /review route both only show menu items / buttons for annotation types that are enabled.
		// This together leads to a single "Add comment" option that works for text ranges and
		// objects.
		icon: 'fas fa-comment',
		label: 'Comment',
		priority: 3,
		CardContentComponent: CommentCardContent
	});

	// Configure everything without permanentIds
	configureImageWithoutPermanentId(sxModule);
	configureHazardsymbolWithoutPermanentId(sxModule);

	// table
	configureProperties(sxModule, 'self::table', {
		contextualOperations: [
			{ name: ':cals-table-insert-title' },
			{ name: ':cals-table-insert-desc' },
			{ name: 'cals-open-table-column-sizing-popover' },
			{ name: 'cals-table-delete' }
		]
	});

	// xref
	configureAsInlineLink(sxModule, 'self::xref[@type="local-project"]', t('link'), undefined, {
		emptyElementPlaceholderText: t('type the link text'),
		popoverComponentName: 'DitaCrossReferencePopover',
		popoverData: {
			editOperationName: ':contextual-edit-xref[@format=dita @type=local-project]',
			targetIsPermanentId: false,
			targetQuery: '@href'
		},
		priority: 1000
	});
	configureAsInlineLink(sxModule, 'self::xref[@type="local-node"]', t('link'), undefined, {
		emptyElementPlaceholderText: t('type the link text'),
		popoverComponentName: 'DitaCrossReferencePopover',
		popoverData: {
			editOperationName: ':contextual-edit-xref[@format=dita @type=local-node]',
			targetIsPermanentId: false,
			targetQuery: '@href'
		},
		priority: 1000
	});
}
