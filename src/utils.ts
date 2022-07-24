
/* IMPORT */

import {NAMESPACES} from './constants';

/* MAIN */

const castFragment = ( value: Document | DocumentFragment ): DocumentFragment => {

  if ( isDocumentFragment ( value ) ) return value;

  const fragment = new DocumentFragment ();

  fragment.appendChild ( value.documentElement );

  return fragment;

};

const cloneDeep = <T> ( value: T ): T => {

  return JSON.parse ( JSON.stringify ( value ) );

};

const getNodeNamespace = ( node: Node ): 'HTML' | 'SVG' | 'MATH' => {

  if ( isElement ( node ) ) {

    const namespace = node.namespaceURI;

    if ( namespace === NAMESPACES.MATH ) return 'MATH';

    if ( namespace === NAMESPACES.SVG ) return 'SVG';

  }

  return 'HTML';

};

const isComment = ( value: Node ): value is Comment => {

  return ( value.nodeType === 8 );

};

const isDocument = ( value: Node ): value is Document => {

  return ( value.nodeType === 9 );

};

const isDocumentFragment = ( value: Node ): value is DocumentFragment => {

  return ( value.nodeType === 11 );

};

const isElement = ( value: Node ): value is Element => {

  return ( value.nodeType === 1 );

};

const isElementAction = ( value: Element ): value is HTMLFormElement => {

  return ( 'action' in value );

};

const isElementIframe = ( value: Element ): value is HTMLIFrameElement => {

  return ( value.tagName.toLowerCase () === 'iframe' );

};

const isElementFormAction = ( value: Element ): value is HTMLInputElement | HTMLButtonElement => {

  return ( 'formAction' in value );

};

const isElementHyperlink = ( value: Element ): value is HTMLAnchorElement | HTMLAreaElement => {

  return ( 'protocol' in value );

};

const isScriptOrDataUrl = ( url: string ): boolean => {

  const re = /^(?:\w+script|data):/i;

  return re.test ( url );

};

const isText = ( value: Node ): value is Text => {

  return ( value.nodeType === 3 );

};

const mergeMaps = ( maps: Record<string, string[]>[] ): Record<string, string[]> => {

  const merged: Record<string, string[]> = {};

  for ( let i = 0, l = maps.length; i < l; i++ ) {

    const map = maps[i];

    for ( const key in map ) {

      if ( !merged[key] ) {

        merged[key] = map[key];

      } else {

        merged[key] = merged[key].concat ( map[key] );

      }

    }

  }

  return merged;

};

const traverse = ( parent: Node, callback: ( node: Node, parent: Node ) => void ) => {

  const childNodes = parent.childNodes;

  for ( let i = childNodes.length - 1; i >= 0; i-- ) { // Looping from the end so that if a child gets disconnected it doesn't matter

    const child = childNodes[i];

    callback ( child, parent );

    if ( !child.parentNode ) continue; // Got disconnected, skipping

    traverse ( child, callback );

  }

};

/* EXPORT */

export {castFragment, cloneDeep, getNodeNamespace, isComment, isDocument, isDocumentFragment, isElement, isElementAction, isElementIframe, isElementFormAction, isElementHyperlink, isScriptOrDataUrl, isText, mergeMaps, traverse};
