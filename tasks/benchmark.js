
/* IMPORT */

import domino from 'domino';
import benchmark from 'benchloop';
import Amuchina from '../dist/index.js';
import Fixtures from '../test/fixtures.js';

/* HELPERS */

class DOMParser {
  parseFromString ( html ) {
    return domino.createWindow ( html ).document;
  }
}

const parser = new DOMParser ();
const parse = html => parser.parseFromString ( html, 'text/html' );
const parsed = new Array ( 20 ).fill ( 0 ).flatMap ( () => Fixtures.map ( ({ payload }) => parse ( payload ) ) );
const amuchina = new Amuchina ();

/* MAIN */

benchmark ({
  iterations: 1,
  name: 'amuchina',
  fn: () => {
    parsed.forEach ( amuchina.sanitize );
  }
});
