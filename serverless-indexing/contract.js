export async function handle(state, action) {
  const input = action.input;

  if (input.function === "indexTransaction") {
    const { jwk_n, sig, txid } = input;

    _validateArweaveAddress(txid);
    await _verifyArSignature(jwk_n, sig);

    ContractAssert(!(txid in state.cache), "ERROR_TXID_ALREADY_INDEXED");

    state.cache[txid] = await _getTxData(txid);
    return { state };
  }

  if (input.function === "deleteSigs") {
    const { jwk_n, sig } = input;

    _validateArweaveAddress(txid);
    await _verifyArSignature(jwk_n, sig);

    state.signatures = [];
    return { state };
  }

  function _validateArweaveAddress(address) {
    ContractAssert(
      /[a-z0-9_-]{43}/i.test(address),
      "ERROR_INVALID_ARWEAVE_ADDRESS"
    );
  }

  function _validateOwnerSyntax(owner) {
    ContractAssert(
      typeof owner === "string" && owner?.length === 683,
      "ERROR_INVALID_JWK_N_SYNTAX"
    );
  }

  async function _ownerToAddress(pubkey) {
    try {
      _validateOwnerSyntax(pubkey);
      const req = await EXM.deterministicFetch(
        `${state.ar_molecule_endpoint}/ota/${pubkey}`
      );
      const address = req.asJSON()?.address;
      _validateArweaveAddress(address);
      return address;
    } catch (error) {
      throw new ContractError("ERROR_MOLECULE_SERVER_ERROR");
    }
  }

  async function _verifyArSignature(owner, signature) {
    try {
      const caller = await _ownerToAddress(owner);
      ContractAssert(caller === state.admin, "ERROR_INVALID_CALLER");
      ContractAssert(
        !state.signatures.includes(signature),
        "ERROR_SIGNATURE_ALREADY_USED"
      );

      const encodedMessage = new TextEncoder().encode(
        `permacast-index-data-bloodstone`
      );
      const typedArraySig = Uint8Array.from(atob(signature), (c) =>
        c.charCodeAt(0)
      );
      const isValid = await SmartWeave.arweave.crypto.verify(
        owner,
        encodedMessage,
        typedArraySig
      );

      ContractAssert(isValid, "ERROR_INVALID_CALLER_SIGNATURE");

      state.signatures.push(signature);
    } catch (error) {
      throw new ContractError("ERROR_INVALID_CALLER_SIGNATURE");
    }
  }

  async function _getTxData(txid) {
    try {
      const req = await EXM.deterministicFetch(`https://arweave.net/${txid}`);
      const data = req.asText();
      return data;
    } catch (error) {
      throw new ContractError(`ERROR_GETTING_TX_DATA`);
    }
  }
}
