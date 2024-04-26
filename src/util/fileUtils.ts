import fs from 'fs';
import fsp from 'fs/promises';

export async function writeFile(path: string, file: File) {
    const filedata = await fileToUInt(file)
    try {
        await fsp.writeFile(`${process.cwd()}${path}`, filedata)
    } catch (err) {
        console.error(err);
    }
}

export function readFile(path: string) {
    const file_data = fs.readFileSync(`${process.cwd()}${path}`)
    return file_data;
}

async function fileToUInt(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

export function getTimeStr() {
    return new Date().toISOString().replaceAll(/\D+/g, '');
}