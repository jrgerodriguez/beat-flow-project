document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector(".modal");
    const modalContent = document.querySelector(".modal-contenido");
    const btnesEliminar = document.querySelectorAll(".btnEliminar");
    const btnCancelar = document.querySelector(".btnCancelar");
    const eventoAEliminar = document.querySelector(".nombre-evento-eliminar")
    const btnConfirmarEliminar = document.querySelector("#confirmarEliminar")

    urlEliminar = "" //Aqui se guarda la url para eliminar evento y asi evitar que se muestre a los usuarios

btnesEliminar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            e.preventDefault()
            modal.classList.remove("hidden")

            const contenedor = boton.closest(".evento-list-element__contenido") //Tomo el contendor mas cercano
            const nombreEvento = contenedor.querySelector(".eventoNombre").getAttribute("data-nombre"); //Luego tomo el atributo que tiene el nombre dentro de ese contendor mas cercano

            eventoAEliminar.textContent = nombreEvento;

            const eventoId = boton.getAttribute("evento-id");
            const usuarioId = boton.getAttribute("usuario-id");
            
            urlEliminar = `/evento/eliminar-evento?user=${usuarioId}&event=${eventoId}`
        });        
    });

    btnConfirmarEliminar.addEventListener("click", (e) => {
        e.preventDefault()
        if (urlEliminar) {
            window.location.href = urlEliminar;
        }
    })

    btnCancelar.addEventListener("click", (e) => {
        e.preventDefault()
        modal.classList.add("hidden")
    })

    modal.addEventListener("click", (e) => {
        if (modalContent.contains(e.target) === false) { //Si el clic ocurrió fuera del contenido del modal, entonces cierra el modal. 
            modal.classList.add("hidden")
        }
    })
})

