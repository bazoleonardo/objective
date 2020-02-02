let personagens = [];
let media = [];
let listaMedia = [];

var step = 0;
let baseApi = `https://kitsu.io/api/edge/characters`;

const table = document.getElementById("table");
var tbody;
var detalhes = document.getElementById("detalhes");
var ul = document.getElementById("lista-item");
let fadeLista = document.getElementById('fadeLista');
let cntModalLista = document.getElementById('ctnModalLista');
let close = document.getElementById('close');
let clickbutton = document.getElementsByClassName("page-link");
var inputFilter = document.getElementById("nomper");
var text = '';
inputFilter.addEventListener('keypress', (event) => {
    const keyName = event.key;
    if (event.key == "Enter" || event.key == "Tab") {
        text = event.target.value;
        if (text.length >= 3) {
            getDataFilter(event.target.value);
            fade.style.display = "flex";
            spinner.removeAttribute("hidden");
        } else {
            alert('Minimo 3 caracteres para fazer a pesqsuisa!!!');
        }
    }
    
});
inputFilter.addEventListener('change', (event) => {
    if(event.target.value == null || event.target.value == ""){
        request(`${baseApi}`);
        fade.style.display = "flex";
        spinner.removeAttribute("hidden");
    }
});

fadeLista.onclick = function () { fadeLista.style.display = "none" };
cntModalLista.onclick = function (event) { event.stopPropagation() };
close.onclick = function () { fadeLista.style.display = "none" }

const request = async url => {
    const response = await fetch(`${url}`);
    const json = await response.json();
    personagens = await json;
    tbody.remove();
    montaTbody();
    spinner.setAttribute("hidden", "");
    fade.style.display = "none";

};
request(`${baseApi}`);

function getDataPaginado(step) {
    if (text.length > 1) {
        request(`${baseApi}?filter%5Bname%5D=${h}&page%5Blimit%5D=10&page%5Boffset%5Dpage%5Blimit%5D=10&page%5Boffset%5D=${step}`);
    } else {
        request(`${baseApi}?page%5Blimit%5D=10&page%5Boffset%5D=${step}`);
    }
    
}

async function getByid(id) {

    ul = document.createElement("ul");

    ul.setAttribute("id", "lista-item");
    detalhes.appendChild(ul);
    spinner.removeAttribute("hidden");
    await fetch(`${baseApi}/${id}`)
        .then(resposta => resposta.json())
        .then(async data => {
            console.log(data);
            var b = data.data.relationships.mediaCharacters.links.related;
            const rep = await fetch(`${b}`);
            const rjson = await rep.json();

            media = rjson;
            for (i in media.data) {
                var c = media.data[i].relationships.media.links.related;
                const a = await fetch(`${c}`);
                const arsj = await a.json();
                listaMedia = arsj;


                for (ii in listaMedia) {


                    ul.innerHTML += `
                    
                    <li class="dev-item" id="${listaMedia[ii].id}"> 
                        <header>
                        <div className="user-info">
                            <strong>Título</strong>: <br/>${listaMedia[ii].attributes.titles.en_jp}<br/>
                        </div>
                        <img src=${listaMedia[ii].attributes.posterImage.original} alt={dev.name}/>
                        
                        </header>
                        <p><strong>Tipo: ${listaMedia[ii].type.toUpperCase()}</strong></p>
                        <p><strong>Sinopse</strong>: <br/>${listaMedia[ii].attributes.synopsis}</p>
                        
                    </li>`;
                    console.warn(listaMedia[ii]);

                }
            }

        });
    spinner.setAttribute("hidden", "");
    fade.style.display = "none";
    fadeLista.style.display = "flex";
}
function getDataFilter(value) {
    request(`${baseApi}?filter[name]=${value}`);
}

function createTbody() {
    tbody = document.createElement("tbody");
    tbody.classList.add("table_body");
    table.appendChild(tbody);
}
createTbody();


function montaTbody() {
    createTbody();
    //in percorre a chave do objeto // of
    for (i in personagens.data) {
        var row = tbody.insertRow();
        console.log(personagens.data[i].attributes.image !== null);
        var imagem = personagens.data[i].attributes.image !== null ? personagens.data[i].attributes.image.original : "../vendors/img/imgnoimage.png";
        row.setAttribute("id", `${personagens.data[i].id}`);
        row.innerHTML += `<td class="widthcel1">
                <div style="display:flex; overflow:hidden" >
                <div style="margin-top:20px"><img src="${imagem}" class="mr-2" width="58px" height="58px"></div>
                <div style="margin-top: 40px"><span>${personagens.data[i].attributes.name}</span></div>
                </div>
            </td>
            <td class="widthcel2">
                <div>${personagens.data[i].attributes.description}</div>
            </td>`;
    }
    document.querySelectorAll("#table tr").forEach(e =>
        e.addEventListener("click", function () {
            fade.style.display = "flex";
            ul.remove();
            getByid(e.id);
        })
    );

    montaPaginacao()
}
const pagination = document
    .getElementById("pagination")
    .getElementsByTagName("ul")[0];

const spinner = document.getElementById("spinner");

var countpage;
var page = 0;
var h;
function montaPaginacao() {
    page = 0;
    pagination.innerHTML = "";

    for (i in personagens.links) {

        var url = new URL(personagens.links[i]);
        
        var e = url.search.split("&");
        var c = url.search.split("offset%5D=");
        var f = e[0];
        var g = f.split("=");
        h = g[1];

        console.log(h);
        c.map(map => {
            step = map;
        });
        if (i == 'first') {
            pagination.innerHTML += ` 
            
            <a onclick="getDataPaginado(${step})" class="page-link"> << </a>
            <a onclick="" class="page-link prev"> < </a>
                                    
            `
        }
        if (i == 'last') {
            pagination.innerHTML += ` 
            <a onclick="getDataPaginado(${step})" class="page-link next"> > </a>                        
            <a onclick="getDataPaginado(${step})" class="page-link"> >> </a>
            `

        }
        if (i == 'next') {
            for (p = 1; p < personagens.meta.count; p++) {
                if (p <= 6) {
                    pagination.innerHTML += '<div>'
                    pagination.innerHTML += ` 
            
                        <a onclick="getDataPaginado(${page})" class="page-link"> ${p} </a>
            `
                    pagination.innerHTML += '</div>'
                }
                page += 10;
            }

        }
    }
}

