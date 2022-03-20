class table{
    constructor(parent, xSize, ySize, name = "default", schema = []){
        this.parent = parent
        this.xSize = xSize
        this.ySize = ySize
        this.name = name
        this.schema = schema
        this.content = {}
        //this.parent.innerHTML = "test"
        Element(parent,"p").innerText = name
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
                //console.log(this.schema.length)
                if (i == 0){
                    cell.innerHTML = j
                }
                if (this.schema.length >= i && j == 0){
                    cell.innerHTML = this.schema[i]
                    console.log(this.schema[i])
                }

                
                
                cell.id = this.name + "#" + j + "-" + i
                this.content[j+"-"+i] = {"element":cell, "type":this.schema[i], "x" : j, "y" : i, "value": 0}
                //this.content[cell.id] = {element:cell}
            }
        }
        var row = Element(this.table, "tr")
        var cell = Element(row, "td")
        console.log(this.schema[this.schema.length-1])
        for(var key in this.schema[this.schema.length-1]) {
            var value = this.schema[this.schema.length-1][key]
            console.log(key,value)
            cell.innerHTML += key + ": " + value + "<br>"
        }
        console.log(this.content)
        cell.style.height = "120px"
        cell.style.width = "120px"
        //console.log(this.schema[this.size])
        //cell.innerHTML = this.schema[this.ySize]
    }

    
}

function Element(parent, type){
    var element = document.createElement(type)
    parent.appendChild(element)
    return element
}

