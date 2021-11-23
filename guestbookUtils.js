const chalk = require("chalk");
const assert = require("assert");

const { promisify } = require("util");

const forGuestbook = (guestbook) => ({
  async read (amount = 0) {
    const logs = await guestbook.logs();
    console.log(
      "\nGuestbook logs:\n",
    );

    for (const { from, contents } of logs.slice(-amount)) {
      console.log(
        `  ${from} writes:\n  ${chalk.bold(`"${contents}"`)}`
      );
    }
    console.log("");
  },

  async sign (contents) {
    const chainId = await web3.eth.getChainId();
    const [from] = await web3.eth.getAccounts();

    const domain = {
      name: "Guestbook",
      version: "1",
      chainId,
      verifyingContract: guestbook.address
    };

    const types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
      ],

      Log: [
        { name: "from", type: "address" },
        { name: "contents", type: "string" }
      ]
    };

    const primaryType = "Log";

    const log = {
      from,
      contents
    };

    console.log(`Signing message. ${chalk.yellow(chalk.bold("Please process signature..."))}`);
    const {
      result: signature
    } = await promisify(web3.currentProvider.send.bind(web3.currentProvider))({
      method: "eth_signTypedData_v4",
      params: [
        from,
        JSON.stringify({
          domain,
          types,
          primaryType,
          message: log
        })
      ],
      from
    });
    if (signature) {
      console.log(chalk.bold("Signed message successfully.\n"));
    } else {
      console.log(chalk.red("Message not signed!"));
      return;
    }

    return {
      log,
      signature
    };
  },

  async submit ({ log, signature }) {
    const [from] = await web3.eth.getAccounts();
    console.log(`Submitting signed log. ${chalk.yellow(chalk.bold("Please process transaction..."))}`);
    try {
      await guestbook.submitSignedLog(log, signature, { from });
      console.log(chalk.bold("Signed message successfully.\n"));
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  }
});

module.exports = {
  forGuestbook
};
