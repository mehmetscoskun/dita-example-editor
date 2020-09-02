import uiManager from 'fontoxml-modular-ui/src/uiManager.js';
import FormulaPopover from './ui/FormulaPopover.jsx';

export default function install() {
	uiManager.registerReactComponent('FormulaPopover', FormulaPopover);
}
