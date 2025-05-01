# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
* Media controller for deleting media files
* makedb bash script
* db:generate npm script
* the product controller createProduct now supports adding media to the resource
* the product controller updateProduct now supports adding media to an existing resource
* the product controller updateProduct now supports removing media from an existing resource

### Removed
* All prisma generated files and folders

### Updated
* .gitignore now ignores all prisma generated files and folders
* POST /api/vq/products now has a check for correct content-type header

### Fixed
* makedb bash script has been fixed. The problem was that it prevented later scripts from being executed

## [0.1.0] - 2025-04-30
### Added
* Patch and delete methods for the products resource

[unreleased]: https://github.com/rts-cmk/the-amazing-api/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rts-cmk/the-amazing-api/releases/tag/v0.1.0