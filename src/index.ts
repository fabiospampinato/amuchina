
/* IMPORT */

import {NAMESPACES, NAMESPACES_ELEMENTS, NAMESPACES_ROOTS, NAMESPACES_PREFIXES} from './constants';
import {DEFAULTS} from './constants';
import {cloneDeep, isElementFunky, isElementAction, isElementIframe, isElementFormAction, isElementHyperlink, isScriptOrDataUrl, isScriptOrDataUrlLoose, traverseElements} from './utils';
import type {Configuration} from './types';

/* MAIN */

//TODO: Add a decent test suite, possibly one from an existing trusted library

class Amuchina {

  /* VARIABLES */

  #configuration: Configuration;
  #allowElements: Set<string>;
  #allowAttributes: Record<string, Set<string>>;

  /* CONSTRUCTOR */

  constructor ( configuration: Configuration = {} ) {

    const {allowComments, allowCustomElements, allowUnknownMarkup, blockElements, dropElements, dropAttributes} = configuration;

    if ( allowComments === false ) throw new Error ( 'A false "allowComments" is not supported yet' );
    if ( allowCustomElements ) throw new Error ( 'A true "allowCustomElements" is not supported yet' );
    if ( allowUnknownMarkup ) throw new Error ( 'A true "allowUnknownMarkup" is not supported yet' );
    if ( blockElements ) throw new Error ( '"blockElements" is not supported yet, use "allowElements" instead' );
    if ( dropElements ) throw new Error ( '"dropElements" is not supported yet, use "allowElements" instead' );
    if ( dropAttributes ) throw new Error ( '"dropAttributes" is not supported yet, use "allowAttributes" instead' );

    this.#configuration = cloneDeep ( DEFAULTS );

    const {allowElements, allowAttributes} = configuration;

    if ( allowElements ) this.#configuration.allowElements = configuration.allowElements;
    if ( allowAttributes ) this.#configuration.allowAttributes = configuration.allowAttributes;

    this.#allowElements = new Set ( this.#configuration.allowElements );
    this.#allowAttributes = Object.fromEntries ( Object.entries ( this.#configuration.allowAttributes || {} ).map ( ([ element, attributes ]) => [element, new Set ( attributes )] ) );

  }

  /* API */

  getConfiguration = (): Configuration => {

    return cloneDeep ( this.#configuration );

  }

  sanitize = <T extends Document | DocumentFragment> ( input: T ): T => {

    //TODO: Support integration points (foreignObject and friends)
    //TODO: Support xlink:href, xml:id, xlink:title, xml:space, xmlns:xlink

    const allowElements = this.#allowElements;
    const allowAttributes = this.#allowAttributes;

    traverseElements ( input, ( node, parent ) => {

      const namespace = node.namespaceURI || NAMESPACES.HTML;
      const namespaceParent = parent['namespaceURI'] || NAMESPACES.HTML;
      const elements = NAMESPACES_ELEMENTS[namespace];
      const root = NAMESPACES_ROOTS[namespace];
      const prefix = NAMESPACES_PREFIXES[namespace];

      const tag = node.tagName.toLowerCase ();
      const tagPrefixed = `${prefix}${tag}`;
      const all = '*';
      const allPrefixed = `${prefix}${all}`;

      if ( !elements.has ( tag ) || !allowElements.has ( tagPrefixed ) || ( namespace !== namespaceParent && tag !== root ) ) {

        parent.removeChild ( node );

      } else {

        const attributes = node.getAttributeNames ();
        const attributesLength = attributes.length;

        if ( attributesLength ) {

          for ( let i = 0; i < attributesLength; i++ ) {

            const attribute = attributes[i];
            const allowedValues = allowAttributes[attribute];

            if ( !allowedValues || ( !allowedValues.has ( allPrefixed ) && !allowedValues.has ( tagPrefixed ) ) ) {

              node.removeAttribute ( attribute );

            }

          }

          if ( isElementFunky ( node ) ) {

            if ( isElementHyperlink ( node ) ) {

              const href = node.getAttribute ( 'href' );

              if ( href && isScriptOrDataUrlLoose ( href ) && isScriptOrDataUrl ( node.protocol ) ) {

                node.removeAttribute ( 'href' );

              }

            } else if ( isElementAction ( node ) ) {

              if ( isScriptOrDataUrl ( node.action ) ) {

                node.removeAttribute ( 'action' );

              }

            } else if ( isElementFormAction ( node ) ) {

              if ( isScriptOrDataUrl ( node.formAction ) ) {

                node.removeAttribute ( 'formaction' );

              }

            } else if ( isElementIframe ( node ) ) {

              if ( isScriptOrDataUrl ( node.src ) ) {

                node.removeAttribute ( 'formaction' );

              }

              node.setAttribute ( 'sandbox', 'allow-scripts' ); //TODO: This is kinda arbitrary, it should be customizable and more flexible

            }

          }

        }

      }

    });

    return input;

  }

  sanitizeFor = ( element: string, input: string ): Element | undefined => {

    throw new Error ( '"sanitizeFor" is not implemented yet' );

  }

  /* STATIC API */

  static getDefaultConfiguration = (): Configuration => {

    return cloneDeep ( DEFAULTS );

  }

}

/* EXPORT */

export default Amuchina;
export type {Configuration};
