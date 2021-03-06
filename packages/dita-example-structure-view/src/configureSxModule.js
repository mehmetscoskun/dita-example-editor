import configureContextualOperations from 'fontoxml-families/src/configureContextualOperations.js';
import configureAsStructureViewItem from 'fontoxml-families/src/configureAsStructureViewItem.js';

const INSERT_TOPICREF_OPERATION_NAMES = [
	'contextual-insert-topicref--from-template',
	'contextual-insert-topicref--to-existing-document'
];

const MOVE_TOPICREF_OPERATION_NAMES = [
	'contextual-topicref-move-up',
	'contextual-topicref-move-down',
	'contextual-topicref-indent',
	'contextual-topicref-outdent',

	'contextual-topicref-move-to-top',
	'contextual-topicref-move-to-bottom',

	'contextual-topicref-remove'
];

function toContextualOperations(operationName) {
	return {
		name: operationName,
		hideIn: ['context-menu', 'element-menu', 'breadcrumbs-menu']
	};
}

export default function configureSxModule(sxModule) {
	sxModule.markAsAddon();

	configureAsStructureViewItem(sxModule, 'self::map', {
		icon: 'folder-open-o',
		// Recursion is handled by the documents hierarchy
		recursionQuery: '()'
	});

	configureAsStructureViewItem(sxModule, 'self::topicgroup', {
		icon: 'folder-open-o',
		// Recursion is handled by the documents hierarchy
		recursionQuery: '()'
	});

	configureAsStructureViewItem(sxModule, 'self::topichead', {
		icon: 'folder-open-o',
		// Recursion is handled by the documents hierarchy
		recursionQuery: '()'
	});

	configureAsStructureViewItem(sxModule, 'self::glossgroup', {
		icon: 'file-text-o',
		recursionQuery: 'glossentry'
	});

	configureAsStructureViewItem(sxModule, 'fonto:dita-class(., "topic/topic")', {
		icon: 'file-text-o'
	});

	configureContextualOperations(
		sxModule,
		'fonto:dita-class(., "map/map")',
		INSERT_TOPICREF_OPERATION_NAMES.map(toContextualOperations)
	);
	configureContextualOperations(
		sxModule,
		'fonto:dita-class(., "map/topicref")',
		INSERT_TOPICREF_OPERATION_NAMES.concat(MOVE_TOPICREF_OPERATION_NAMES).map(
			toContextualOperations
		)
	);
	configureContextualOperations(
		sxModule,
		'self::mapref',
		MOVE_TOPICREF_OPERATION_NAMES.map(toContextualOperations),
		2
	);
}
