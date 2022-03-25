# safe-npm

safe npm time travel installs

## Install

```sh
npm i safe-npm -g
```

You can now use `safe-npm` wherever you were using `npm` before. It's a drop-in replacement.

## What is it?

It wraps and monkey-patches npm to always `install` with the `--before` option set to _**-5 (five) days**_ in the past _**\_except\_**_ for the dependencies you specify in the field `trustedDependencies` in `package.json`, like so:

```json
...
  "trustedDependencies": [
    "decarg",
    "pull-configs",
    "vite-open"
  ],
...
```

Those dependencies will bypass the `--before` option when npm tries to fetch their data. It will only work for the current project's `package.json`, not for dependencies but they will apply to the entire tree so you can point to a deep package as well. This new field is meant to let you still work on modules _**you**_ publish while still mitigate against some of the risks related to 0-day (<5-day :) supply-chain attacks.

Other than that, it should behave exactly like `npm` does so it's drop-in replacement. You can use `safe-npm` wherever you were using `npm` previously.

If you don't want to use this package and you still want to use time travel you can run this command:

```sh
npm i --before=`date -I -d '-5 days'`
```

But this has the problem that it will not pick up packages you just published so you'll be forced to do normal installs for them **which means** that **their** dependencies will NOT be time travelled and be subject to the same security issue. That's the reason this package was made for.

## Disclaimer

This is a hacky solution and will probably fail miserably in random situations. Use at your own risk.

## License

MIT
