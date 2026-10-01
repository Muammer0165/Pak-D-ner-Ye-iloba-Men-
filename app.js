let players = [];

let selectedOVR = "";

let searchText = "";

let selectedPosition = "";

let sortType = "ovr";


/* JSON DOSYASINI OKU */

fetch("players.json")

    .then(response => response.json())

    .then(data => {

        players = data;

        render();

    })

    .catch(error => {

        console.error(error);

        document.getElementById("players").innerHTML =
            "<p style='padding:30px'>players.json yüklenemedi.</p>";

    });


/* OYUNCULARI GÖSTER */

function render() {

    let filtered = players.filter(player => {


        /* OVR */

        if (
            selectedOVR &&
            Number(player.ovr) !== Number(selectedOVR)
        ) {

            return false;

        }


        /* POZİSYON */

        if (
            selectedPosition &&
            player.position !== selectedPosition
        ) {

            return false;

        }


        /* ARAMA */

        if (searchText) {

            let name =
                player.name.toLocaleLowerCase("tr-TR");

            if (
                !name.includes(
                    searchText.toLocaleLowerCase("tr-TR")
                )
            ) {

                return false;

            }

        }


        return true;

    });


    /* SIRALAMA */

    filtered.sort((a,b) => {

        if (sortType === "name") {

            return a.name.localeCompare(
                b.name,
                "tr"
            );

        }


        return (
            Number(b[sortType] || 0) -
            Number(a[sortType] || 0)
        );

    });


    /* SAYI */

    document.getElementById(
        "playerCount"
    ).textContent =
        filtered.length.toLocaleString("tr-TR");


    /* HTML */

    let html = "";


    filtered.forEach(player => {

        html += createPlayer(player);

    });


    document.getElementById(
        "players"
    ).innerHTML = html;


    document.getElementById(
        "empty"
    ).style.display =
        filtered.length === 0
            ? "block"
            : "none";

}


/* OYUNCU KARTI */

function createPlayer(player) {

    let card;


    if (player.image) {

        card = `
            <img
                src="${player.image}"
                alt="${player.name}"
                onerror="this.style.display='none'"
            >
        `;

    } else {

        card = `

            <div class="card-placeholder">

                <strong>
                    ${player.ovr}
                </strong>

                <span>
                    ${player.position}
                </span>

            </div>

        `;

    }


    return `

        <article class="player">


            <div class="player-info">

                <div class="card">

                    ${card}

                </div>


                <div>

                    <div class="player-name">

                        ${player.name}

                    </div>


                    <div class="player-position">

                        ${player.ovr}
                        OVR
                        •
                        ${player.position}

                    </div>

                </div>

            </div>


            <div class="ovr-number">

                ${player.ovr}

            </div>


            ${stat(player.pac, "HIZ")}

            ${stat(player.sho, "ŞUT")}

            ${stat(player.pas, "PAS")}

            ${stat(player.dri, "DRİ")}

            ${stat(player.def, "DEF")}

            ${stat(player.phy, "FİZ")}


        </article>

    `;

}


/* STAT */

function stat(value, name) {

    return `

        <div class="stat">

            <strong>

                ${value}

            </strong>

            <span>

                ${name}

            </span>

        </div>

    `;

}


/* ARAMA */

document
    .getElementById("search")
    .addEventListener("input", function() {

        searchText = this.value;

        render();

    });


/* POZİSYON */

document
    .getElementById("position")
    .addEventListener("change", function() {

        selectedPosition = this.value;

        render();

    });


/* SIRALAMA */

document
    .getElementById("sort")
    .addEventListener("change", function() {

        sortType = this.value;

        render();

    });


/* OVR BUTONLARI */

document
    .querySelectorAll("[data-ovr]")
    .forEach(button => {

        button.addEventListener("click", function() {


            document
                .querySelectorAll("[data-ovr]")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            this.classList.add("active");


            selectedOVR =
                this.dataset.ovr;


            render();

        });

    });
