
/* IMPORT */

import {NAMESPACES} from './constants';

/* MAIN */

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

const isScriptOrDataUrl = (() => {

  const re = /^(?:\w+script|data):/i;

  return ( url: string ): boolean => {

    return re.test ( url );

  };

})();

const isScriptOrDataUrlLoose = (() => {

  const re = /(?:script|data):/i;

  return ( url: string ): boolean => {

    return re.test ( url );

  };

})();

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

const traverseElements = ( parent: Node, callback: ( node: Element, parent: Node ) => void ) => {

  let current = parent.firstChild;

  while ( current ) {

    const next = current.nextSibling;

    if ( isElement ( current ) ) {

      callback ( current, parent );

      if ( current.parentNode ) { // Still connected, so recurse

        traverseElements ( current, callback );

      }

    }

    current = next;

  }

};

/* EXPORT */

export {cloneDeep, getNodeNamespace, isElement, isElementAction, isElementIframe, isElementFormAction, isElementHyperlink, isScriptOrDataUrl, isScriptOrDataUrlLoose, mergeMaps, traverseElements};
