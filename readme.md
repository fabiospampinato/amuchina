# Amuchina

A work-in-progress HTML sanitizer that strives for: performance like `window.Sanitizer`, readiness like `DOMPurify`, and ability to run in a `WebWorker` like neither of those.

This is basically an implementation of a _subset_ of the upcoming [Sanitizer API](https://wicg.github.io/sanitizer-api/), but it also supports SVG and MathML out of the box.

## Install

```sh
npm install --save amuchina
```

## Usage

```ts
import Amuchina from 'amuchina';

const amuchina = new Amuchina ();
const parser = new DOMParser ();

const parse = ( html: string ) => parser.parseFromString ( html, 'text/html' );

amuchina.sanitize ( parse ( `<img src="/err" onerror="javascript:alert('naughty!')" />` ) );
```

## License

MIT © Fabio Spampinato
