import { store } from '@/store';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { join } from 'path-browserify';
import axios from 'axios';
import hljs from 'highlight.js';
import dompurify from 'dompurify';

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = lang && hljs.getLanguage(lang) ? lang : null;
            if (language) {
                return hljs.highlight(code, { language }).value;
            } else {
                const auto = hljs.highlightAuto(code);
                console.log('highlightAuto', auto);
                return auto.value;
            }
        },
    })
);

const READMEs = ['readme.md', 'Readme.md', 'README.md', 'ReadMe.md'];
const PACKAGE_JSON = 'package.json';

// const staticUrl = "127.0.0.1:5501/api";
const staticQuest = axios.create({
    // baseURL: "http://" + staticUrl,
    withCredentials: true,
});

export async function readInfo(...uri: string[]) {
    uri[0].includes(':') && (uri = ['.']);
    uri = uri.map((e) => e.replace('\\', '/'));
    const rel = (...dir: string[]): string => join('/api', ...uri, ...dir);

    console.log('Trying to GET', rel(PACKAGE_JSON));
    let res = await staticQuest.get(rel(PACKAGE_JSON));
    console.log(res);
    const pkgJson = res.data;

    store.data = pkgJson;

    for (const n of READMEs) {
        try {
            console.log('Trying to GET', rel(n));
            res = await staticQuest.get(rel(n));
            const text = res.data;
            store.readme = dompurify.sanitize((await marked.parse(text))!);
            break;
        } catch {
            continue;
        }
    }
}

// 传入点击得到的节点信息，传入所有依赖的数据
export function readme(uri: any, nodes: any) {
    console.log('111');
    console.log(uri, nodes);

    // 得到数据
    const { data } = uri;

    // 被谁依赖
    let parent: any[] = [];
    data.requiredBy.forEach((item) => {
        // 查询得到被依赖的名称，加入parent数组
        parent.push(nodes[item].id);
    });
    // 依赖谁?---这里用上element的虚拟树形控件
    let children: any[] = [];
    for (let i = 0; i < data.requiring.length; i++) {
        const meta = data.meta[i];
        const key = data.requiring[i];
        let obj = {
            name: nodes[key].id,
            range: meta.range,
            type: meta.type,
            optional: meta.optional,
        };
        children.push(obj);
    }

    let b = data.dir + '/' + data.id + '/readme.md';
    let a = data.dir + '/' + data.id + '/package.json';

    fetch(b)
        .then((res) => res.text())
        .then(async (data) => {
            let temp = dompurify.sanitize((await marked.parse(data))!);
            store.readme = temp;
        })
        .catch((err) => err);

    fetch(a)
        .then((res) => res.json())
        .then((data) => {
            store.data = {
                name: data.name,
                description: data.description,
                parent: parent,
                children: children,
            };
        })
        .catch((err) => err);
}
// 收起节点，清空信息
export function clear() {
    store.data = {};
    store.readme = '';
}
