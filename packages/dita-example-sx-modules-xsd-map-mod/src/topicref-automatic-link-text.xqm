module namespace dita="http://www.fontoxml.com/functions/dita-example";
import module namespace fonto="http://www.fontoxml.com/functions";

declare %public function dita:compute-title($node as element()) as xs:string {
	let $url := $node/@href
	let $is-loaded := fonto:is-document-loaded($url)
	return if ($is-loaded) then
		(: document is loaded, just return the title content :)
		fonto:document($url)/* => fonto:title-content()
	else
	 (: Document is not loaded, try to find a map referencing the document :)
	 let $topicref := dita:href-index($url)[not(parent::relcell or parent::relcolspec)][1]
	 let $titleA := $topicref/topicmeta/navtitle
	 return if (not($topicref)) then
	 	"Unknown topicref" else
		if (not($titleA)) then "No title" else string($titleA[1])
};

declare %public %updating function dita:convert-topicref-to-manual ($node as element()) {
	insert node (
		<topicmeta>
			<navtitle>
				<?fontoxml-selection-start?>
				{dita:compute-title($node)}
				<?fontoxml-selection-end?>
			</navtitle>
		</topicmeta>
	) into $node
};

declare %public %updating function dita:convert-topicref-to-automatic ($node as element()) {
	delete nodes $node/node(),
	insert node <?fontoxml-selection ?> after $node
};
