const values= {};
const reverseValues = {};

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
        const name = columns[1] ? columns[1].trim() : '';
        values[name] = id;
        reverseValues[id] = name;
    });
    

    

    /**
     * like this senario
     * the whole code sould be insede window.onload function
     * 
     * or if you are using jquery you should use $(document).ready(() => { // your code here})
     * 
     */

    const datalist = document.getElementById("datalist");

 
    Object.keys(values).forEach(function(name){
        var option= document.createElement("option");
        option.value = name;
        datalist.appendChild(option);
    });


    const inputField = document.getElementById("input");
    const hiddenInputField = document.getElementById("hidden-input");

    inputField.onchange = (e) => {
        const name = e.target.value;
        const id = values[name]
        if(window.selectedItems) {
            window.selectedItems.push(id);
            guessNext(window.selectedItems);
        } else {
            window.selectedItems = [id];
            guessNext(window.selectedItems);
        }
    }
}

addvalue=(dl)=>{
    if(dl.value){
        // creating a card for viewing selected drug
        const maindiv=document.getElementById("selected-drugs");

        var selectedTitle= document.createElement("h5");
        selectedTitle.classList.add("card-title");
        selectedTitle.innerHTML=dl.value;

        var X_button_container = document.createElement("button");
        X_button_container.classList.add("close");
        // end of creating a card for viewing selected drug
        
        // x_button functioning : delete from both view and array
        X_button_container.addEventListener("click",function(){
            selectedContainer.remove();
            X_button_container.remove();
            X_button.remove();
            if(maindiv.firstElementChild==null){
                calculate.style.display="none";
            }
            var deleteTarget = selectedContainer.firstChild.firstChild.innerHTML;
            var deleteTargetId= values[deleteTarget];

            var index = window.selectedItems.indexOf(deleteTargetId);
            window.selectedItems.splice(index, 1);
            guessNext(window.selectedItems);
        });
        // end of x_button functioning

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
        
        if(maindiv){
            calculate.style.display="inline";
            calculate.style.float="left";
        }
        else{
            calculate.style.display="none";
        }
    }   
}

// services
// service1 : guessNext
guessNext=(selectedItems)=>{
    const xhr = new XMLHttpRequest();
    
    xhr.open("POST","http://217.218.215.67:6645/Drug/GuessNext",true);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(selectedItems);
    const responseId = xhr.responseText;

    if(responseId != null){
        var predict = document.getElementById("predict-container");
        if(! predict.firstElementChild){
            var predictInput = document.createElement("textarea");
            predictInput.setAttribute("readOnly","true");
            predictInput.value ="پیشنهاد: " + reverseValues[responseId];
            predictInput.style.width= "350px";
            predictInput.style.height="70px";
            predictInput.style.color="black";
            predictInput.style.marginLeft="25px";
            predictInput.style.borderRadius="5px";
            predictInput.style.border="1px dashed #212121";
            predictInput.style.backgroundColor="#0097A7";


            var br = document.createElement("br");
    
            var addButton = document.createElement("button");
            addButton.classList.add('btn');
            addButton.classList.add('btn-primary');
            addButton.innerHTML="اضافه کردن";
            addButton.style.width="100px";
            addButton.style.marginLeft="25px"
            
            addButton.onclick = ()=>{
                addvalue(predictInput);
                if(window.selectedItems) {
                    window.selectedItems.push(responseId);
                    guessNext(window.selectedItems);
                } else {
                    window.selectedItems = [responseId];
                    guessNext(window.selectedItems);
                }
            }
            predict.appendChild(predictInput);
            predict.appendChild(br);
            predict.appendChild(addButton);
        }
        else{
            while(predict.firstElementChild){
                predict.removeChild(predict.firstElementChild);
            }

            guessNext(window.selectedItems);
            
            addButton.onclick = ()=>{
                addvalue(predictInput);
                if(window.selectedItems) {
                    window.selectedItems.push(responseId);
                    guessNext(window.selectedItems);
                } else {
                    window.selectedItems = [responseId];
                    guessNext(window.selectedItems);
                }
            }
        }   
    }   
}

// service 2: likelihood

calc=()=>{
    const listOfObjects = [];
    for( i=0; i<window.selectedItems.length; i++){
        const list =[...window.selectedItems];
        var item = list[i];
        list.splice(i,1);

        var data ={
            "list": list,
            "item": item
        }

        // error: cors
        const xhr = new XMLHttpRequest();
        xhr.open("POST","http://217.218.215.67:6645/Drug/Likelihood",true);
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send(data);
        const response = xhr.responseText;

        const singleObject = {};
        singleObject.name = reverseValues[item];
        singleObject.id = item;
        singleObject.probability = response;
        listOfObjects.push(singleObject);
        
    }
    // console.log(listOfObjects);
    // list of objects is an array of objects which each object has name,id,probability of a selected drug.
    // then you should clear the whole page and only show the results.
}



















// var index = window.selectedItems[i];
//         var list= window.selectedItems.splice(index, 1);
//         var item= window.selectedItems[i];
//         var data = {
//             "list":list,
//             "item":item
//         } 
//         const xhr = new XMLHttpRequest();
//         xhr.open("POST","http://217.218.215.67:6645/Drug/Likelihood",true);
//         xhr.setRequestHeader("Content-type","application/json");
//         xhr.send(data);
//         const responseId = xhr.responseText;