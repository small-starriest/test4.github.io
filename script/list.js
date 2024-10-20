//第一个表格
let jsonDataOverall = null;
let sortOrderOverall = {};

// 加载整体数据
function loadOverallData() {
    fetch('/data/overall') // 假设这是第一个表格的数据源
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(models => {
            console.log('Loaded Overall models:', models); // 调试：查看加载的数据
            const tableBody = document.getElementById('table-body-Overall');
            tableBody.innerHTML = '';
            models.forEach(model => insertRowOverall(model));

            // 默认排序
            if (Object.keys(sortOrderOverall).length === 0) {
                sortOrderOverall['rank'] = 'asc'; // 默认排序字段
                sortTableOverall('rank'); // 调用排序函数
            }
        })
        .catch(error => console.error('Error loading data:', error));
}

// 文件上传处理
document.getElementById('file-input-Overall').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("请选择一个 .json 文件");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            jsonDataOverall = JSON.parse(e.target.result);
            document.getElementById('submit-button-Overall').disabled = false;
        } catch (error) {
            alert("文件格式错误，请确认为有效的 JSON 文件");
        }
    };
    reader.readAsText(file);
});

// 提交按钮处理
document.getElementById('submit-button-Overall').addEventListener('click', function() {
    if (jsonDataOverall) {
        // 判断是否是数组
        if (Array.isArray(jsonDataOverall)) {
            jsonDataOverall.forEach(data => {
                insertRowOverall(data);
                saveToServerOverall(data); // 提交每个数据到服务器
            });
        } else {
            insertRowOverall(jsonDataOverall);
            saveToServerOverall(jsonDataOverall);
        }
        jsonDataOverall = null;
        document.getElementById('file-input-Overall').value = "";
        this.disabled = true;
    } else {
        alert("没有有效的数据可提交。");
    }
});

// 插入行到表格
function insertRowOverall(data) {
    const tableBody = document.getElementById('table-body-Overall');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${data.rank}</td>
        <td>${data.model}</td>
        <td>${data.model_size}</td>
        <td>${data.memory_usage}</td>
        <td>${data.embedding_dimensions}</td>
        <td>${data.max_tokens}</td>
        <td>${data.average}</td>
        <td>${data.classification_average}</td>
        <td>${data.clustering_average}</td>
        <td>${data.pairclassification_average}</td>
        <td>${data.reranking_average}</td>
    `;
    tableBody.appendChild(newRow);
}

// 保存数据到服务器
function saveToServerOverall(data) {
    fetch('/save/data/overall', { // 修改为正确的保存路径
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // 将 data 转换为 JSON 字符串
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // 或使用 response.json()，根据后端返回的数据类型
    })
    .then(result => {
        console.log("Overall data saved:", result);
        loadOverallData();  // 在保存数据后更新表格
    })
    .catch(error => console.error('Error saving data:', error));
}

// 排序功能
function sortTableOverall(column) {
    const tableBody = document.getElementById('table-body-Overall');
    const rows = Array.from(tableBody.rows);
    
    
    // 切换排序顺序
    const currentOrder = sortOrderOverall[column] === 'asc' ? 'desc' : 'asc';
    sortOrderOverall[column] = currentOrder;

    // 根据选择的列排序
    const sortedRows = rows.sort((a, b) => {
        const aValue = a.cells[columnIndexOverall(column)].innerText;
        const bValue = b.cells[columnIndexOverall(column)].innerText;

        // 比较数值和字符串
        if (!isNaN(aValue) && !isNaN(bValue)) {
            return currentOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
            return currentOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
    });

    // 更新表格
    tableBody.innerHTML = '';
    sortedRows.forEach(row => tableBody.appendChild(row));

    // 更新排序指示符
    updateToggleButtonsOverall(column);
}

// 更新排序指示符
function updateToggleButtonsOverall(column) {
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => {
        button.textContent = '▲'; // 默认方向
        button.parentElement.classList.remove('active');
    });
    const currentButton = document.getElementById(`${column}-toggle-Overall`);
    currentButton.textContent = sortOrderOverall[column] == 'asc' ? '▼' : '▲';
    currentButton.parentElement.classList.add('active');
}

// 获取列索引
function columnIndexOverall(column) {
    const columns = ['rank', 'model', 'model_size', 'memory_usage', 'embedding_dimensions', 'max_tokens', 'average', 'classification_average', 'clustering_average', 'pairclassification_average', 'reranking_average'];
    return columns.indexOf(column);
}

// 在 DOMContentLoaded 时加载数据
document.addEventListener('DOMContentLoaded', loadOverallData);




// 第二个表格的独立逻辑
jsonDataSTS = null;
sortOrderSTS = {};

// 加载整体数据
function loadSTSData() {
    fetch('/data/sts') // 假设这是第一个表格的数据源
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(models => {
            console.log('Loaded STS models:', models); // 调试：查看加载的数据
            const tableBody = document.getElementById('table-body-STS');
            tableBody.innerHTML = '';
            models.forEach(model => insertRowSTS(model));

            // 默认排序
            if (Object.keys(sortOrderSTS).length === 0) {
                sortOrderSTS['rank'] = 'asc'; // 默认排序字段
                sortTableSTS('rank'); // 调用排序函数
            }
        })
        .catch(error => console.error('Error loading data:', error));
}

// 文件上传处理
document.getElementById('file-input-STS').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("请选择一个 .json 文件");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            jsonDataSTS = JSON.parse(e.target.result);
            document.getElementById('submit-button-STS').disabled = false;
        } catch (error) {
            alert("文件格式错误，请确认为有效的 JSON 文件");
        }
    };
    reader.readAsText(file);
});

// 提交按钮处理
document.getElementById('submit-button-STS').addEventListener('click', function() {
    if (jsonDataSTS) {
        // 判断是否是数组
        if (Array.isArray(jsonDataSTS)) {
            jsonDataSTS.forEach(data => {
                insertRowSTS(data);
                saveToServerSTS(data); // 提交每个数据到服务器
            });
        } else {
            insertRowSTS(jsonDataSTS);
            saveToServerSTS(jsonDataSTS);
        }
        jsonDataSTS = null;
        document.getElementById('file-input-STS').value = "";
        this.disabled = true;
    } else {
        alert("没有有效的数据可提交。");
    }
});

// 插入行到表格
function insertRowSTS(data) {
    const tableBody = document.getElementById('table-body-STS');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${data.rank}</td>
        <td>${data.model}</td>
        <td>${data.model_size}</td>
        <td>${data.memory_usage}</td>
        <td>${data.embedding_dimensions}</td>
        <td>${data.max_tokens}</td>
        <td>${data.average}</td>
        <td>${data.classification_average}</td>
        <td>${data.clustering_average}</td>
        <td>${data.pairclassification_average}</td>
        <td>${data.reranking_average}</td>
    `;
    tableBody.appendChild(newRow);
}

// 保存数据到服务器
function saveToServerSTS(data) {
    fetch('/save/data/sts', { // 修改为正确的保存路径
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // 将 data 转换为 JSON 字符串
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // 或使用 response.json()，根据后端返回的数据类型
    })
    .then(result => {
        console.log("STS data saved:", result);
        loadSTSData();  // 在保存数据后更新表格
    })
    .catch(error => console.error('Error saving data:', error));
}

// 排序功能
function sortTableSTS(column) {
    const tableBody = document.getElementById('table-body-STS');
    const rows = Array.from(tableBody.rows);
    
    
    // 切换排序顺序
    const currentOrder = sortOrderSTS[column] === 'asc' ? 'desc' : 'asc';
    sortOrderSTS[column] = currentOrder;

    // 根据选择的列排序
    const sortedRows = rows.sort((a, b) => {
        const aValue = a.cells[columnIndexSTS(column)].innerText;
        const bValue = b.cells[columnIndexSTS(column)].innerText;

        // 比较数值和字符串
        if (!isNaN(aValue) && !isNaN(bValue)) {
            return currentOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
            return currentOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
    });

    // 更新表格
    tableBody.innerHTML = '';
    sortedRows.forEach(row => tableBody.appendChild(row));

    // 更新排序指示符
    updateToggleButtonsSTS(column);
}

// 更新排序指示符
function updateToggleButtonsSTS(column) {
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => {
        button.textContent = '▲'; // 默认方向
        button.parentElement.classList.remove('active');
    });
    const currentButton = document.getElementById(`${column}-toggle-STS`);
    currentButton.textContent = sortOrderSTS[column] === 'asc' ? '▼' : '▲';
    currentButton.parentElement.classList.add('active');
}

// 获取列索引
function columnIndexSTS(column) {
    const columns = ['rank', 'model', 'model_size', 'memory_usage', 'embedding_dimensions', 'max_tokens', 'average', 'classification_average', 'clustering_average', 'pairclassification_average', 'reranking_average'];
    return columns.indexOf(column);
}

// 在 DOMContentLoaded 时加载数据
document.addEventListener('DOMContentLoaded', loadSTSData);


// 第三个表格的独立逻辑
jsonDataReranking = null;
sortOrderReranking = {};

// 加载整体数据
function loadRerankingData() {
    fetch('/data/reranking') // 假设这是第一个表格的数据源
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(models => {
            console.log('Loaded Reranking models:', models); // 调试：查看加载的数据
            const tableBody = document.getElementById('table-body-Reranking');
            tableBody.innerHTML = '';
            models.forEach(model => insertRowReranking(model));

            // 默认排序
            if (Object.keys(sortOrderReranking).length === 0) {
                sortOrderReranking['rank'] = 'asc'; // 默认排序字段
                sortTableReranking('rank'); // 调用排序函数
            }
        })
        .catch(error => console.error('Error loading data:', error));
}

// 文件上传处理
document.getElementById('file-input-Reranking').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("请选择一个 .json 文件");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            jsonDataReranking = JSON.parse(e.target.result);
            document.getElementById('submit-button-Reranking').disabled = false;
        } catch (error) {
            alert("文件格式错误，请确认为有效的 JSON 文件");
        }
    };
    reader.readAsText(file);
});

// 提交按钮处理
document.getElementById('submit-button-Reranking').addEventListener('click', function() {
    if (jsonDataReranking) {
        // 判断是否是数组
        if (Array.isArray(jsonDataReranking)) {
            jsonDataReranking.forEach(data => {
                insertRowReranking(data);
                saveToServerReranking(data); // 提交每个数据到服务器
            });
        } else {
            insertRowReranking(jsonDataReranking);
            saveToServerReranking(jsonDataReranking);
        }
        jsonDataReranking = null;
        document.getElementById('file-input-Reranking').value = "";
        this.disabled = true;
    } else {
        alert("没有有效的数据可提交。");
    }
});

// 插入行到表格
function insertRowReranking(data) {
    const tableBody = document.getElementById('table-body-Reranking');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${data.rank}</td>
        <td>${data.model}</td>
        <td>${data.model_size}</td>
        <td>${data.memory_usage}</td>
        <td>${data.embedding_dimensions}</td>
        <td>${data.max_tokens}</td>
        <td>${data.average}</td>
        <td>${data.classification_average}</td>
        <td>${data.clustering_average}</td>
        <td>${data.pairclassification_average}</td>
        <td>${data.reranking_average}</td>
    `;
    tableBody.appendChild(newRow);
}

// 保存数据到服务器
function saveToServerReranking(data) {
    fetch('/save/data/reranking', { // 修改为正确的保存路径
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // 将 data 转换为 JSON 字符串
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // 或使用 response.json()，根据后端返回的数据类型
    })
    .then(result => {
        console.log("Reranking data saved:", result);
        loadRerankingData();  // 在保存数据后更新表格
    })
    .catch(error => console.error('Error saving data:', error));
}

// 排序功能
function sortTableReranking(column) {
    const tableBody = document.getElementById('table-body-Reranking');
    const rows = Array.from(tableBody.rows);
    
    // 切换排序顺序
    const currentOrder = sortOrderReranking[column] === 'asc' ? 'desc' : 'asc';
    sortOrderReranking[column] = currentOrder;

    // 根据选择的列排序
    const sortedRows = rows.sort((a, b) => {
        const aValue = a.cells[columnIndexReranking(column)].innerText;
        const bValue = b.cells[columnIndexReranking(column)].innerText;

        // 比较数值和字符串
        if (!isNaN(aValue) && !isNaN(bValue)) {
            return currentOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
            return currentOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
    });

    // 更新表格
    tableBody.innerHTML = '';
    sortedRows.forEach(row => tableBody.appendChild(row));

    // 更新排序指示符
    updateToggleButtonsReranking(column);
}

// 更新排序指示符
function updateToggleButtonsReranking(column) {
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach(button => {
        button.textContent = '▲'; // 默认方向
        button.parentElement.classList.remove('active');
    });
    const currentButton = document.getElementById(`${column}-toggle-Reranking`);
    currentButton.textContent = sortOrderReranking[column] === 'asc' ? '▼' : '▲';
    currentButton.parentElement.classList.add('active');
}

// 获取列索引
function columnIndexReranking(column) {
    const columns = ['rank', 'model', 'model_size', 'memory_usage', 'embedding_dimensions', 'max_tokens', 'average', 'classification_average', 'clustering_average', 'pairclassification_average', 'reranking_average'];
    return columns.indexOf(column);
}

// 在 DOMContentLoaded 时加载数据
document.addEventListener('DOMContentLoaded', loadRerankingData);