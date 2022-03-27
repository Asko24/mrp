class mrp{
    constructor(parent, schema, title="default", demand, na_stanie, czas_realizacji, wlk_partii){

        this.loopControl = 1 //This value controls the loop

        this.loopIterator = 0 //this value shows how many loop functions have happened

        this.rowOverflow = 0
        this.cellOverflow = 0

        this.parent = parent
        this.schema = schema
        this.demand = demand
        this.na_stanie = na_stanie
        this.czas_realizacji = czas_realizacji
        this.wlk_partii = wlk_partii
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
        contentBox.style.width = "1280px"
        //contentBox.style.height = "1000px"
        parentElement.appendChild(contentBox)
        this.testTable = new table(contentBox, xBlocks, yBlocks, "GHP", this.GHP)
        this.testTable2 = new table(contentBox, xBlocks, 6, "Podstawa", this.Podstawa)
        this.testTable3 = new table(contentBox, xBlocks, 6, "Góra", this.Gora)
        this.filar = new table(contentBox, xBlocks, 6, "Filar", this.Filar)
        this.noga = new table(contentBox, xBlocks, 6, "Noga", this.Noga)
        this.podloga = new table(contentBox, xBlocks, 6, "Podłoga", this.Podloga)
        this.dach = new table(contentBox, xBlocks, 6, "Dach", this.Dach)
        this.haczyk = new table(contentBox, xBlocks, 6, "Haczyk", this.Haczyk)

        console.log("demand:", demand)
        console.log("na_stanie: " + na_stanie)
        console.log("czas_realizacji: " + czas_realizacji)
        console.log("wlk_partii: " + wlk_partii)

        console.log(this.testTable.accessValue("0-0"))
        //this.testTable.writeValue("0-0", "LOL Xd")
        // this.testTable3.writeValue(this.testTable2.nextX("4-4"),"hello")
        // this.testTable2.writeValue("1-1", this.testTable2.nextX("6-0"))
        // this.testTable2.writeValue("1-2", this.testTable2.nextY("4-4"))
        // this.testTable2.writeValue("1-3", this.testTable2.prevX("4-4"))
        // this.testTable2.writeValue("1-4", this.testTable2.prevY("4-1"))
        // this.testTable3.writeValue(this.testTable2.nextX("5-5"),"hello2")
        this.currentCell = this.testTable.content["1-1"]
        // this.write("test0")
        // console.log(this.currentCell)
        // this.anc()
        // this.write("test1")
        // console.log(this.currentCell)
        
        // this.anr()
        // this.write("test2")
        // console.log(this.currentCell)
        
        // this.anr()
        // this.write("test3")
        // console.log(this.currentCell)
        
        // this.apc()
        // this.write("test4")
        // console.log(this.currentCell)
        
        // this.apr()
        // //this.anc()
        // this.write("test5")
        // console.log(this.currentCell)
        // console.log("LOLOLOL",this.cellOverflow)
        // this.apc()
        // this.write("test6")
        // console.log("OOOOOOO",this.cellOverflow)
        // console.log(this.currentCell)
        // this.apc()
        // this.write("test7")
        // console.log(this.currentCell)

        
        // this.gc("4-4")
        // this.write("test_4-4")
        // console.log(this.currentCell)
        
        this.loop()
    }

    loop(){
        // console.log("hmmm ", this.loopIterator)
        this.loopIterator += 1
        console.log("EEEEEEEEEEEE")
        //this.testTable.writeValue("0-0", "LOL Xd")
        console.log("TESTING VOVA:", this.demand)
        console.log(this.currentCell)
        this.updateAfter("1-1","0")
        this.updateAfter("1-2","")
        // this.updateAfter("1-1","")
        this.updateAfter("1-3",this.na_stanie)
        //this.updateAfter("4-3","50") ///<--- fajna sprawa
        for(var week in this.demand) {
            console.log("ASKO: ", (week) + "-1")
            console.log(week)
            //var temp = "1-" + (week-1)
            this.gc((week) + "-1")
            this.write(this.demand[week])
            //var el = document.getElementById("IP#"+(week) + "-1")
            //el.value = this.demand[week]
            // this.testTable.content[(week) + "-1"]
            //this.currentCell = this.testTable.content[(week) + "-1"]
            //this.write(this.demand[week])
            //console.log("OOOOOOOOOO",this.currentCell)
            //this.currentCell.content.inputField.innerHTML = this.demand[week]
            // this.testTable.writeValue((week) + "-1", this.demand[week])
            
        }
        //this.gc("1-1")
        this.checkAfter("1-3","1")

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
    gc(id){
        //console.log("HMM",parent)
        this.currentCell = this.currentCell.parent.content[id]
    } //Get Cell
    gcv(id){
        //console.log("get cell value :", id, this.currentCell.parent.content[id], this.currentCell.parent.content[id].value)
        return this.currentCell.parent.content[id].value
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
    updateAfter(id, value){
        this.gc(id)
        
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
    checkAfter(id,rowToCompare){
        this.gc(id)
        
        console.log(this.currentCell)
        // if (this.getProductionTime() == "1"){
        //     console.log("simple production")

        // }
        for (var i = id.split("-")[0]; i<this.xBlocks; i++){
            // this.write(value)
            console.log("superReader",this.read())
            console.log("your I", i)
            console.log(this.gcv(i+"-"+rowToCompare))
            var demandValue = this.gcv(i+"-"+rowToCompare)
            if(demandValue == 0){
                console.log("nothing to do")
            }else{
                //var number = parseInt(this.read())
                //console.log(demandValue > number)
                if (demandValue > this.read()){
                    console.log("GO TO PRODUCTION, DEMAND ABOVE AVAILABLE")
                    var currentID = this.currentCell.id
                    var inStock = this.read()
                    this.apr()
                    this.tagProduction(this.currentCell.id)
                    //console.log("id tego typa", this.currentCell.id)
                    //console.log("read - demand,", this.read(), demandValue)
                    var subtracted = inStock - demandValue
                    var productionIterations = 0
                    while (productionIterations * this.getProductionSize() +subtracted < 0){
                        productionIterations++
                    }
                    //this.updateProduction(this.currentCell.id)
                    console.log("sub", subtracted)
                    this.updateAfter(currentID, productionIterations * this.getProductionSize() +subtracted)
                    console.log("need to produce " + this.currentCell.parent.title.innerText + " " + productionIterations + " times")
                    this.productionListAmount.push(productionIterations)
                    console.log(this.productionListAmount)
                    this.gc(currentID)
                    

                }else{

                    console.log(demandValue, this.read())
                    console.log("NOT PRODUCED")
                    var subtracted = this.read() - demandValue
                    var currentID = this.currentCell.id
                    console.log(subtracted)
                    this.write(subtracted)
                    this.updateAfter(currentID, subtracted)
                    this.gc(currentID)
                }
            }
            

            
            if(i < this.xBlocks-1){
                console.log("what happened here", i)
                this.anc()
            }
        }
        for (var o = this.productionListCells.length - 1; o>=0 ; o-- ){
            console.log("Produkcja",o, this.productionListCells[o], this.productionListAmount[o])
            this.slotProduction(this.productionListCells[o],this.productionListAmount[o])
        }
    }
    updateProduction(id){
        this.gc(id)
        //production will be always available if we go from left, but we should check forward if there's not anything in range
        // create a list of anything in range of our production time (and of it's production time, and go from the latest element from the list) also check along the way

        //?? ok different approach, we do first run where we just tag where production is going to be needed for sure then we go by that onto second run where we decide production
        // <><><><><>
        console.log(this.getProductionSize())


    }
    getMaxWeek() {
        var max = 0;
        for(var week in this.demand) {
            if(parseInt(week) > max) {
                max = parseInt(week);
            }
        }
        return max
    }
    getProductionSize(){
        return  this.currentCell.parent.schema[4]["Wielkość partii"]
    }
    getProductionTime(){
        return  this.currentCell.parent.schema[4]["Czas Realizacji"]
    }
    tagProduction(id){
        this.productionListCells.push(id)
        console.log(this.productionListCells)
    }
    slotProduction(id, iterations){
        this.gc(id)
        var productionSize = this.getProductionTime()
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
        var productionSize = this.getProductionTime()
        if(this.currentCell.value == ""){
            for(var i = 0; i < productionSize ; i++){
                console.log("ASKO2",productionSize)
                this.write("X")
                if(!(productionSize-1 == i)){
                    this.apc()
                }
                
                // console.log(i,"verifying production possible on cell: ", this.currentCell.id)
                // console.log("nothing:",this.currentCell.value)
    
            }
            this.write("S")
        }else if(this.currentCell.value == "X" || this.currentCell.value == "S"){
            if(this.cellOverflow){
                this.write("Produkcja poza zakresem czasowym")
            }else{
                this.apc()
                this.checkProduction()
            }
            
            console.log("SXka")
            
            //console.log("iterations: ", iterations)
            //this.slotProduction(this.currentCell.id,iterations - 1)
            
        }
        console.log("OVERFLOW",this.cellOverflow)
        if(this.cellOverflow){
            console.log("Produkcja nie mieści się w zakresie dostępnego okresu czasowego")
            //alert("Produkcja nie mieści się w zakresie dostępnego okresu czasowego")
        }
        

    }
    updateGHP(){
        this.GHP = [
            "tydzień: ",
            "Przewidywany Popyt",
            "Produkcja",
            "Dostępne",
            {
                "Czas Realizacji": this.czas_realizacji,
                "Wielkość partii" : this.wlk_partii,
                "Na Stanie":this.na_stanie
            }
        ]
    }

    GHP = [
        "tydzień: ",
        "Przewidywany Popyt",
        "Produkcja",
        "Dostępne",
        {
            "Czas Realizacji": this.czas_realizacji,
            "Wielkość partii" : this.wlk_partii,
            "Na Stanie":this.na_stanie
        }
    ]
    
    Podstawa = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
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

    Filar = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
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

    Noga = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
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

    Podloga = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
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

    Dach = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
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

    Haczyk = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
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


    Default = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
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

}