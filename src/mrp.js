class mrp{
    constructor(parent, schema, title="default", popyt, na_stanie, czas_realizacji){

        this.loopControl = 1 //This value controls the loop

        this.loopIterator = 0 //this value shows how many loop functions have happened
        this.rowOverflow = 0
        this.cellOverflow = 0

        this.parent = parent
        this.schema = schema
        this.popyt = popyt
        this.na_stanie = na_stanie
        this.czas_realizacji = czas_realizacji
        this.updateGHP()
        var parentElement = document.getElementById(parent)
        var xBlocks = this.getMaxWeek() + 1
        this.xBlocks = xBlocks
        var yBlocks = 4
        this.productionListCells = []
        this.productionListAmount = []
        var xCellSize = 80
        var yCellSize = 30
        //parentElement.innerHTML = "test"
        var formContent = document.getElementById("form.contentBox")
        formContent.remove()
        var contentBox = document.createElement("div")
        contentBox.id = title+".contentBox"
        contentBox.classList.add("contentBox")
        //contentBox.style.height = "1000px"
        parentElement.appendChild(contentBox)
        this.GHPTable = new table(contentBox, xBlocks, yBlocks, "GHP", this.GHP, this)
        this.PodstawaTable = new table(contentBox, xBlocks, 7, "Podstawa", this.Podstawa, this)
        this.GoraTable = new table(contentBox, xBlocks, 7, "Góra", this.Gora, this)
        this.FilarTable = new table(contentBox, xBlocks, 7, "Filar", this.Filar, this)
        this.NogaTable = new table(contentBox, xBlocks, 7, "Noga", this.Noga, this)
        this.PodlogaTable = new table(contentBox, xBlocks, 7, "Podłoga", this.Podloga, this)
        this.DachTable = new table(contentBox, xBlocks, 7, "Dach", this.Dach, this)
        this.HaczykTable = new table(contentBox, xBlocks, 7, "Haczyk", this.Haczyk, this)

        this.tables = {
            "GHP": this.GHPTable,
            "Podstawa": this.PodstawaTable,
            "Góra": this.GoraTable,
            "Filar": this.FilarTable,
            "Noga": this.NogaTable,
            "Podłoga": this.PodlogaTable,
            "Dach": this.DachTable,
            "Haczyk": this.HaczykTable
        }
    

        // console.log("popyt:", popyt)
        // console.log("na_stanie: " + na_stanie)
        // console.log("czas_realizacji: " + czas_realizacji)

        this.currentCell = this.GHPTable.content["1-1"]
        // console.log("",this.GHPTable)
        var renderButton = addElement(this.GHPTable.table, "button")
        renderButton.innerText = "Odśwież"
        // console.log("button",this)
        var thisInstance = this
        //renderButton.mrpOf = this
        //renderButton.setAttribute("mrp", this)
        renderButton.addEventListener("click", function(eventState, classInstance = thisInstance){
            // console.log("here")
            // console.log(this)
            // console.log(eventState)
            // console.log(classInstance)
            classInstance.loop()
        })
        
        this.updateAfter("GHP", "1-1","0")
        this.updateAfter("GHP", "1-3",this.na_stanie)
        for(var week in this.popyt) {
            this.gc("GHP", (week) + "-1")
            this.write(this.popyt[week]) 
        }

        this.loop()

        // this.calcultateMRP("Podstawa", "GHP")
        // this.calcultateMRP("Góra", "GHP")
        // this.calcultateMRP("Filar", "Góra")
        // this.calcultateMRP("Noga", "Podstawa")
        // this.calcultateMRP("Podłoga", "Podstawa")
        // this.calcultateMRP("Dach", "Góra")
        // this.calcultateMRP("Haczyk", "Góra")
    }

    loop(){
        //this.loopIterator += 1
        //this.updateAfter("GHP", "1-2","")
        this.updateAvailabilityInGHP()
        this.checkAfter("GHP", "1-3","1")
        this.calcultateMRP("Podstawa", "GHP")
        this.calcultateMRP("Góra", "GHP")
        this.calcultateMRP("Filar", "Góra")
        this.calcultateMRP("Noga", "Podstawa")
        this.calcultateMRP("Podłoga", "Podstawa")
        this.calcultateMRP("Dach", "Góra")
        this.calcultateMRP("Haczyk", "Góra")
        // this.currentCell = this.testTable2.content["1-"+this.]
        // if(this.loopIterator >50){
        //     console.log("what")
        //     this.loopControl = 0
        // }
        // if (!this.loopControl){
        //     console.log("loopEnded", this.loopControl)
        // }else{
        //     this.loop()
        // }
        // if(this.cellOverflow){
        //     alert("Produkcja nie mieści się w zakresie dostępnego okresu czasowego")
        // }
    }

    updateAvailabilityInGHP() {
        this.updateAfter("GHP", "1-3",this.na_stanie)
        for (var i = 1; i<this.xBlocks; i++){
            this.gc("GHP", i + "-3")
            var previousCellValue = parseInt(this.gcv("GHP", (i-1)+"-3"))
            if(i==1) previousCellValue = this.read()
            this.write(previousCellValue-this.gcv("GHP", i+"-1")+this.gcv("GHP", i+"-2"))
        }
    }

    anc(){
        //console.log(currentCell)
        parent = this.currentCell.parent
        // console.log(parent.content[parent.nextX(operatedCell.id)])
        this.verifyID(parent.nextX(this.currentCell.id))
        this.currentCell = parent.content[parent.nextX(this.currentCell.id)]
        // return this.currentCell
    } //Access Next Cell
    anr(){
        parent = this.currentCell.parent
        this.verifyID(parent.nextY(this.currentCell.id))
        this.currentCell = parent.content[parent.nextY(this.currentCell.id)]
    } //Access Next Row
    apc(){
        parent = this.currentCell.parent
        this.verifyID(parent.prevX(this.currentCell.id))
        if (this.cellOverflow == 0){
            this.currentCell = parent.content[parent.prevX(this.currentCell.id)]
        }
        
    } //Access Previous Cell
    apr(){
        parent = this.currentCell.parent
        this.verifyID(parent.prevY(this.currentCell.id))
        if (this.rowOverflow == 0){
            this.currentCell = parent.content[parent.prevY(this.currentCell.id)]
        }
        
    } //Access Previous Row
    gc(tableName, id){
        //console.log("HMM",parent)
        this.currentCell = this.tables[tableName].content[id]
    } //Get Cell
    gcv(tableName, id){
        //console.log("get cell value :", id, this.currentCell.parent.content[id], this.currentCell.parent.content[id].value)
        var table = this.tables[tableName]
        return table.content[id].value
    } //Get Cell Value
    write(value){
        this.currentCell.writeValue(value)
    }
    read(){
        return parseInt(this.currentCell.value)
    }
    verifyID(id){
        id = id.split("-")
        if (parseInt(id[0])<1 || id[1]<1|| parseInt(id[0])>this.xSize-1 || parseInt(id[1])<0 || parseInt(id[1])>this.ySize-1 || id[0] == "" || id[1] == "" ||id[0] == "-" || id[1] == "-"){
            console.log(id[0],"HIT OVERFLOW", id[1])
            if (parseInt(id[0])<1){
                this.cellOverflow = 1
            }
            if (parseInt(id[1])<1){
                this.rowOverflow = 1
            }
            return 0
        }else{
            //console.log("here dude: ", id[0],"+++", id[1])
            return 0
        }
    }
    updateAfter(tableName, id, value){
        this.gc(tableName, id)
        
        console.log(this.currentCell)
        for (var i = id.split("-")[0]; i<this.xBlocks; i++){
            console.log(value)
            this.write(value)

            console.log("superWriter",i)
            if(i < this.xBlocks-1){
                this.anc()
            }
        }
    }

    checkAfter(tableName, id, demandRow){
        console.log("Filling production row using production_size from form,\n")
        var week =  id.split("-")[0]
        for (var i = week; i<this.xBlocks; i++){
            this.gc(tableName, i+"-3")
            console.log("----------------\nCurrentCell: "+ this.currentCell.id)
            console.log("InStock: ",this.read())
            console.log("To compare cellId:", i+"-"+demandRow, "value: ", this.gcv(tableName, i+"-"+demandRow))
            var popytValue = this.gcv(tableName, i+"-"+demandRow)

            if(popytValue == 0){
                console.log("nothing to do")
            }else{
                //var number = parseInt(this.read())
                //console.log(popytValue > number)
                if (popytValue > this.read()){
                    console.log("GO TO PRODUCTION, popyt ABOVE AVAILABLE")
                    var inStock = this.read()
                    console.log("currentCell: ", this.currentCell.id)
                    this.gc(tableName, i+"-2")
                    // this.tagProduction(this.currentCell.id, this.getProductionSize(tableName))


                    console.log("currentCell: ", this.currentCell)
                    console.log("read - popyt,", this.read(), popytValue)
                    var subtracted = inStock - popytValue
                    // var productionIterations = 0
                
                    // while (productionIterations * this.getProductionSize(tableName) +subtracted < 0){
                    //     productionIterations++
                    // }
                    //this.updateProduction(this.currentCell.id)

                    // this.updateAfter(tableName, currentID, productionIterations * this.getProductionSize(tableName) +subtracted)
                    this.gc(tableName,  i+"-3")
                    //this.updateAfter(tableName, this.currentCell.id, this.getProductionSize(tableName) + subtracted)
                    
                }else{
                    console.log(popytValue, this.read())
                    console.log("NOT PRODUCED")
                    var subtracted = this.read() - popytValue
                    console.log(subtracted)
                    this.write(subtracted)
                    this.updateAfter(tableName, this.currentCell.id, subtracted)
                    this.gc(tableName, this.currentCell.id)
                }
            }
        }

        // for (var o = this.productionListCells.length - 1; o>=0 ; o-- ){
        //     console.log("Produkcja",o, this.productionListCells[o], this.productionListAmount[o])
        //     this.slotProduction(this.productionListCells[o],this.productionListAmount[o])
        // }
    }
    updateProduction(id){
        this.gc("GHP", id)
        //production will be always available if we go from left, but we should check forward if there's not anything in range
        // create a list of anything in range of our production time (and of it's production time, and go from the latest element from the list) also check along the way

        //?? ok different approach, we do first run where we just tag where production is going to be needed for sure then we go by that onto second run where we decide production
        // <><><><><>
        console.log(this.getProductionSize("GHP"))

        
    }
    getMaxWeek() {
        var max = 0;
        for(var week in this.popyt) {
            if(parseInt(week) > max) {
                max = parseInt(week);
            }
        }
        return max
    }
    getProductionSize(tableName){
        var i = tableName == "GHP" ? 4 : 7
        return parseInt(this.tables[tableName].schema[i]["Wielkość partii"])
    }

    getProductionTime(tableName){
        var i = tableName == "GHP" ? 4 : 7
        return parseInt(this.tables[tableName].schema[i]["Czas realizacji"])
    }

    tagProduction(id, value){
        this.productionListCells.push(id)
        console.log("Start production in cells", this.productionListCells)
        this.write(value)
    }

    slotProduction(id, iterations){
        this.gc("GHP",id)
        this.apc()
        console.log("Entered Slot Production")
        console.log(j)
        for(var j = 0 ; j<iterations;j++){
            console.log(j)
            this.checkProduction()
            // if(this.currentCell.value == ""){
            //     for(var i = 0; i < productionSize ; i++){
            //         console.log("ASKO2",productionSize)
            //         this.write("X")
            //         if(!(productionSize-1 == i)){
            //             this.apc()
            //         }
                    
            //         // console.log(i,"verifying production possible on cell: ", this.currentCell.id)
            //         // console.log("nothing:",this.currentCell.value)
        
            //     }
            //     this.write("S")
            // }else if(this.currentCell.value == "X" || this.currentCell.value == "S"){
            //     this.apc()
            //     console.log("SXka")
            //     //console.log("iterations: ", iterations)
            //     //this.slotProduction(this.currentCell.id,iterations - 1)
                
            // }
            //console.log("OVERFLOW",this.cellOverflow)
            // }else if(this.currentCell.value == "S"){
            //     for (var y = 0; y< productionSize; y++){
            //         this.apc()
            //     }
            //     console.log("Ska",this.currentCell)
            //     this.slotProduction(this.currentCell.id)
            // } 
        }
        
    }
    checkProduction(){
        console.log("land of rebase",this.currentCell.parent.prevX(this.currentCell.id))
        console.log(this.gcv("GHP", this.currentCell.parent.prevX(this.currentCell.id)))
        var productionSize = this.getProductionTime("GHP")
        
        if(this.currentCell.value == ''){
            for(var i = 0; i < productionSize ; i++){
                console.log("ASKO2",productionSize)
                if(awareProduction){
                    this.write("X")
                }
                
                if(!(productionSize-1 == i)){
                    this.apc()
                }
                
                // console.log(i,"verifying production possible on cell: ", this.currentCell.id)
                // console.log("nothing:",this.currentCell.value)
    
            }
            this.write(this.getProductionBatch(this.currentCell.parent.name))
            this.calcultateMRP("Podstawa", "GHP")
            this.calcultateMRP("Góra", "GHP")
            this.calcultateMRP("Filar", "Góra")
            this.calcultateMRP("Noga", "Podstawa")
            this.calcultateMRP("Podłoga", "Podstawa")
            this.calcultateMRP("Dach", "Góra")
            this.calcultateMRP("Haczyk", "Góra")

            var currentID = this.currentCell.id
            console.log(currentID)


        }else if(this.currentCell.value > 0 && this.gcv("GHP", this.currentCell.parent.prevX(this.currentCell.id)) == ""){
            for(var i = 0; i < productionSize ; i++){
                console.log("ASKO2",productionSize)
                if(awareProduction){
                    this.write("X")
                }
                
                if(!(productionSize-1 == i)){
                    this.apc()
                }
                
                // console.log(i,"verifying production possible on cell: ", this.currentCell.id)
                // console.log("nothing:",this.currentCell.value)
    
            }
            //this.write("S")
            this.write(this.getProductionSize("GHP"))
            this.updateProductionInTable("Podstawa", "GHP")
            this.updateProductionInTable("Góra", "GHP")

            var currentID = this.currentCell.id
            console.log(currentID)
        }else if(this.currentCell.value == "X" || this.currentCell.value > 0){
          
            if(this.cellOverflow){
                this.write("Produkcja poza zakresem czasowym")
            }else{
                this.apc()
                this.checkProduction()
            }
            
            // console.log("SXka")
            
            //console.log("iterations: ", iterations)
            //this.slotProduction(this.currentCell.id,iterations - 1)
            
        }
        // console.log("OVERFLOW",this.cellOverflow)
        

    }

    calcultateMRP(tableName, parentTableName){
        var table = this.tables[tableName]
        this.updateProductionInTable(tableName, parentTableName)
        this.updateAvailabilityInTable(table)
        this.updateNetDemand(table, "1")
        this.planOrders(tableName)
        this.updateOrderRecieve(tableName, table)
    }  
    
    updateNetDemand(table, week) {
        this.updateAfter(table.name, week+"-4", "0")
        
        for (var i = 1; i<this.xBlocks; i++){
            var inStock = this.gcv(table.name, i+"-3")
            if( inStock < 0) {
                this.gc(table.name, i+"-4")
                this.write(inStock * (-1))
                }
        }
    }

    updateOrderRecieve(tableName, table){
        var productionTime = this.getProductionTime(tableName)
        // console.log("Production Time for ", tableName, ": ", productionTime)

        for (var i=1; i<this.xBlocks-1; i++){
            this.gc(table.name, i+'-5')
            var value = parseInt(this.currentCell.value)
            if (value != 0) {
                this.gc(table.name, i + productionTime +"-6")
                this.write(value)
                this.updateNetDemand(table, i + productionTime + 1)

            }
        }
    }

    updateAvailabilityInTable(table) {
        this.updateAfter(table.name, "1-3", "0")
        this.updateAfter(table.name, "1-4", "0")
        
        var inStock = table.schema[7]["Na stanie"]

        // console.log("brkward", table.schema)
        this.gc(table.name, "1-3")
        if (this.gcv(table.name, "1-2") == "" || this.gcv(table.name, "1-2") == "0" || this.gcv(table.name, "1-2") == 0 ) {
            this.write(inStock - parseInt(this.gcv(table.name, "1-1")))
        } else {
            this.write(inStock + parseInt(this.gcv(table.name, "1-2")) - parseInt(this.gcv(table.name, "1-1")))
        }
        for (var i = 2; i<this.xBlocks; i++){
            this.gc(table.name,  i+"-3")
            var demand = parseInt(this.gcv(table.name, i+"-1"))
            var previousCellValue = parseInt(this.gcv(table.name, (i-1)+"-3"))
            
            if (this.gcv(table.name, i+"-2") !== "" && this.gcv(table.name, i+"-2") !== "0" && this.gcv(table.name, i+"-2") !== 0 ) {
                this.write(previousCellValue - demand + parseInt(this.gcv(table.name, i+"-2")))
            } else {
                this.write(previousCellValue - demand)
            }
            
        }
    }

    getProductionBatch(tableName) {
        var count = 0
        switch(tableName) {
            case "Filar": count = 4;
                break;
            case "Haczyk": count = 2;
                break;
            default: count = 1;
        }
        var table = this.tables[tableName]
        var data =  tableName == "GHP" ? table.schema[4] : table.schema[7]
        return data["Wielkość partii"] * count
    }

    
    updateProductionInTable(tableName, parentTableId){
        var table = this.tables[tableName]
        var count = 0
         switch(tableName) {
             case "Filar": count = 4;
                 break;
             case "Haczyk": count = 2;
                 break;
             default: count = 1;
         }

        this.updateAfter(table.name, "1-1", "0")
        var productionTime = this.getProductionTime(parentTableId)
        // if(tableName != "GHP")  this.planOrders(tableName)
        var productionDict = this.getProductionDict(productionTime, parentTableId)
        //  console.log("Produkcja "+ tableName +": ",productionDict)
         
        Object.entries(table.content)
            .filter(element => this.isItCellFromRow(element[0], 1))
            .map(element => {
                var elId = element[0]
                var elValue = element[1]
                var week = elId.split("-")[0]
                
                if(productionDict[week] !== undefined) {
                    elValue.value = productionDict[week] * count
                    elValue.inputField.value = productionDict[week] * count
                }
                // console.log(elId, "el:", elValue.value)
            })
    }

    planOrders(tableName){
        this.updateAfter(tableName, "1-5", "0")
        this.updateAfter(tableName, "1-6", "0")
        this.checkAfter2(tableName, "1-4","1", "5")
        
    }

    checkAfter2(tableName, id, demandRow, productionRow){
        // console.log("Filling production row for "+tableName)

        var week =  id.split("-")[0]
        for (var i = week; i<this.xBlocks; i++){
            this.gc(tableName, i+"-3")
            // console.log("----------------\nCurrentCell: "+ this.currentCell.id)
            // console.log("InStock: ",this.read())
            console.log("To compare cellId:", i+"-"+demandRow, "value: ", this.gcv(tableName, i+"-"+demandRow))
            var popytValue = this.gcv(tableName, i+"-"+demandRow)

            if(popytValue == 0){
                // console.log("nothing to do")
            }else{
                let subtracted = 0 
                if (popytValue > this.read()){
                    // console.log("GO TO PRODUCTION, popyt ABOVE AVAILABLE")
                    var inStock = this.read()
                    console.log("instock", inStock)
                    var productionWeek = i - this.getProductionTime(tableName)

                    // if (productionWeek < 1) this.cellOverflow = 1;
                    console.log("production week",productionWeek)
                    if (productionWeek < 1) {
                        // console.log("TAG PRODUCTION SHOULD NOT WORK!!!!!")
                        console.log("before prodweek<1",subtracted, popytValue, inStock)
                        
                        subtracted = inStock
                        console.log("after prodweek<1",subtracted)
                    } else {
                        this.gc(tableName, productionWeek+"-"+ productionRow)
                        this.tagProduction(this.currentCell.id, this.getProductionSize(tableName))
                        // console.log("currentCell: ", this.currentCell)
                        // console.log("read - popyt,", this.read(), popytValue)
                        console.log("before else",subtracted)
                        subtracted = this.getProductionSize(tableName) + inStock
                        console.log("after else",subtracted)
                    }
                    // console.log("sub", subtracted, this.getProductionSize(tableName))
                    this.gc(tableName,  i+"-3")
                    this.updateAfter(tableName, this.currentCell.id, subtracted)
                    
                }else{
                    // console.log(popytValue, this.read())
                    // console.log("NOT PRODUCED")
                    subtracted = this.read() - popytValue
                    // console.log(subtracted)
                    this.write(subtracted)
                    this.updateAfter(tableName, this.currentCell.id, subtracted)
                    this.gc(tableName, this.currentCell.id)
                }
            }
        }
    }

    getProductionDict(productionTime, tableId) {
        var table = this.tables[tableId]
        if (tableId == "GHP") { return this.getNotEmptyCellsFromRow(table, 2, productionTime)
        } else {return this.getNotEmptyCellsFromRow(table, 5, productionTime)}
    }

    getNotEmptyCellsFromRow(table, rowId, productionTime) {
        var productionDict = {}
        for(const [key, value] of Object.entries(table.content)) {
            if(this.isItCellFromRow(key, rowId) && !this.isItCellFromCol(key, 0) && parseInt(value.value) > 0){
                // console.log(productionTime)
                var properWeek = parseInt(key.split("-")[0]) - productionTime
                productionDict[properWeek] = value.value.toString()     
            } 
        }
        return productionDict
    }

    updateGHP(){
        this.GHP = [
            "Tydzień",
            "Przewidywany Popyt",
            "Produkcja",
            "Dostępne",
            {
                "Czas realizacji": this.czas_realizacji,
                "Na stanie":this.na_stanie
            }
        ]
    }

    isItCellFromRow(key, rowId) {
        return  key.split("-")[1] === rowId.toString()
    }

    isItCellFromCol(key, colId) {
        return key.split("-")[0] === colId.toString()
    }

    GHP = [
        "tydzień: ",
        "Przewidywany Popyt",
        "Produkcja",
        "Dostępne",
        {
            "Czas realizacji": this.czas_realizacji,
            "Na stanie":this.na_stanie
        }
    ]
    
    Podstawa = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 100,
            "Poziom BOM" : 1,
            "Na stanie" : 0
        }
    ]

    Gora = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 100,
            "Poziom BOM" : 1,
            "Na stanie" : 10
        }
    ]

    Filar = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 1,
            "Wielkość partii" : 400,
            "Poziom BOM" : 2,
            "Na stanie" : 10
        }
    ]

    Noga = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 1,
            "Wielkość partii" : 200,
            "Poziom BOM" : 2,
            "Na stanie" : 10
        }
    ]

    Podloga = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 150,
            "Poziom BOM" : 1,
            "Na stanie" : 10
        }
    ]

    Dach = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 150,
            "Poziom BOM" : 2,
            "Na stanie" : 0
        }
    ]

    Haczyk = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 1,
            "Wielkość partii" : 500,
            "Poziom BOM" : 2,
            "Na stanie" : 10
        }
    ]


    Default = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 100,
            "Poziom BOM" : 1,
            "Na stanie" : 10
        }
    ]
}

function addElement(parent, type){
    var element = document.createElement(type)
    parent.appendChild(element)
    return element
}
function addElementAfter(parent, type){
    var element = document.createElement(type)
    parent.append(element)
    return element
}