
/* IMPORT */

import 'jsdom-global/register.js';
import benchmark from 'benchloop';
import DOMPurify from 'dompurify';
import Amuchina from '../dist/index.js';
import Fixtures from '../test/fixtures.js';

/* HELPERS */

const parser = new window.DOMParser ();
const parse = html => parser.parseFromString ( html, 'text/html' );

const docs1 = new Array ( 20 ).fill ( 0 ).flatMap ( () => Fixtures.map ( ({ payload }) => parse ( payload ) ) );
const docs2 = new Array ( 20 ).fill ( 0 ).flatMap ( () => Fixtures.map ( ({ payload }) => parse ( payload ) ) );

const amuchina = new Amuchina ();
const purifier = DOMPurify ( window );

purifier.setConfig ({ ADD_TAGS: ['#document-fragment'], IN_PLACE: true, RETURN_DOM: true })

/* MAIN */

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 1,
  log: 'compact'
});

benchmark ({
  name: 'amuchina',
  fn: () => {
    docs1.forEach ( amuchina.sanitize );
  }
});

benchmark ({
  name: 'dompurify',
  fn: () => {
    docs2.forEach ( doc => purifier.sanitize ( doc.body.childNodes ) );
  }
});
