async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  const registry = await ProductRegistry.deploy();
  await registry.deployed();

  console.log("✅ ProductRegistry deployed to:", registry.address);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
