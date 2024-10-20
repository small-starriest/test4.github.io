const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..'))); // 使静态文件服务于上级目录

// 初始化数据存储
let overallModels = [];
let stsModels = [];
let rerankingModels = [];

// 从文件加载初始数据
const loadInitialData = () => {
    const overallPath = path.join(__dirname, '/data/overall.json');
    const stsPath = path.join(__dirname, '/data/sts.json');
    const rerankingPath = path.join(__dirname, '/data/reranking.json');

    // 加载 overall 数据
    if (fs.existsSync(overallPath)) {
        try {
            const rawData = fs.readFileSync(overallPath, 'utf8');
            overallModels = JSON.parse(rawData);
            console.log('Loaded initial overall data:', overallModels);
        } catch (err) {
            console.error('Error parsing overall.json:', err);
        }
    } else {
        console.log('overall.json does not exist. Starting with an empty array.');
    }

    // 加载 STS 数据
    if (fs.existsSync(stsPath)) {
        try {
            const rawData = fs.readFileSync(stsPath, 'utf8');
            stsModels = JSON.parse(rawData);
            console.log('Loaded initial STS data:', stsModels);
        } catch (err) {
            console.error('Error parsing sts.json:', err);
        }
    } else {
        console.log('sts.json does not exist. Starting with an empty array.');
    }

    // 加载 Reranking 数据
    if (fs.existsSync(rerankingPath)) {
        try {
            const rawData = fs.readFileSync(rerankingPath, 'utf8');
            rerankingModels = JSON.parse(rawData);
            console.log('Loaded initial reranking data:', rerankingModels);
        } catch (err) {
            console.error('Error parsing reranking.json:', err);
        }
    } else {
        console.log('reranking.json does not exist. Starting with an empty array.');
    }
};

// API：GET /data/overall
app.get('/data/overall', (req, res) => {
    res.json(overallModels);
});

// API：GET /data/sts
app.get('/data/sts', (req, res) => {
    res.json(stsModels);
});

// API：GET /data/reranking
app.get('/data/reranking', (req, res) => {
    res.json(rerankingModels);
});

// API：POST /save/overall
app.post('/save/data/overall', (req, res) => {
    const newModel = req.body;

    // 检查新模型是否有效
    if (!newModel || !newModel.rank) {
        return res.status(400).send('Invalid data');
    }

    overallModels.push(newModel);
    console.log('Current overall models after adding:', overallModels);

    // 将数据保存到文件
    fs.writeFile(path.join(__dirname, 'data/overall.json'), JSON.stringify(overallModels, null, 2), (err) => {
        if (err) {
            console.error('Error saving overall data:', err);
            return res.status(500).send('Error saving data');
        }
        res.send('Overall data saved successfully!');
    });
});

// API：POST /save/sts
app.post('/save/data/sts', (req, res) => {
    const newModel = req.body;

    // 检查新模型是否有效
    if (!newModel || !newModel.rank) {
        return res.status(400).send('Invalid data');
    }

    stsModels.push(newModel);
    console.log('Current STS models after adding:', stsModels);

    // 将数据保存到文件
    fs.writeFile(path.join(__dirname, 'data/sts.json'), JSON.stringify(stsModels, null, 2), (err) => {
        if (err) {
            console.error('Error saving STS data:', err);
            return res.status(500).send('Error saving data');
        }
        res.send('STS data saved successfully!');
    });
});

// API：POST /save/reranking
app.post('/save/data/reranking', (req, res) => {
    const newModel = req.body;

    // 检查新模型是否有效
    if (!newModel || !newModel.rank) {
        return res.status(400).send('Invalid data');
    }

    rerankingModels.push(newModel);
    console.log('Current reranking models after adding:', rerankingModels);

    // 将数据保存到文件
    fs.writeFile(path.join(__dirname, 'data/reranking.json'), JSON.stringify(rerankingModels, null, 2), (err) => {
        if (err) {
            console.error('Error saving reranking data:', err);
            return res.status(500).send('Error saving data');
        }
        res.send('Reranking data saved successfully!');
    });
});

// 加载初始数据
loadInitialData();

// 服务器监听
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});