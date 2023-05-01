

let thead = document.querySelector(".excel-columns");
let tbody = document.getElementById("excel-tbody");
var currentCell = "";
const columns = 26;
const rows = 100;
var cutValue={};

const boldbtn = document.getElementById("bold-btn");
const italicbtn = document.getElementById("italic-btn");
const underlinebtn = document.getElementById("underline-btn");

const leftbtn = document.getElementById("left");
const centerbtn = document.getElementById("center");
const rightbtn = document.getElementById("right");

const fontfamilybtn = document.getElementById("fontfamily");
const fontsizebtn = document.getElementById("fontsize");

const cutbtn = document.getElementById("cut");
const copybtn =document.getElementById("copy");
const pastebtn =document.getElementById("paste");

const textcolor = document.getElementById("text-color");
const fillcolor = document.getElementById("fill-color");


for( let i =0; i< columns; i++){

    let th = document.createElement("th");
    th.innerText = String.fromCharCode(65+i);
    thead.appendChild(th);
}


for(let i=0;i<rows;i++){

let tr = document.createElement("tr");
let th = document.createElement("th");
th.innerText = i + 1;
tr.appendChild(th);

for(let t =0;t<columns;t++){
    let td = document.createElement("td");
    td.setAttribute("contenteditable","true");
    td.setAttribute("spellcheck", "false");
    td.setAttribute("id",`${String.fromCharCode(65+t)}${i+1}`);
    td.addEventListener("focus",(event)=>{
        onfocusfunction(event);
    })
    tr.appendChild(td);
}
tbody.append(tr);

}

let matrix = new Array(rows);

for(let i=0;i<rows;i++){
    matrix[i] = new Array(columns);
    for(let j=0;j<columns;j++){
        matrix[i][j]={};
    }
}
console.log(matrix);



function onfocusfunction(e){

    currentCell = e.target;

document.getElementById("cell-id").innerText = e.target.id;
    
    updateJson(currentCell);
}

boldbtn.addEventListener("click",()=>{
    // console.log(currentCell);
    if( currentCell.style.fontWeight =="bold"){
    currentCell.style.fontWeight ="normal";
    }
    else{
        currentCell.style.fontWeight ="bold"; 
    }
    updateJson(currentCell);
});
italicbtn.addEventListener("click",()=>{
    // console.log(currentCell);
    if( currentCell.style.fontStyle =="italic"){
    currentCell.style.fontStyle ="normal";
    }
    else{
        currentCell.style.fontStyle ="italic"; 
    }
    updateJson(currentCell);
});
underlinebtn.addEventListener("click",()=>{
    // console.log(currentCell);
    if( currentCell.style.textDecoration =="underline"){
    currentCell.style.textDecoration ="none";
    }
    else{
        currentCell.style.textDecoration ="underline"; 
    }
    updateJson(currentCell);
});

leftbtn.addEventListener("click",()=>{

    currentCell.style.textAlign="left";
    updateJson(currentCell);
});
centerbtn.addEventListener("click",()=>{

    currentCell.style.textAlign="center";
    updateJson(currentCell);
});
rightbtn.addEventListener("click",()=>{

    currentCell.style.textAlign="right";
    updateJson(currentCell);
});


textcolor.addEventListener("input",()=>{
    currentCell.style.color=textcolor.value;
    updateJson(currentCell);
})

fillcolor.addEventListener("input",()=>{
    currentCell.style.backgroundColor=fillcolor.value;
    updateJson(currentCell);
})




fontfamilybtn.addEventListener("change",()=>{
    currentCell.style.fontFamily = fontfamilybtn.value;
    updateJson(currentCell);
});
fontsizebtn.addEventListener("change",()=>{
    currentCell.style.fontSize = fontsizebtn.value;
    updateJson(currentCell);
});


copybtn.addEventListener("click",()=>{
    cutValue = {
        style : currentCell.style.cssText,
        text : currentCell.innerText,
    };
    updateJson(currentCell);
});

cutbtn.addEventListener("click",()=>{
    cutValue = {
        style : currentCell.style.cssText,
        text : currentCell.innerText,
    };
    console.log(currentCell);
    currentCell.style = null;
    currentCell.innerText = null;
    console.log(currentCell);
    updateJson(currentCell);

});
pastebtn.addEventListener("click",()=>{

    currentCell.style.cssText = cutValue.style;
    currentCell.innerText= cutValue.text;
    updateJson(currentCell);
});

function updateJson(currentCell){

    var json = {
        style : currentCell.style.cssText,
        text : currentCell.innerText,
        id : currentCell.id
    }
    var id = currentCell.id.split("");
    console.log(id);
    var i = id[1]-1;
    var j = id[0].charCodeAt(0)-65;
    matrix[i][j] = json;
    console.log(matrix);
}

function downloadJson(){

    // Convert JSON data to a string
  const jsonString = JSON.stringify(matrix);

  // Create a Blob with the JSON data and set its MIME type to application/json
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create an anchor element and set its href attribute to the Blob URL
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json"; // Set the desired file name

  // Append the link to the document, click it to start the download, and remove it afterward
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}

 document.getElementById("upload").addEventListener("change",uploadjson);

function uploadjson(event){

    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const fileContent = e.target.result;
  
        // {id,style,text}
        // Parse the JSON file content and process the data
        try {
          const jsonData = JSON.parse(fileContent);
          console.log("matrix2", jsonData);
          matrix = jsonData;
          jsonData.forEach((row) => {
            row.forEach((cell) => {
              if (cell.id) {
                var myCell = document.getElementById(cell.id);
                myCell.innerText = cell.text;
                myCell.style.cssText = cell.style;
              }
            });
          });
          // Process the JSON data as needed
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
  
      reader.readAsText(file);
    }

}