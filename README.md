# guestbook-712

Example Guestbook contract using [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
signatures

## Contents

This repository houses a Truffle project.

It contains the following core components:

- [`Guestbook.sol`](https://github.com/gnidan/guestbook-712/blob/master/contracts/Guestbook.sol)
    smart contract in Solidity using @openzeppelin/contracts for EIP-712
    verification.
- [`guestbookUtils.js`](https://github.com/gnidan/guestbook-712/blob/master/guestbookUtils.js)
    helpers for performing signature operations for a given deployed `Guestbook`

### Notes about this Truffle project

- There's no `Migrations.sol`. Yep, that file is completely optional.
- Compiler version is specified as `version: "pragma"`. Did you know you could
  do that? :smile:
- Ignore the weird RPC URL. No secret unreleased features here. :shushing_face:
- The `console:` section in `truffle-config.js` is recent new functionality.
  Pretty handy!

## `Guestbook` contract

Aggregates signed log entries. This contract defines an EIP-712 schema and
verifies the validity of the signature for each entry.

Anyone may spend gas to submit a signed guestbook log from anyone else, as long
as the signature and message match.

## `guestbookUtils.js` module

This module serves as a `truffle console` "require" hook, adding the
`forGuestbook` global function to the console scope.

### Usage

1. Run `truffle console` or `truffle develop`
2. Ensure you have run migrations (i.e. with `truffle migrate` command)
3. Initialize utils:

   ```javascript
   // get deployed guestbook
   truffle(develop)> const guestbook = await Guestbook.deployed();

   // pass instance to function defined by "require" hook
   truffle(develop)> const utils = forGuestbook(guestbook);

   // read current guestbook logs
   truffle(develop)> utils.read();

   // sign message and capture result to variable
   truffle(develop)> const signedMessage = await utils.sign("hi!");

   // submit signed message in transaction to save
   truffle(develop)> utils.submit(signedMessage);

   // read guestbook logs again and see new entry
   truffle(develop)> utils.read();
   ```
