import React, { useState } from 'react';

import { Popover, PopoverBody, PopoverFooter, PopoverHeader, TextInput } from 'fds/components';

import FxOperationButton from 'fontoxml-fx/src/FxOperationButton.jsx';
import t from 'fontoxml-localization/src/t.js';

const FormulaPopover = ({ data: { contextNodeId, initialTypeValue }, togglePopover }) => {
	const [typeValue, setTypeValue] = useState(initialTypeValue);

	const handleChange = (value) => {
		setTypeValue(value);
	};

	return (
		<Popover maxWidth="300px" minWidth="220px">
			<PopoverHeader title={t('Column type')} />

			<PopoverBody>
				<TextInput value={typeValue} onChange={handleChange} />
			</PopoverBody>

			<PopoverFooter>
				<FxOperationButton
					type="primary"
					label={t('Save')}
					operationName="replace-text"
					operationData={{
						contextNodeId,
						attributes: { type: typeValue || null },
					}}
					onClick={togglePopover}
				/>
			</PopoverFooter>
		</Popover>
	);
};

FormulaPopover.hidePopoverInReadOnlyViews = true;

export default FormulaPopover;
