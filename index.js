const { Secp256k1KeyIdentity } = require('@dfinity/identity-secp256k1');
const bip39 = require('bip39');
const HDKey = require('hdkey');
const crypto = require('crypto');

/**
 * Generate a random ICP identity with mnemonic and secret key
 * @returns {Promise<{principal: string, mnemonic: string, secretKey: Buffer}>}
 */
async function generateIdentity() {
    try {
        // Generate random entropy (12 words → 128 bit entropy)
        const entropy = crypto.randomBytes(16);
        const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));
        
        // Create seed from mnemonic
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        
        // Create HD wallet
        const hdkey = HDKey.fromMasterSeed(seed);
        
        // ICP derivation path: m/44'/223'/0'/0/0
        const derivationPath = "m/44'/223'/0'/0/0";
        const childKey = hdkey.derive(derivationPath);
        
        // Get private key
        const privateKey = childKey.privateKey;
        
        // Create ICP Identity
        const identity = Secp256k1KeyIdentity.fromSecretKey(privateKey);
        const principal = identity.getPrincipal().toText();
        
        return {
            principal,
            mnemonic,
            secretKey: privateKey
        };
    } catch (error) {
        throw new Error(`Error generating identity: ${error.message}`);
    }
}

/**
 * Main vanity address generator function
 * @param {string} targetPrefix - The desired prefix for the principal
 */
async function generateVanityAddress(targetPrefix = 'aaaaa') {
    const startTime = Date.now();
    let iterations = 0;
    
    console.log(`Searching for ICP Principal with prefix: '${targetPrefix}'`);
    console.log(`Estimated attempts needed: ~${Math.pow(32, targetPrefix.length).toFixed(0)}`);
    console.log(`Using Node.js with async/await`);
    console.log();
    
    try {
        while (true) {
            iterations++;
            
            const result = await generateIdentity();
            const { principal, mnemonic, secretKey } = result;
            
            if (principal.startsWith(targetPrefix)) {
                const elapsed = (Date.now() - startTime) / 1000;
                console.log(`\nMATCH FOUND after ${iterations.toLocaleString()} iterations!`);
                console.log(`Time elapsed: ${elapsed.toFixed(2)}s`);
                console.log(`Principal: ${principal}`);
                console.log(`Mnemonic: ${mnemonic}`);
                console.log(`Rate: ${Math.round(iterations / elapsed)} attempts/second`);
                console.log(`\nVanity address generation completed successfully!`);
                break;
            }
            
            // Progress update every 100k iterations
            if (iterations % 100000 === 0) {
                const elapsed = (Date.now() - startTime) / 1000;
                const rate = Math.round(iterations / elapsed);
                console.log(`[${iterations.toLocaleString()}] sample: ${principal} | rate: ${rate} attempts/sec`);
            }
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Generate multiple vanity addresses
 * @param {string} targetPrefix - The desired prefix
 * @param {number} count - Number of addresses to generate
 */
async function generateMultipleAddresses(targetPrefix = 'aaaaa', count = 1) {
    console.log(`Generating ${count} vanity address(es) with prefix: '${targetPrefix}'`);
    console.log();
    
    for (let i = 1; i <= count; i++) {
        console.log(`--- Generating address ${i}/${count} ---`);
        await generateVanityAddress(targetPrefix);
        if (i < count) {
            console.log('\n' + '='.repeat(50) + '\n');
        }
    }
}

// Command line interface
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
ICP Vanity Address Generator

Usage:
  node index.js [prefix] [count]

Options:
  prefix    Target prefix for the principal (default: aaaaa)
  count     Number of addresses to generate (default: 1)

Examples:
  node index.js aaaaa
  node index.js abc
  node index.js --help

Dependencies:
  - @dfinity/identity-secp256k1
  - bip39
  - hdkey
        `);
        return;
    }
    
    const targetPrefix = args[0] || 'aaaaa';
    const count = parseInt(args[1]) || 1;
    
    if (count === 1) {
        generateVanityAddress(targetPrefix);
    } else {
        generateMultipleAddresses(targetPrefix, count);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = {
    generateIdentity,
    generateVanityAddress,
    generateMultipleAddresses
};
