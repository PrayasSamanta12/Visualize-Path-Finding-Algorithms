// ==========================================================
// =================== Rendering Grid =======================
// ==========================================================

const board = document.querySelector('#board');
let matrix;
let row;
let col;
let width = 22;
var cells = [];

//==========Updation of nodes according to pixel=============
const pixels = document.querySelectorAll('#pixel .drop-menu a'); //Acquiring each pixel elements(14px,16px,..) from anchor links
pixels.forEach((pixel) => {
    pixel.addEventListener('click', () => {
        width = parseInt(pixel.innerText); //as innertext takes string so we have to convert it into integer
        const cells = document.querySelectorAll('.col');//Selecting all the nodes(□) using col
        cells.forEach(cell => {
            document.documentElement.style.setProperty('--cell-width', `${width}px`);//setting the updated pixel for all those cells
        })

        renderBoard();//Updating the pixel values and re redenred the whole board again
        source = set('source');//Set new source pointer(random)
        target = set('target');//Set new target pointer(random)
    });
});


//==========Creation of nodes according to size of screen=============
function renderBoard() {
    matrix = [];
    col = parseInt(board.clientWidth / width); //Total number of col and row is calculated according to user screen width and height
    row = parseInt(board.clientHeight / width);
    // If the screen width is less than or equal to 662 pixels, the number of rows is reduced by one for better display on small screens.
    if(window.innerWidth <= 662){
        row -= 1;
    }

    board.innerHTML = '';
    //Creation of nodes  □□□□
    //                   □□□□
    for (let i = 0; i < row; i++) {
        const rowElement = document.createElement('div');//each row is considered as div element
        rowElement.setAttribute('id', `row-${i}`);//div element consist of id "row-1"/"row-2"/etc
        rowElement.classList.add('row');//class row also added to div
        let colList = [];//It is taken to track the columns in order to make 2d array matrix
        for (let j = 0; j < col; j++) {
            const colElement = document.createElement('div');//each col is also div (it denotes each node)
            colElement.classList.add('col', 'unvisited');
            colElement.setAttribute('id', `${i}-${j}`);//id as 0-1,0-2,0-3 etc(denotes each node index as matrix representation)
            rowElement.appendChild(colElement);//appending column in row div

            colList.push(colElement);//Making a track of all columns by pushing it into collist
        }
        board.appendChild(rowElement);//All nodes are added into the board 
        matrix.push(colList);//Making a 2d matrix of nodes(columns) so that we can track everthing clearly
    }
    cells = document.querySelectorAll('.col');//all columns are selected using and all are assigned into cells array
    boardInteraction(cells);
}





// ==========================================================
// ================= BOARD INTERATION  ======================
// ==========================================================

function boardInteraction(cells) {
    let draging = false;//It denotes dragging of source and taeget
    let drawing = false;//It denotes drawing of walls
    let dragStart = null;//It traks if the dragging element is source or target
    cells.forEach((cell) => {
        //pointDown event will trigger when a pointer is pressed down
        const pointDown = (e) => {
            if (e.target.classList.contains('source')) {//if the touched column consist class source then track that(see utils.js for better understanding)
                dragStart = 'source';//Setting the dragstart as source
                draging = true;//Dragging of source will be done so dragging is given as true
            }
            //Same above procedure is done for target class 
            else if (e.target.classList.contains('target')) {
                dragStart = 'target';
                draging = true;
            }
            else {
                drawing = true;
            }
        }
        //pointUp event will trigger when pointer press is relesed
        const pointUp = () => {
            drawing = false;//Drawing is stopped
            draging = false;//Draging is stopped
            dragStart = null;//Also dragStart is cleared
            matrix[source.x][source.y].classList.remove('wall');
            matrix[target.x][target.y].classList.remove('wall');
        }
        //This event will trigger when pointer moves over the nodes
        const pointMove = (e) => {
            const triggerElement = document.elementFromPoint(e.clientX, e.clientY);
            if (triggerElement == null || !triggerElement.classList.contains('col')) return;//It is used to check that pointer will point only on nodes
            //console.log(triggerElement)
            cordinate = { ...triggerElement.id.split('-') };//id = 20-31 -> split into array of 20 and 31

            if (draging && dragStart) {
                //if this for each not provided then there will be multiple source and target pointer
                cells.forEach(cell => {
                    cell.classList.remove(dragStart);
                })
                triggerElement.classList.add(dragStart);//add pointer only on lastly touvhed node

                if (dragStart === 'source') {
                    source.x = Number(cordinate[0]);//collecting coordinates(x) from array as it is splitted
                    source.y = Number(cordinate[1]);//collecting coordinates(y) from array as it is splitted
                }
                //same procedure for target
                else {
                    target.x = Number(cordinate[0]);
                    target.y = Number(cordinate[1]);
                }
            }


            else if (drawing) {
                //drawing is not for source and target
                if (triggerElement.classList.contains('source') || triggerElement.classList.contains('target'))
                    return;

                const x = Number(cordinate[0]);
                const y = Number(cordinate[1]);
                //wall is updated
                matrix[x][y].setAttribute('class', 'col wall');
            }
        }

        cell.addEventListener('pointerdown', pointDown);
        cell.addEventListener('pointermove', pointMove);
        cell.addEventListener('pointerup', pointUp);

        cell.addEventListener('click', () => {
            if (cell.classList.contains('source') || cell.classList.contains('target'))
                return;

            cell.classList.remove('visited', 'path');
            cell.classList.toggle('wall');//One click wall will appear another click wall will disappear
        })
    })

}
