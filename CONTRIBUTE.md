# How to contribute
Anyone can contribute to this project by following these principles.

## Getting started
Fork the project to your own account and clone it to your computer.

## Pull requests
All changes must be suggested through pull-requests.

Explain what your change contributes to the goals of the project clearly. Participate in the discussions regarding your request.

## Branches
Work in branches and name them following these rules:
- `feature-[name goes here]` for new features
- `fix-[name goes here]` for bug fixes or improvements on already existing features
- `docs-[name goes here]` for anything related to documentation

Always make sure you have the latest version of the code downloaded before you create a new branch.

## Convetions
Follow the conventions already established in the project. This means file naming conventions as well as naming conventions for variables, Prisma Schemas, etc.

## Formatters
Do not use formatters such as Prettier or automatic linting, as these will affect files that are not part of your proposed change.

## Version changes and releases
Only the project owner should update versions and edit the changelog.

## Documentation
This project uses Insomnia and the NPM package `insomnia-documenter` for the interactive API documentation.
Make sure to use [this version](https://github.com/Kong/insomnia/releases/tag/core%402023.2.2) of Insomnia, as later version no longer supports JSON exports.

There is a script in package.json for updating the interactive documentation:
```console
npm run generate-docs
```