const symbolSpan = document.getElementById('symbol-checking')
const symbolOrderSpan = document.getElementById('symbol-checking-number')

class turingMachine {
  constructor(transitions) {
    this.tape = [];
    this.currentState = 'q0';
    this.transitions= transitions
    this.headPosition = 1
    this.movementcount = 0
  }
}
const transitions = {
  q0: {
      'a': [
          { key: 'T1', nextState: 'q0', move: "Right", changedSymbol: 'a' },
      ],
      'b': [
          { key: 'T1', nextState: 'q0', move: "Right", changedSymbol: 'a' },
      ],
      ' ': [
          { key: 'T2', nextState: 'q1', move: "Left", changedSymbol: ' ' },
      ]
  },
  q1: {
      'a': [
          { key: 'T3', nextState: 'q1', move: "Left", changedSymbol: 'a' },
      ],
      ' ': [
          { key: 'T4', nextState: 'q2', move: "Right", changedSymbol: ' ' },
      ]
  },
  q2: {}
};

const TM = new turingMachine(transitions);
const boxContainer = document.querySelector('.item-container');
var items = [" "," "," ", " ", " ", " ", " ", " ", " ", " "];

function convertStringIntoArray(stringInput){
  TM.tape = stringInput.split('')
  
}


async function wordChecking(symbol){
  console.log(symbol)
  if(!TM.transitions[TM.currentState][symbol]){
      return false
  }
  const validtransition = (TM.transitions[TM.currentState][symbol][0])
  if(!validtransition){
      return false
  }
  var keyNodeTransition = highlightLinkBetweenNodes(TM.currentState, validtransition.nextState)
  await applyTransition(validtransition, keyNodeTransition)
  await sleep(get_speed())
  TM.currentState=validtransition.nextState
  showCurrentNodeGraph(TM.currentState)
}

async function applyTransition(transition, keyNodeTransition){
  TM.currentState=transition.nextState
  await sleep(get_speed())
  showCurrentNodeGraph(keyNodeTransition)
  await sleep(get_speed())
  TM.tape[TM.headPosition]=transition.changedSymbol
  updateTape()
  await sleep(get_speed())
  TM.headPosition = (transition.move == "Right")? TM.headPosition+1:TM.headPosition-1
  if(transition.move == "Right"){
    moveToRight()
    await sleep(get_speed())
  }
  if(transition.move == "Left"){
    moveToLeft()
    await sleep(get_speed())
  }
  TM.movementcount=TM.movementcount+1
}


async function accept(){
  await sleep(get_speed());
  for (let i = 0; i < TM.tape.length*2-2; i++) {
      await wordChecking(TM.tape[TM.headPosition])
  }
  return TM.currentState === 'q2' && TM.headPosition === 1 && TM.movementcount == TM.tape.length*2-2
}

function reset(){
  TM.movementcount = 0
  TM.currentState = 'q0'
  showCurrentNodeGraph(TM.currentState)
  TM.tape = []
  TM.headPosition = 1
}
//************************************************************************************************************************************************* */
let currentPosition = -60;

function moveToRight(){
    currentPosition -= 60;
    console.log(currentPosition) // Ancho del cuadrito más el margen
    boxContainer.style.transform = `translateX(${currentPosition}px)`;
}

function moveToLeft(){
    currentPosition += 60;
    console.log(currentPosition)
    boxContainer.style.transform = `translateX(${currentPosition}px)`;
}

function updateTape(){
  items = [" "," "," ", " ", " ", " ", " ", " ", " ", " "]
  items.splice(3,0, ...TM.tape)
  boxContainer.innerHTML = ""
  items.forEach(item => {
    console.log(items)
    const box = document.createElement('div');
        box.className = 'tape-item';
        box.innerText = item;
        boxContainer.appendChild(box);
    });
}
items.forEach(item => {
  const box = document.createElement('div');
  box.className = 'tape-item';
  box.innerText = item;
  boxContainer.appendChild(box);
});
//*************************************************************************************************************************************************************************** */

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//**************************************************************************************************************************************************************** */
function createHistoryTileItem(userWord){
    const newParagraph = document.createElement('p');
    newParagraph.classList.add('historial-tile'); 
    newParagraph.textContent = userWord;
    return newParagraph;
}

function createHistoryTileSpan(isValidate){
    const newSpan = document.createElement('span');
    if(isValidate){
        newSpan.classList.add('w-validated');
        newSpan.textContent = 'V'
    }else{
        newSpan.classList.add('w-rejected');
        newSpan.textContent = 'R'
    };
    return newSpan;
}

function insertSpanInParagraph(paragraph, span){
    paragraph.appendChild(span);
}

function insertParagraphIntoDOM(paragraph){
    const container = document.getElementById('historial-list');
    container.appendChild(paragraph);
}

class HistorialItem {
  constructor(userWord, isValidated) {
    this.userWord = userWord;
    this.isValidated = isValidated;
  }
}



function createHistoryTile(userWord, isValidate){
    var historyTile = createHistoryTileItem(userWord);
    var historyTileSpan = createHistoryTileSpan(isValidate);
    insertSpanInParagraph(historyTile,historyTileSpan);
    insertParagraphIntoDOM(historyTile)
    
    saveToDatabase(userWord, isValidate);
}

function researchHistoryTile(userWord, isValidate){
  var historyTile = createHistoryTileItem(userWord);
  var historyTileSpan = createHistoryTileSpan(isValidate);
  insertSpanInParagraph(historyTile,historyTileSpan);
  insertParagraphIntoDOM(historyTile)
  
}
const url = 'https://prueba-pythonapi-docker.azurewebsites.net'

function saveToDatabase(userWord, isValidate) {
  const data = {
    userWord: userWord,
    isValidate: isValidate
};

  fetch(`${url}/guardar_historial`, {
      method: 'POST',
      body: JSON.stringify(data),  // Convertir el objeto a JSON
      headers: {
        'Content-Type': 'application/json'  // Especificar que los datos son JSON
      }
  });
}


 const historiial = {
                    userWord: "ABA",
                    isValidate: false
                };

async function retrieveHistoryData() {
  const response = await fetch(`${url}/obtener_historial`);
  const historial = await response.json();
  console.log(historial)
  return historial ;
}


function displayHistoryData(historyData) {
  console.log(historyData);
  for (const item of historyData) {
    const userWord = item.userWord;
    const isValidate = item.isValidate;
    console.log(userWord, isValidate);
    researchHistoryTile(userWord, isValidate); // `isValidate` ya es un valor booleano, no es necesario parsearlo.
  }
}


 async function initializePage() {
  const historyData =  await retrieveHistoryData();
  console.log(historyData) // Await the data
  displayHistoryData(historyData);
}

window.addEventListener('load', initializePage);

const $ = go.GraphObject.make;

const myDiagram = $(go.Diagram, "myDiagram", {
    initialContentAlignment: go.Spot.Center,
    "undoManager.isEnabled": true
});

myDiagram.nodeTemplate =
    $(go.Node, "Auto",
        {movable: false},
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Circle", 
            { width: 30, height: 30, strokeWidth: 2 },
            {  fill:  "white" },
            new go.Binding("stroke", "color"),
            new go.Binding("fill", "isSelected", (s, obj) => s ? "#BEAEE2" : "white").ofObject()
            ),
        $(go.TextBlock, 
            { margin: 10 },  
            new go.Binding("text", "name")  
        )
    );

    myDiagram.model.addNodeData({ key: "_",  name: "" , color: "transparent", loc: "-1100 -10" });
    myDiagram.model.addNodeData({ key: "q0",  name: "q0" , color: "purple", loc: "-1030 -10" });
    myDiagram.model.addNodeData({ key: "q1",  name: "q1" , color: "purple",   loc: "-960 -10"  });
    myDiagram.model.addNodeData({ key: "q2",  name: "q2" , color: "purple", loc: "-890 -10"  });
    
    myDiagram.model.addNodeData({ key: "T2", color:"transparent", loc: "-995 -10"  });
    myDiagram.model.addNodeData({ key: "T4", color:"transparent", loc: "-925 -10"  });
    myDiagram.model.addNodeData({ key: "T1", color:"transparent", loc: "-1030 25"  });
    myDiagram.model.addNodeData({ key: "T3", color:"transparent", loc: "-960 25"  });
    
myDiagram.linkTemplate =
    $(go.Link,
        $(go.Shape, { 
        stroke: "gray"},
        new go.Binding("stroke", "isHighlighted", fla => fla ? "red" : "gray")
    ),
        $(go.Shape, { toArrow: "Standard" }),
        $(go.Panel, "Auto",  
            
          $(go.TextBlock, "",  // the label text
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4, 
            },
            new go.Binding("text", "text").makeTwoWay()),
          new go.Binding("segmentOffset", "segmentOffset", go.Point.parse).makeTwoWay(go.Point.stringify)
        )
            
    );

myDiagram.model.addLinkData({ from: "_",  to: "q0"  });
myDiagram.model.addLinkData({ from: "q0",  to: "q0"  , text: "\n\na/a/R\nb/a/R ", key:"T1"});
myDiagram.model.addLinkData({ from: "q0",  to: "q1"  , text: "B/B/L\n\n", key:"T2"});
myDiagram.model.addLinkData({ from: "q1",  to: "q1"  , text: "\na/a/L", key:"T3"});
myDiagram.model.addLinkData({ from: "q1",  to: "q2"  , text: "B/B/R\n\n", key:"T4"});
    
    
async function showCurrentNodeGraph(key) {
    const currentNode = myDiagram.findNodeForKey(key);
    selectNode(currentNode);
    await sleep(1000);
    deselectNode(currentNode);
  }
  
  function selectNode(node) {
    node.isSelected = true;
  }
  
  function deselectNode(node) {
    node.isSelected = false;
  }


function highlightLinkBetweenNodes(startNodeKey, endNodeKey) {
    const linkDataArray = myDiagram.model.linkDataArray;
    for (let i = 0; i < linkDataArray.length; i++) {
      const linkData = linkDataArray[i];
      console.log(linkData)
      if (linkData.from === startNodeKey && linkData.to === endNodeKey) {
        return linkData.key; 
      }
    }
  }
/************************************************************************************************************************************************************************** */
const selectLanguageDom = document.getElementById('languanges-select')

selectLanguageDom.addEventListener('change', handleLanguageChange )

function handleLanguageChange(){
    var selectedLanguage = selectLanguageDom.value;
    changeLanguage(selectedLanguage);
}

function get_speed(){
    const slider = document.getElementById("slider");
    const tiempoSeleccionado = parseFloat(slider.value) * 1000; 
    return tiempoSeleccionado;
}

document.addEventListener("DOMContentLoaded", function() {
    changeLanguage('en');
    var botton = document.getElementById("word-button");
    var input = document.getElementById("word-text");
    


    botton.addEventListener("click", handleButtonClick);

    function handleButtonClick() {
        const valorInput = input.value;
        displayExpression(valorInput);
        clearInput();
        processString(valorInput);
      }
      
    function displayExpression(expression) {
        const expressionElement = document.getElementById('word-checking');
        expressionElement.innerText = expression;
      }
      
    function clearInput() {
        input.value = '';
      }

      async function processString(wordToValidate) { 
        reset()
        convertStringIntoArray(" "+wordToValidate+" ")
        updateTape()
        const isAccepted = await accept()
        if (!isAccepted) {
            speakResult(false);
            createHistoryTile(wordToValidate, false);
            return;
         }
      
         showCurrentNodeGraph(TM.currentState)
         speakResult(isAccepted);
         createHistoryTile(wordToValidate, isAccepted);   
        }
      
});
