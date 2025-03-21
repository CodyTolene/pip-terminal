import * as fs from 'fs';
import * as path from 'path';

const inputFilePath = path.resolve(__dirname, 'FW.js');
const outputDir = path.resolve(__dirname, 'output');
const outputFilePath = path.join(outputDir, 'fw-refs.txt');

if (!fs.existsSync(inputFilePath)) {
    console.error('Input file not found:', inputFilePath);
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const functionRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/g;  // Captures named functions & params
const arrowFunctionRegex = /([a-zA-Z0-9_$]+)\s*=\s*\(([^)]*)\)\s*=>/g;  // Captures arrow functions
const methodRegex = /([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*{/g;  // Captures class and object methods
const objectMethodRegex = /([a-zA-Z0-9_$]+)\.([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/g;  // Captures Pip.FunctionName(args)
const functionCallRegex = /([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/g;  // Captures standalone function calls

try {
    const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
    const functionRefs = new Set<string>();

    let match: string[] | null;

    while ((match = functionRegex.exec(fileContent)) !== null) {
        functionRefs.add(`${match[1]}(${match[2]})`);
    }

    while ((match = arrowFunctionRegex.exec(fileContent)) !== null) {
        functionRefs.add(`${match[1]}(${match[2]})`);
    }

    while ((match = methodRegex.exec(fileContent)) !== null) {
        functionRefs.add(`${match[1]}(${match[2]})`);
    }

    while ((match = objectMethodRegex.exec(fileContent)) !== null) {
        functionRefs.add(`${match[1]}.${match[2]}(${match[3]})`);
    }

    while ((match = functionCallRegex.exec(fileContent)) !== null) {
        functionRefs.add(`${match[1]}(${match[2]})`);
    }

    const functionList = Array.from(functionRefs).sort();

    fs.writeFileSync(outputFilePath, functionList.join('\n'), 'utf-8');

    // eslint-disable-next-line no-console
    console.log(`Extracted ${functionList.length} function references. Results saved to ${outputFilePath}.`);
} catch (error) {
    console.error('Error processing the file:', error);
}
