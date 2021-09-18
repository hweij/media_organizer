import * as fs from 'fs';
import * as path from 'path';

const cwd = process.cwd();

type FileType = 'jpg' | 'png' | 'gif' | 'other';
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
async function readFromDirectory(imagePath: string) {
    const res: FileInfo[] = [];
    const files = await fs.promises.readdir(imagePath);
    for (const file of files) {
        const fullPath = path.join(imagePath,file);
        const stat = await fs.promises.stat(fullPath);
        const isDir = stat.isDirectory();
        const imgType = (getFileType(file) || 'other');
        console.log(`file: ${fullPath} - ${isDir ? 'DIR' : stat.size + ' ' + imgType}`);
        if (!isDir) {
            res.push({ name: file, size: stat.size, type: imgType, group: '' });
        }
    };
    return res;
}

async function readFromMediaFile(imagePath: string) {
    const txt = await fs.promises.readFile(path.join(imagePath, 'media.json'), { encoding: 'utf8' });
    const jso = JSON.parse(txt);
    const res: FileInfo[] = [];
    for (let f of jso.files) {
        res.push({ name: f.name, type: f.type, size: f.size, group: f.group });
    }
    return res;
}

function getMediaInfo(mediaData: FileInfo[], fname: string) {
    const entry = mediaData.find(md => md.name === fname);
    return entry;
}

async function test() {
    const imagePath = process.argv[2] || cwd;

    console.log('Listing for path ' + imagePath);
    
    const actualData = await readFromDirectory(imagePath);
    const mediaData = await readFromMediaFile(imagePath);

    console.log("DATA FROM DIR");
    console.log(JSON.stringify(actualData, null, 2));
    console.log("DATA FROM MEDIA FILE");
    console.log(JSON.stringify(mediaData, null, 2));

    // TEST: get data from file
    const info = getMediaInfo(mediaData, '55085f7ef3223c2ab8d2aed73abf764b.jpeg');
    console.log('INFO');
    console.log(info);
}

test();
