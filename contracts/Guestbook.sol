// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

struct Log {
  address from;
  string contents;
}

contract Guestbook is EIP712 {
  Log[] _logs;

  error InvalidSigner(
    address actual,
    address expected
  );

  constructor()
    EIP712("Guestbook", "1")
  {
  }

  function logs()
    public
    view
    returns (Log[] memory)
  {
    Log[] memory entries = new Log[](_logs.length);
    for (uint256 i = 0; i < _logs.length; i++) {
      entries[i] = _logs[i];
    }

    return entries;
  }

  function submitSignedLog(
    Log memory log,
    bytes memory signature
  )
    public
    onlyValidSignature(log, signature)
  {
    _logs.push(log);
  }

  modifier onlyValidSignature(Log memory log, bytes memory signature) {
    address recoveredSigner = recoverSigner(log, signature);

    if (recoveredSigner != log.from) {
      revert InvalidSigner(recoveredSigner, log.from);
    }

    _;
  }

  function recoverSigner(Log memory log, bytes memory signature)
    public
    view
    returns (address)
  {
    bytes32 digest = _hashTypedDataV4(
      keccak256(abi.encode(
        keccak256("Log(address from,string contents)"),
        log.from,
        keccak256(bytes(log.contents))
      ))
    );

    return ECDSA.recover(digest, signature);
  }
}
