//registro del service worked
if(navigator.serviceWorker){//esta disponible trabjar con service worked en este navegador ?    
    navigator.serviceWorker.register("/sw.js");

}



//ESCUCHANDO CUANDO SE CARGA LA PAGINA 
window.mostrarPersonaje = function(){
    //tomar todos los datos del personaje y renderizarlos dentro de un clon del molde
    //1.-crear molde
    let molde = document.querySelector('.molde-personaje-sa').cloneNode(true);
    let personaje = this.personaje;
    molde.querySelector('.nombre-per').innerText = personaje.name;
    molde.querySelector('.nickname-per').innerText = personaje.nickname;
    molde.querySelector('.ocupacion-per').innerText = personaje.occupation;

    const icono = molde.querySelector('.icono-estado');
    if(personaje.status == "Deceased"){
        icono.classList.add("fas","fa-skull-crossbones","text-danger");
    }else if (personaje.status == "Alive"){
        icono.classList.add("far","fa-thumbs-up", "text-primary");
    }else if (personaje.status== "unknown"){  
        icono.classList.add("fas","quefa-questionstion","text-success");
    }


    molde.querySelector('.imagen-per').src = personaje.img;

 //   {   }

    Swal.fire({
        title: personaje.name,
        html: molde.innerHTML
    });

};
window.mostrar =(personajes)=>{
    
    const molde = document.querySelector(".molde-personaje")
    const contenedor = document.querySelector(".contenedor")
    
    for(let i=0; i < personajes.length; ++i){
        let p = personajes[i];
        let copia = molde.cloneNode(true);     // devuelve-clona los de el y todos sus hijos con el true 
        copia.querySelector('.nombre-titulo').innerText = p.name;
        copia.querySelector('.imagen-personaje').src = p.img;
        copia.querySelector('.btn-personaje').personaje = p;
        copia.querySelector('.btn-personaje').addEventListener('click', window.mostrarPersonaje);
        contenedor.appendChild(copia);
    }
}


//escuchando cuando se carga la pagina 
window.addEventListener('DOMContentLoaded', async  ()=>{
    //retornar una promesa

    let respuesta= await axios.get("https://www.breakingbadapi.com/api/characters");
    let personajes = respuesta.data;  //consola-data-result esto depende de la API, los objetos
    window.mostrar(personajes);
    //console.log(personajes);
    //todo: renderizar la lista de personajes  en la pagina.
}) 

