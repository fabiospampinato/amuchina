
/* IMPORT */

import {NAMESPACES_ELEMENTS, NAMESPACES_ROOTS, NAMESPACES_PREFIXES} from './constants';
import {DEFAULTS} from './constants';
import {castFragment, cloneDeep, getNodeNamespace, isComment, isElement, isElementAction, isElementIframe, isElementFormAction, isElementHyperlink, isScriptOrDataUrl, isText, traverse} from './utils';
import type {Configuration} from './types';

/* MAIN */

//TODO: Use window.Sanitizer under the hood once it ships and if it's significantly faster and if this is executed in a browser environment
//TODO: Add support for running this in a WebWorker with a thin DOM library (no JSDOM)
//TODO: Add a decent test suite, possibly one from an existing trusted library

class Amuchina {

  /* VARIABLES */

  #configuration: Configuration;
  #allowComments: boolean;
  #allowElements: Set<string>;
  #allowAttributes: Record<string, string[]>;

  /* CONSTRUCTOR */

  constructor ( configuration: Configuration = {} ) {

    const {allowCustomElements, allowUnknownMarkup, blockElements, dropElements, dropAttributes} = configuration;

    if ( allowCustomElements ) throw new Error ( 'A true "allowCustomElements" is not supported yet' );
    if ( allowUnknownMarkup ) throw new Error ( 'A true "allowUnknownMarkup" is not supported yet' );
    if ( blockElements ) throw new Error ( '"blockElements" is not supported yet, use "allowElements" instead' );
    if ( dropElements ) throw new Error ( '"dropElements" is not supported yet, use "allowElements" instead' );
    if ( dropAttributes ) throw new Error ( '"dropAttributes" is not supported yet, use "allowAttributes" instead' );

    this.#configuration = cloneDeep ( DEFAULTS );

    const {allowComments, allowElements, allowAttributes} = configuration;

    if ( allowComments ) this.#configuration.allowComments = true;
    if ( allowElements ) this.#configuration.allowElements = configuration.allowElements;
    if ( allowAttributes ) this.#configuration.allowAttributes = configuration.allowAttributes;

    this.#allowComments = !!this.#configuration.allowComments;
    this.#allowElements = new Set ( this.#configuration.allowElements );
    this.#allowAttributes = this.#configuration.allowAttributes || {};

  }

  /* API */

  getConfiguration = (): Configuration => {

    return cloneDeep ( this.#configuration );

  }

  sanitize = ( input: Document | DocumentFragment ): DocumentFragment => {

    //TODO: Support integration points (foreignObject and friends)
    //TODO: Support xlink:href, xml:id, xlink:title, xml:space, xmlns:xlink

    const allowComments = this.#allowComments;
    const allowElements = this.#allowElements;
    const allowAttributes = this.#allowAttributes;

    const fragment = castFragment ( input );

    traverse ( fragment, ( node, parent ) => {

      if ( isComment ( node ) ) {

        if ( !allowComments ) {

          parent.removeChild ( node );

        }

      } else if ( isElement ( node ) ) {

        const namespace = getNodeNamespace ( node );
        const namespaceParent = getNodeNamespace ( parent );
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

          for ( let i = 0; i < attributes.length; i++ ) {

            const attribute = attributes[i];
            const allowedValues = allowAttributes[attribute];

            if ( !allowedValues || ( !allowedValues.includes ( allPrefixed ) && !allowedValues.includes ( tagPrefixed ) ) ) {

              node.removeAttribute ( attribute );

            }

          }

          if ( isElementHyperlink ( node ) ) {

            if ( isScriptOrDataUrl ( node.protocol ) ) {

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

            node.setAttribute ( 'sandobx', 'allow-scripts' ); //TODO: This is kinda arbitrary, it should be customizable and more flexible

          }

        }

      } else if ( !isText ( node ) ) {

        parent.removeChild ( node );

      }

    });

    return fragment;

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
