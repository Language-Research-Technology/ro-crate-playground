import {serve} from '@hono/node-server';
import {Hono} from 'hono';
import {ROCrate} from "ro-crate";
import path from "path";
import fs from "fs-extra";
import {v4 as uuidv4} from 'uuid';


const app = new Hono({strict: false,}).basePath('app');

app.get('/', (c) => {
    return c.text('Hello Hono!');
});

app.get('/crate.json', (c) => {
    const roc = new ROCrate({}, {link: true, array: true});
    roc.rootDataset.name = 'Sample Crate';
    const json = roc.toJSON();
    return c.json(json);
});

app.get('/examples', async (c) => {
    const configuration = await fs.readJson('./configuration.json');
    return c.json(configuration?.examples || []);
});

app.get('/example/:name', async (c) => {
    const configuration = await fs.readJson('./configuration.json');
    const example = configuration.examples.find((e) => e.name === c.req.param('name'));
    if (example) {
        const directoryPath = path.join(process.cwd(), example.path);

        // Ensure the directory exists
        if (!fs.existsSync(directoryPath)) {
            return c.text('Directory not found!', 404);
        }

        //TODO: return somehow the whole directory
        // Read the directory contents
        //const files = fs.readdirSync(directoryPath);
        //const folders = files.filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory());
        let crate = {}
        if (fs.pathExistsSync(path.join(example.path, 'ro-crate-metadata.json'))) {
            crate = fs.readJsonSync(path.join(example.path, 'ro-crate-metadata.json'));
        } else if (fs.pathExistsSync(path.join(example.path, 'ro-crate-metadata.jsonld'))) {
            crate = fs.readJsonSync(path.join(example.path, 'ro-crate-metadata.jsonld'));
        }
        return c.json(crate);
    } else {
        return c.json([])
    }
})

app.get('/configuration', (c) => {
    const configuration = fs.readJsonSync('configuration.json');
    return c.json(configuration);
});

app.post('/upload', async (c) => {
    const formData = await c.req.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
        return c.json({error: 'Provided input is not a File instance.'}, 500);
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = path.join('/opt/storage/files', uuidv4() + '.json');
        await fs.writeFile(filePath, buffer);
        const json = await fs.readJson(filePath);
        return c.json({
            message: 'File uploaded and parsed successfully!',
            success: filePath,
            data: json
        }, 200);
    } catch (error) {
        console.error('Error writing file:', error);
        return c.json({error: 'Invalid JSON file'}, 500);
    }

});

const server = serve({
    fetch: app.fetch,
    port: 8080,
    maxRequestBodySize: 200_000_000_000,
}, ({address, port}) => {
    console.log(`ro-crate-playground server listening at http://${address}:${port}`);
});