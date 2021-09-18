import * as fs from 'fs';
import * as path from 'path';

const cwd = process.cwd();

type FileType = 'jpg' | 'png' | 'gif';
type FileInfo = { name: string, type: FileType, size: number, group: string };

const typeMap: { [id: string]: FileType } = {
    'jpg': 'jpg',
    'jpeg': 'jpg',
    'png': 'png',
    'gif': 'gif'
}

function getFileType(fname: string) {
    const index = fname.lastIndexOf('.');
    if (index > 0) {
        return typeMap[fname.substring(index + 1).toLowerCase()];
    }
}

// list all files in the directory
async function listFiles(imagePath: string) {
    const files = await fs.promises.readdir(imagePath);
    for (const file of files) {
        const fullPath = path.join(imagePath,file);
        const stat = await fs.promises.stat(fullPath);
        console.log(`file: ${fullPath} - ${stat.isDirectory() ? 'DIR' : stat.size + ' ' + (getFileType(file) || '')}`);
    };
}

const imagePath = process.argv[2] || cwd;

console.log('Listing for path ' + imagePath);

listFiles(imagePath);
