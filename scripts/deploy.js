const { ethers, run, network } = require("hardhat");

function loggerReceipt(_contractReceipt) {
    console.log(``);
    console.log(`🌈 - Contract Deployed!`);
    console.log(`👤 - Deployer Address: ${_contractReceipt.from}`);
    console.log(`📍 - Contract Address: ${_contractReceipt.contractAddress}`);

    if (network.name !== "hardhat") {
        console.log(`🤑 - Gaz used: ${_contractReceipt.gasUsed.toString()}`);
    }
    console.log(``);
}

async function verify(contractAddress, args) {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log(`✅ - ${err.message}`);
        } else {
            console.log(`❌ - Error message: ${err}`);
        }
    }
}

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );

    console.log(``);
    console.log(`⌛ - Deploying, please wait...`);
    console.log(``);

    const simpleStorage = await SimpleStorageFactory.deploy();

    if (network.name === "goerli") {
        console.log(
            `🌐 - View TX on etherscan: https://goerli.etherscan.io/tx/${simpleStorage.deployTransaction.hash}`
        );
    }

    await simpleStorage.deployed();
    const txReceipt = await simpleStorage.deployTransaction.wait();
    loggerReceipt(txReceipt);

    if (network.name !== "hardhat" && process.env.ETHERSCAN_API_KEY) {
        console.log(`⌛ - Verifying on Etherscan, please wait...`);
        console.log(``);
        await simpleStorage.deployTransaction.wait(6);
        await verify(txReceipt.contractAddress, []);
    }

    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`);

    const transactionResponse = await contract.store("7");
    await transactionResponse.wait(1);

    const updatedFavoriteNumber = await contract.retrieve();
    console.log(`Updated favorite number: ${updatedFavoriteNumber.toString()}`);
}

main().then(() => {
    process.exit(0).catch((error) => {
        console.log(error);
        process.exit(1);
    });
});
