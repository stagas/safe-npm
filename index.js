#!/usr/bin/env node

const read = require('fs').readFileSync
const path = require('path')
const pkg = read(path.join(process.cwd(), 'package.json'))
const npm = require('./node_modules/npm/lib/cli')
const RegistryFetcher = require('./node_modules/npm/node_modules/pacote').RegistryFetcher

// package json trustedDependencies only are allowed to bypass time travel
const trustedDependencies = JSON.parse(pkg).trustedDependencies || []

// monkey patch manifest
const manifest = RegistryFetcher.prototype.manifest
RegistryFetcher.prototype.manifest = function() {
  if (trustedDependencies.includes(this.spec.name))
    this.before = null
  return manifest.apply(this, arguments)
}

// when installing
if (process.argv.includes('i') || process.argv.includes('install')) {
  // add "--before=-5days" to install arguments if not already
  if (!process.argv.some(arg => arg.startsWith('--before='))) {
    const d = new Date()
    process.argv.push('--before=' + new Date(d.setDate(d.getDate() - 5)).toISOString())
  }

  // add "-E" (save-exact) to pin installing version
  if (!process.argv.includes('-E') && !process.argv.includes('--save-exact'))
    process.argv.push('-E')
}

npm(process)
