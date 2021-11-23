const Guestbook = artifacts.require("Guestbook");

module.exports = async (deployer) => {
  await deployer.deploy(Guestbook);
};
