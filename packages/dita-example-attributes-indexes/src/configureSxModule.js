import addAttributeIndex from 'fontoxml-indices/src/addAttributeIndex.js';

export default function configureSxModule(_sxModule) {
	// Add an attribute index on id, so that we can quickly find out which element has the id
	// attribute of the ref we have
	addAttributeIndex('', 'href', 'http://www.fontoxml.com/functions/dita-example', 'href-index');
}
