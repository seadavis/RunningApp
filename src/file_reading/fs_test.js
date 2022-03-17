import {fs} from 'fs';

function openFile(){
    const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
    return data;
}