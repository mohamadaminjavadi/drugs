const values= new Array(2);

// when you are trying to get dom elements on load 
// you sould make sure that the window is loaded
// otherwize your select will return null 
window.onload = async function example() {

    const response = await fetch('../data/newData.tsv');
    const data = await response.text();
    const table = data.split('\n').slice(1);

    table.forEach( function(row,i){
        const columns = row.split('\t');
        const id = columns[0];
        const name = columns[1];
        values[i] = [id,name];
    });

    

    /**
     * like this senario
     * the whole code sould be insede window.onload function
     * 
     * or if you are using jquery you should use $(document).ready(() => { // your code here})
     * 
     */

    const datalist = document.getElementById("datalist");

 

    values.forEach(function(val){
        var option= document.createElement("option");
        option.value=val[1];
        option.text=val[0];
        datalist.appendChild(option);
    });
}

addvalue=(dl)=>{
    if(dl.value){

        const maindiv=document.getElementById("selected-drugs");

        var selectedTitle= document.createElement("h5");
        selectedTitle.classList.add("card-title");
        selectedTitle.innerHTML=dl.value;

        var X_button_container = document.createElement("button");
        X_button_container.classList.add("close");

        X_button_container.addEventListener("click",function(){
            selectedContainer.remove();
            X_button_container.remove();
            X_button.remove();
            if(maindiv.firstElementChild==null){
                calculate.style.display="none";
            }
        });

        var X_button = document.createElement("div");
        X_button.innerHTML="&times";
        
        var selectedBody= document.createElement("div");
        selectedBody.classList.add("card-body");

        var selectedContainer= document.createElement("div");
        selectedContainer.classList.add("card");

        selectedContainer.appendChild(selectedBody);
        selectedBody.appendChild(selectedTitle);
        X_button_container.appendChild(X_button);
        selectedBody.appendChild(X_button_container);
        maindiv.appendChild(selectedContainer);

        dl.value=null;

        const calculate= document.getElementById("calculate");
        
        const drugs_list=[];
        drugs_list.push(selectedTitle.innerHTML);
        
        if(maindiv){
            // console.log(maindiv.firstElementChild);
            calculate.style.display="inline";
            calculate.style.float="left";
            
        }
        else{
            calculate.style.display="none";
            
        }
    }   
}

calc=()=>{
    const maindiv=document.getElementById("selected-drugs");
    const lengthOfChildren = maindiv.childNodes.length -1;
    var child_nodes_names = new Array;

    const h5 =document.getElementsByTagName("h5");

    for( var i=1; i<=lengthOfChildren; i++ ){
        child_nodes_names.push(maindiv.childNodes[i].firstChild.firstChild.innerHTML)
    }

    // all drug titles are stored in child_nodes_names so send it to serveice
    
}