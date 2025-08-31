# Principal Vanity Address Generator (Node.js)

A Node.js implementation of an ICP (Internet Computer Protocol) vanity address generator that creates principals with custom prefixes.

## Features

- Generate ICP principals with custom prefixes
- Uses BIP39 mnemonic phrases for seed generation
- Implements proper ICP derivation path (m/44'/223'/0'/0/0)
- Progress tracking and performance metrics
- Command-line interface

## Installation

1. Navigate to the nodejs folder:
```bash
cd nodejs
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage

Generate a vanity address with default prefix "aaaaa":
```bash
node index.js
```

### Custom Prefix

Generate a vanity address with custom prefix:
```bash
node index.js abc
```



### Help

Show usage information:
```bash
node index.js --help
```

## Examples

```bash
# Generate address with prefix "aaaaa"
node index.js

# Generate address with prefix "hello"
node index.js hello

# Generate address with prefix "abc"
node index.js abc
```

## Output Format

The generator will display:
- Search progress updates every 100,000 attempts
- Final results including:
  - Principal ID
  - BIP39 mnemonic phrase
  - Performance metrics (iterations, time, rate)
  - No private key storage (only mnemonic)

## Dependencies

- `@dfinity/identity-secp256k1`: ICP identity management
- `bip39`: BIP39 mnemonic generation
- `hdkey`: HD wallet key derivation

## Technical Details

- Uses secp256k1 curve for key generation
- Implements BIP39 standard for mnemonic generation
- Follows ICP derivation path: m/44'/223'/0'/0/0
- Generates 12-word mnemonic phrases (128-bit entropy)

## Performance

Performance depends on:
- Target prefix length (longer prefixes take exponentially more time)
- System specifications
- Node.js version

Typical performance: 100-1000 attempts per second depending on system.

## Security Notes

- Generated mnemonics should be kept secure
- Private keys are derived from mnemonics but not stored
- This tool is for educational and development purposes
- Always verify generated addresses before using them for real transactions
