import React, { useState } from 'react';

import { Popover, PopoverBody, PopoverFooter, PopoverHeader, TextInput } from 'fds/components';

import documentsManager from 'fontoxml-documents/src/documentsManager.js';
import FxOperationButton from 'fontoxml-fx/src/FxOperationButton.jsx';
import t from 'fontoxml-localization/src/t.js';
import parsePseudoAttributes from 'fontoxml-dom-utils/src/parsePseudoAttributes.js';

const FormulaPopover = ({ data: { contextNodeId }, togglePopover }) => {
	const formulaNode = documentsManager.getNodeById(contextNodeId);
	const attributes = parsePseudoAttributes(formulaNode.data);
	const [formula, setFormula] = useState(attributes.formula);
	const [dependants, setDependants] = useState(attributes.dependants);

	const handleFormula = (value) => {
		setFormula(value || 'null');
	};

	const handleDependants = (value) => {
		setDependants(value);
	};

	return (
		<Popover maxWidth="300px" minWidth="220px">
			<PopoverHeader title={t('Column type')} />

			<PopoverBody>
				<TextInput value={formula} onChange={handleFormula} />
				<TextInput value={dependants} onChange={handleDependants} />
			</PopoverBody>

			<PopoverFooter>
				<FxOperationButton
					type="primary"
					label={t('Save')}
					operationName="execute-update-script"
					operationData={{
						expression: `replace value of node $data('contextNode') with 'formula="${
							formula || 'null'
						}" dependants="${dependants || 'null'}"'`,
						contextNodeId,
					}}
					onClick={togglePopover}
				/>
			</PopoverFooter>
		</Popover>
	);
};

FormulaPopover.hidePopoverInReadOnlyViews = true;

export default FormulaPopover;
