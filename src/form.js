class form {
    constructor(create=true){
        if(create == true) {
            this.title = "form"
            var parentElement = document.getElementById("main")
            var contentBox = document.createElement('div')
            contentBox.id = this.title + ".contentBox"
            contentBox.classList.add("contentBox")
            contentBox.style.width = "1280px"

            contentBox.innerHTML = 
            `<form action="" method="get" id="mrp">
                <h2 style="text-align:center;">Przewidywany popyt</h2>
                <table id="popyt" class="formTable center">
                </table>
                <h2 style="text-align:center;">Dane produkcyjne</h2>
                <table class="formTable center">
                    <tr>
                        <td><label for="GHP.na_stanie">Na stanie: </label></td>
                        <td><input type="number" id="GHP.na_stanie" name="GHP.na_stanie" value="0"></td>
                    </tr>
                    <tr>
                        <td><label for="GHP.czas_realizacji">Czas realizacji: </label></td>
                        <td><input type="number" id="GHP.czas_realizacji" name="GHP.czas_realizacji" value="0"></td>
                    </tr>
                    <tr>
                        <td><label for="GHP.wlk_partii">Wielkość partii: </label></td>
                        <td><input type="number" id="GHP.wlk_partii" name="GHP.wlk_partii" value="0"></td>
                    </tr>      
                </table>
                <button type="submit">Pokaż tabele</button>
            </form>`;

            parentElement.appendChild(contentBox)

            this.popytId = 0;
            this.firstChanged = false;
            this.addTableRow()
        }
    }

    addTableRow(){
        this.popytId ++
        this.firstChanged = false
        var table = document.getElementById("popyt")
        var tr = document.createElement('tr')
        tr.innerHTML =
        `<td><label for="GHP.nr_tyg_`+this.popytId+`">Nr tygodnia: </label></td>
         <td><input type="number" id="GHP.nr_tyg_`+this.popytId+`" name="GHP.nr_tyg_1" value="0"></td>
         <td><label for="GHP.ilosc_karmnikow_`+this.popytId+`">Ilość karmników: </label></td>
         <td><input type="number" id="GHP.ilosc_karmnikow_`+this.popytId+`" name="GHP.ilosc_karmnikow_`+this.popytId+`" value="0"></td>`
        table.appendChild(tr)
        document.getElementById("GHP.nr_tyg_"+ this.popytId).addEventListener("change", () => {
            this.firstChanged = true
        });
        document.getElementById("GHP.ilosc_karmnikow_"+ this.popytId).addEventListener("change", () => {
            if(this.firstChanged == true) this.addTableRow();
        });
    }       
}