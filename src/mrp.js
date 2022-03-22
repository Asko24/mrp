class mrp{
    constructor(parent, schema, title="default", demand, na_stanie, czas_realizacji, wlk_partii){
        this.parent = parent
        this.schema = schema
        var parentElement = document.getElementById(parent)
        var xBlocks = 8
        var yBlocks = 4
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

        console.log("demand:", demand)
        console.log("na_stanie: " + na_stanie)
        console.log("czas_realizacji: " + czas_realizacji)
        console.log("wlk_partii: " + wlk_partii)
        
    }
    GHP = [
        "tydzień: ",
        "Przewidywany Popyt",
        "Produkcja",
        "Dostępne",
        {
            "Czas Realizacji":1,
            "Na Stanie":0
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