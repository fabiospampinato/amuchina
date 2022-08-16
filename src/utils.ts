
/* IMPORT */

import {FUNKY_TAG_NAMES} from './constants';

/* MAIN */

const cloneDeep = <T> ( value: T ): T => {

  return JSON.parse ( JSON.stringify ( value ) );

};

const isElement = ( value: Node ): value is Element => {

  return ( value.nodeType === 1 );

};

const isElementFunky = ( value: Element ): boolean => {

  return FUNKY_TAG_NAMES.has ( value.tagName );

};

const isElementAction = ( value: Element ): value is HTMLFormElement => {

  return ( 'action' in value );

};

const isElementIframe = ( value: Element ): value is HTMLIFrameElement => {

  return ( value.tagName === 'IFRAME' );

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

const traverseElementsBasic = ( parent: Node, callback: ( node: Element, parent: Node ) => void ) => {

  let current = parent.firstChild;

  while ( current ) {

    const next = current.nextSibling;

    if ( isElement ( current ) ) {

      callback ( current, parent );

      if ( current.parentNode ) { // Still connected, so recurse

        traverseElementsBasic ( current, callback );

      }

    }

    current = next;

  }

};

const traverseElementsIterator = ( parent: Node, callback: ( node: Element, parent: Node ) => void ) => {

  const iterator = document.createNodeIterator ( parent, NodeFilter.SHOW_ELEMENT );

  let current: Node | null | undefined;

  while ( current = iterator.nextNode () ) {

    const parent = current.parentNode;

    if ( !parent ) continue;

    callback ( current as Element, parent ); //TSC

  }

};

const traverseElements = ( parent: Node, callback: ( node: Element, parent: Node ) => void ) => {

  const hasIterator = !!globalThis.document && !!globalThis.document.createNodeIterator; // For better WebWorker support

  if ( hasIterator ) {

    return traverseElementsIterator ( parent, callback );

  } else {

    return traverseElementsBasic ( parent, callback );

  }

};

/* EXPORT */

export {cloneDeep, isElement, isElementFunky, isElementAction, isElementIframe, isElementFormAction, isElementHyperlink, isScriptOrDataUrl, isScriptOrDataUrlLoose, mergeMaps, traverseElements};
