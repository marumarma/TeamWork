var isGenerated = false;
var startSelecting = false;
var finishSelecting = false;
var wallbuilder = false;
console.log("Круто, все работает, я верно написала src!!!!!");
// tr = table rows
// td = table data
function generate() {
    if (!isGenerated) {
        var size = document.getElementById('size').value;
        var table = document.createElement('table');
        table.className = "table";
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        document.getElementById('body').appendChild(table);

        for (var i = 0; i < size; i ++) {
            var row = document.createElement('tr');
            for (var j = 0; j < size; j ++) {
                var cell = document.createElement('td');
                row.appendChild(cell);
                cell.id = i + " " + j;
                cell.setAttribute("xC", i);
                cell.setAttribute("yC", j);
                cell.className = "walkable"; //проходимость
            }

            table.appendChild(row);
        }
        isGenerated = true;
        let cells = document.querySelectorAll('td');
        cells.forEach(function (element) {
            element.onclick = function() {
                if (startSelecting) {
                    element.className = "startik walkable";
                    startSelecting = false;
                }
                else if (finishSelecting) {
                    element.className = "finishik walkable";
                    var button = document.getElementById("selectfinish");
                    finishSelecting = false;
                }
                else if (wallbuilder && element.classList.contains("walkable")) {
                    element.className = "unwalkable";
                }
                else if (wallbuilder && element.classList.contains("unwalkable")) {
                    element.className = "walkable";
                }
            }
        });

        console.log("Table is generated.")
    }
    else {
        alert('Maze is already generated!');
    }
}

function selectStart() {
    if (isGenerated) {
        startSelecting = true;
        finishSelecting = false;
        wallbuilder = false;
        console.log("StartSelectingMode is on.");
    }
    else {
        alert('Mase is not generater yet!');
    }
}
function selectFinish() {
    if (isGenerated) {
        startSelecting = false;
        finishSelecting = true;
        wallbuilder = false;
        console.log("FinishSelectingMode is on.");
    }
    else {
        alert('Mase is not generater yet!');
    }
}

function wallBuilder() {
    if (isGenerated) {
        startSelecting = false;
        finishSelecting = false;
        wallbuilder = true;
        console.log("WallBuilderMode is on.");
    }
    else {
        alert('Mase is not generated yet!');
    }
}

// источник алгоритма:https://habr.com/ru/post/262345/
function GenerateMaze() {
    var size = document.getElementById('size').value;
    var matrix = new Array(size);
    var visited = new Array(size);
    for (let i = 0; i < size; i ++) {
        matrix[i] = [];
        visited[i] = [];
        for (let j = 0; j < size; j ++) {
            visited[i][j] = false;
            var cur = document.getElementById(i + " " + j);
            if ((i+1) % 2 == 0 && (j+1) % 2 == 0)  {
                cur.className = "walkable";
            }
            else{
                cur.className = "unwalkable";
            }
            matrix[i][j] = cur;
        }
    }

    let x = rand(0, size / 2-1) * 2 + 1 ;
    let y = rand(0, size / 2-1) * 2 + 1;
  
    console.log(x, y);
    console.log(matrix[x][y]);

    function dir(matrix, x, y, size, visited) {
        console.log(1);
        matrix[x][y].className = "walkable";
        visited[x][y] = true;
        var directions = ["north", "south", "east", "west"];
        while (directions.length > 0) {
            var dindex = rand(0, directions.length-1);
            switch (directions[dindex]) {
                case "north" :
                    console.log(2);
                    if ((y - 2 >= 0) && matrix[x][y-2].classList.contains("walkable") && visited[x][y-2] == false) {
                        matrix[x][y-1].className = "walkable";
                        console.log(matrix[x][y-2]);
                        dir(matrix, x, y - 2, size, visited);
                    }
                    directions.splice(dindex, 1);
                break;
                case "south" :
                    console.log(2);
                    if (y + 2 < size && matrix[x][y+2].classList.contains("walkable") && visited[x][y+2] == false) {
                        matrix[x][y+1].className = "walkable";
                        console.log(matrix[x][y+2]);
                        dir(matrix, x, y + 2, size, visited);
                    }
                    directions.splice(dindex, 1);
                break;
                case "east" :
                    console.log(2);
                    if (x - 2 >= 0 && matrix[x-2][y].classList.contains("walkable") && visited[x - 2][y] == false) {
                        matrix[x-1][y].className = "walkable";
                        console.log(matrix[x-2][y]);
                        dir(matrix, x - 2, y, size, visited);
                    }
                    directions.splice(dindex, 1);
                break;
                case "west" :
                    console.log(2);
                    if (x + 2 < size && matrix[x+2][y].classList.contains("walkable") && visited[x + 2][y] == false) {
                        matrix[x+1][y].className = "walkable";
                        console.log(matrix[x+2][y]);
                        dir(matrix, x + 2, y, size, visited);
                    }
                    directions.splice(dindex, 1);
                break;
            }
            
        }
    }

    dir(matrix, x, y, size, visited);
}




var openList = [];
var closedList = [];

function manhattanDistance(a, b){
    let x = Math.abs(a.x - b.x);
    let y = Math.abs(a.y - b.y);
    let summa  = x + y;
    return summa * 10;
}

function getGvalue(current) {
    if ((current.parent.x == current.x + 1 && current.parent.y == current.y)|| (current.parent.x == current.x - 1 && current.parent.y == current.y)|| (current.parent.y == current.y + 1 && current.parent.x == current.x) || (current.parent.y == current.y - 1 && current.parent.x == current.x)) {
        return 10;
    }
    else {
        return 14;
    }
}

function getFvalue(current) {
    return current.g  + current.h;
}

function findPath() {
    var size = document.getElementById('size').value;
    var m = new Array(size);
    let openMas = [];
    let closeMas = [];
    for (let i = 0; i < size; i++) {
        m[i] = [];
        for (let j = 0; j < size; j ++) {
            m[i][j] = new Cell(document.getElementById(i + " " + j), i, j);
            if (m[i][j].element.classList.contains("startik")) {
                var startPoint = m[i][j];
            }
            else if (m[i][j].element.classList.contains("finishik")) {
                var endPoint = m[i][j];
            }
        }
    }

    startPoint.g = 0;
    startPoint.h = manhattanDistance(startPoint, endPoint);
    startPoint.f = startPoint.g + startPoint.h;

    let currentPoint = startPoint;
    closeMas.push(currentPoint);
    openMas.push(currentPoint);

    while (currentPoint.h != 0){
        closeMas.push(currentPoint);
        let currentIndex = openMas.indexOf(currentPoint);
        openMas.splice(currentIndex, 1);
        let x = currentPoint.x;
        let y = currentPoint.y;

        let forX = [0, 0, 1, -1, -1, 1, -1, 1];
        let forY = [-1, 1, 0, 0, -1, -1, 1, 1];

        for (let i = 0; i < 8; i ++){
            if ((x + forX[i] > -1) && (y + forY[i] > -1) && (x + forX[i] < size) && (y + forY[i] < size)){
                let newPoint = m[x + forX[i]][y + forY[i]];
                if (!(closeMas.includes(newPoint)) && (newPoint.element.classList.contains('walkable'))){
                    if (!(openMas.includes(newPoint))){
                        newPoint.parent = currentPoint;

                        newPoint.g = newPoint.parent.g + getGvalue(newPoint);
                        newPoint.h = manhattanDistance(newPoint, endPoint);
                        newPoint.f = getFvalue(newPoint);
                        if (!newPoint.element.classList.contains('finishik')) {
                            newPoint.element.className = "open";
                        }
                        openMas.push(newPoint);
                    }

                    else{
                        let oldParent = newPoint.parent;
                        newPoint.parent = currentPoint;
                        if (!newPoint.element.classList.contains('finishik')) {
                            newPoint.element.parent.className = "open";
                        }
                        let newG = currentPoint.g + getGvalue(newPoint);
                        if (newG < newPoint.g){
                            newPoint.g = newG;
                            newPoint.f = getFvalue(newPoint);
                        }
                        else{
                            newPoint.parent = oldParent;
                        }

                    }
                }
            }
        }

        let points = [];

        if (openMas.length == 0) {
            alert("No path!");
        }
        
        for (let i = 0; i < openMas.length; i ++){
            points[i] = {
                nucleus: openMas[i],
                f: openMas[i].f,
            }
        }

        points.sort(function (a, b) {
            return a.f - b.f;
        })

        currentPoint = points[0].nucleus;
    }
    
    let finalArray = new Array ();

    let cou = 0;

    while (currentPoint.parent.parent != null){
        finalArray.push(currentPoint);
        document.getElementById(currentPoint.parent.x + " " + currentPoint.parent.y).className = "path";
        console.log('x:',currentPoint.parent.x, 'y:', currentPoint.parent.y);
        currentPoint = currentPoint.parent; 
        cou += 1;   
    }

    if (cou == 0) {
        alert("No path!")
    }

    drawOpen();

}    

function drawOpen(size) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cur = document.getElementById(i + " " + j);
            if (cur.classList.contains("open")) {
                cur.className = "op";
            }
            setTimeout(drawOpen, i * 200, cur);
        }
    }
}

function findmaxPath() {
    var size = document.getElementById('size').value;
    var m = new Array(size);
    let openMas = [];
    let closeMas = [];
    for (let i = 0; i < size; i++) {
        m[i] = [];
        for (let j = 0; j < size; j ++) {
            m[i][j] = new Cell(document.getElementById(i + " " + j), i, j);
            if (m[i][j].element.classList.contains("startik")) {
                var startPoint = m[i][j];
            }
            else if (m[i][j].element.classList.contains("finishik")) {
                var endPoint = m[i][j];
            }
        }
    }

    startPoint.g = 0;
    startPoint.h = manhattanDistance(startPoint, endPoint);
    startPoint.f = startPoint.g + startPoint.h;

    let currentPoint = startPoint;
    closeMas.push(currentPoint);
    openMas.push(currentPoint);

    while (currentPoint.h != 0){
        closeMas.push(currentPoint);
        let currentIndex = openMas.indexOf(currentPoint);
        openMas.splice(currentIndex, 1);
        let x = currentPoint.x;
        let y = currentPoint.y;

        let forX = [0, 0, 1, -1, -1, 1, -1, 1];
        let forY = [-1, 1, 0, 0, -1, -1, 1, 1];

        for (let i = 0; i < 8; i ++){
            if ((x + forX[i] > -1) && (y + forY[i] > -1) && (x + forX[i] < size) && (y + forY[i] < size)){
                let newPoint = m[x + forX[i]][y + forY[i]];
                if (!(closeMas.includes(newPoint)) && (newPoint.element.classList.contains('walkable'))){
                    if (!(openMas.includes(newPoint))){
                        newPoint.parent = currentPoint;

                        newPoint.g = newPoint.parent.g + getGvalue(newPoint);
                        newPoint.h = manhattanDistance(newPoint, endPoint);
                        newPoint.f = getFvalue(newPoint);

                        openMas.push(newPoint);
                    }

                    else{
                        let oldParent = newPoint.parent;
                        newPoint.parent = currentPoint;
                        let newG = currentPoint.g + getGvalue(newPoint);
                        if (newG < newPoint.g){
                            newPoint.g = newG;
                            newPoint.f = getFvalue(newPoint);
                        }
                        else{
                            newPoint.parent = oldParent;
                        }

                    }
                }
            }
        }

        let points = [];

        
        for (let i = 0; i < openMas.length; i ++){
            points[i] = {
                nucleus: openMas[i],
                f: openMas[i].f,
            }
        }

        points.sort(function (a, b) {
            return b.f - a.f;
        })

        currentPoint = points[0].nucleus;
    }
    
    let finalArray = new Array ();

    while (currentPoint.parent.parent != null){
        finalArray.push(currentPoint);
        document.getElementById(currentPoint.parent.x + " " + currentPoint.parent.y).className = "path";
        console.log('x:',currentPoint.parent.x, 'y:', currentPoint.parent.y);
        currentPoint = currentPoint.parent;    
    }

}    

class Cell {
    constructor(element, x, y, f, g, h) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.parent = null;
        this.f = f;
        this.g = g;
        this.h = h;
        this.visited = false;
    }
}

class Point {
    constructor(element, x, y) {
        this.element = element;
        this.x = x;
        this.y = y;
    }
}


function rand(min, max) {
    let x = min + Math.random() * (max + 1 - min);
    return Math.floor(x);
}

document.getElementById("generate").addEventListener('click', generate);
document.getElementById("selectstart").addEventListener('click', selectStart);
document.getElementById("selectfinish").addEventListener('click', selectFinish);
document.getElementById("walls").addEventListener('click', wallBuilder);
document.getElementById("generatemaze").addEventListener('click', GenerateMaze);
document.getElementById("findpath").addEventListener('click', findPath);
document.getElementById("findmaxpath").addEventListener('click', findmaxPath);
