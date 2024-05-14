import fs from 'fs';
import fsp from 'fs/promises';

export async function writeFile(path: string, file: File) {
    const fileData = await fileToUInt(file)
    try {
        await fsp.writeFile(`${process.cwd()}${path}`, fileData)
    } catch (err) {
        console.error(err);
    }
}

export function readFileFromDisk(path: string) {
    const fileData = fs.readFileSync(`${process.cwd()}${path}`)
    return fileData;
}

export async function readFile(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer).toString();

}

export async function readJSONFile(file: File) {
    const fileAsString = await readFile(file);
    return JSON.parse(fileAsString);
}

async function fileToUInt(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

export function getTimeStr() {
    return new Date().toISOString().replaceAll(/\D+/g, '');
}