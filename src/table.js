class table{
    constructor(parent, xSize, ySize, name = "default", schema = []){
        this.parent = parent
        this.xSize = xSize
        this.ySize = ySize
        this.name = name
        this.schema = schema
        this.content = {}
        //this.parent.innerHTML = "test"
        this.title = Element(parent,"p")
        this.title.innerText = name
        this.title.classList.add("title")
        this.initTable()
        console.log(this)

    }

    // renderTable(){
    //     this.table.parentNode.removeChild(this.table)
    //     this.initTable()
    //}

    initTable(){
        this.table = Element(this.parent,"table")
        for (let i = 0; i<this.ySize; i++){
            var row = Element(this.table, "tr")
            //this.content[this.schema[i]] = {}
            for (let j = 0; j<this.xSize; j++){
                var cell = Element(row, "td")
                cell.classList.add("mrpTable");
                var inputField = document.createElement("div")
                //console.log("AAAAAAAAAAAAAAAA",this.title)
                
                inputField = document.createElement("input")
                inputField.classList.add("input_table")
                inputField.id = "IP"+ "#" + j + "-" + i
                
                cell.appendChild(inputField)
                console.log(this.schema.length)
                if (i == 0){
                    cell.innerHTML = j
                    cell.classList.add("table_header")
                }
                if (j == 0){
                    cell.classList.add("table_header")
                }
                if (this.schema.length >= i && j == 0){
                    cell.innerHTML = this.schema[i]
                    console.log(this.schema[i])
                }
                
                cell.id = this.name + "#" + j + "-" + i
                
                this.content[j+"-"+i] = {
                    "element":cell, 
                    "type":this.schema[i], 
                    "id": j+"-"+i, "x" : j, 
                    "y" : i, 
                    "value": 5, 
                    "parent":this, 
                    "inputField":inputField,
                    "writeValue": function(value){
                        console.log("ooo",this); 
                        console.log("XDXD2",this.inputField.type)
                        if (this.inputField.type == "text"){
                            this.inputField.value = value; 
                        }else{
                            this.element.innerHTML = value;
                        }
                        this.value = value; 
                        
                        
                        console.log("ooo",this)}
                    }
                
                //this.content[cell.id] = {element:cell}
            }
        }
        // var row = Element(this.table, "tr")
        // var cell = Element(row, "td")
        // console.log(this.schema[this.schema.length-1])
        for(var key in this.schema[this.schema.length-1]) {
            var value = this.schema[this.schema.length-1][key]
            // console.log(key,value)
            this.description = Element(this.parent, "div")
            var description_text = Element(this.description, "label")
            description_text.setAttribute("type", "text")
            description_text.innerHTML = key
            description_text.classList.add("mrpDescription_text")
            var description_input = Element(this.description, "input")
            description_input.setAttribute("type", "number")
            description_input.setAttribute("value", value)
            // description_input.innerHTML = value
            description_input.classList.add("mrpDescription_input")
            this.description.classList.add("mrpDescription")
            //this.description.innerHTML = key + ": " + value

            //cell.innerHTML += key + ": " + value + "<br>"
        }
        console.log(this.content)
        // cell.style.height = "120px"
        // cell.style.width = "120px"
        //console.log(this.schema[this.size])
        //cell.innerHTML = this.schema[this.ySize]
    }

    accessValue(id){
        return this.content[id].value
        
    }

    writeValue(id, value){
        this.content[id].value = value
        this.content[id].element.innerHTML = value
    }

    nextX(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = (parseInt(coors[0])+1).toString()+"-"+coors[1]
        this.verifyID(ret.split("-"))
        return ret
    }
    nextY(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = coors[0] +"-"+ (parseInt(coors[1])+1).toString()
        this.verifyID(ret.split("-"))
        return ret
    }

    prevX(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = (parseInt(coors[0])-1).toString()+"-"+coors[1]
        this.verifyID(ret.split("-"))
        return ret
    }
    prevY(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = coors[0] +"-"+ (parseInt(coors[1])-1).toString()
        this.verifyID(ret.split("-"))
        return ret
    }

    verifyID(id){
        if (parseInt(id[0])<0 || id[1]<0|| parseInt(id[0])>this.xSize-1 || parseInt(id[1])<0 || parseInt(id[1])>this.ySize-1 || id[0] == "" || id[1] == "" ||id[0] == "-" || id[1] == "-"){
            console.log(id[0],"---", id[1])
            throw 'Invalid ID; ID out of scope';
        }else{
            //console.log("here dude: ", id[0],"---", id[1])
            return 0
        }
    }
    
}

function Element(parent, type){
    var element = document.createElement(type)
    parent.appendChild(element)
    return element
}

