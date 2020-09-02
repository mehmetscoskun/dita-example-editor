import React from 'react';

import { MastheadToolbar, MastheadToolbarButtons } from 'fds/components';

import QuickAccessSymbolsDropButton from 'dita-example-special-characters/src/QuickAccessSymbolsDropButton.jsx';

import FxOperationButton from 'fontoxml-fx/src/FxOperationButton.jsx';

const StartToolbar = () => (
	<MastheadToolbar>
		<MastheadToolbarButtons>
			<FxOperationButton label="" operationName="cut" />
			<FxOperationButton label="" operationName="copy" />
			<FxOperationButton label="" operationName="paste" />
		</MastheadToolbarButtons>

		<MastheadToolbarButtons>
			<FxOperationButton label="" operationName=":toggle-b" />
			<FxOperationButton label="" operationName=":toggle-i" />
			<FxOperationButton label="" operationName=":toggle-u" />
			<FxOperationButton label="" operationName=":toggle-line-through" />
		</MastheadToolbarButtons>

		<MastheadToolbarButtons>
			<FxOperationButton label="" operationName=":toggle-sub" />
			<FxOperationButton label="" operationName=":toggle-sup" />
		</MastheadToolbarButtons>

		<MastheadToolbarButtons>
			<FxOperationButton label="" operationName=":insert-ul" />
			<FxOperationButton label="" operationName=":insert-ol" />
			<FxOperationButton label="" operationName=":insert-sl" />
			<FxOperationButton label="" operationName="indent-list-item" />
			<FxOperationButton label="" operationName="outdent-list-item" />
		</MastheadToolbarButtons>

		<MastheadToolbarButtons>
			<QuickAccessSymbolsDropButton />
		</MastheadToolbarButtons>

		<MastheadToolbarButtons>
			<FxOperationButton label="" operationName="insert-formula" />
		</MastheadToolbarButtons>
	</MastheadToolbar>
);

export default StartToolbar;
