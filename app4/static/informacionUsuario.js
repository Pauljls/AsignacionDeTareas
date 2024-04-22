function cargarInformacionTarea(idTarea)
{
    console.log("Se cargara la informacion de la tarea %s",idTarea)
    fetch(`/conseguirInfoTarea?idTarea=${idTarea}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.comentariosTotales)
        nombreTareaDetalle = document.getElementById('nombreTareaDetalle')
        fechaInicioDetalle = document.getElementById('fechaInicioDetalle')
        fechaFinDetalle = document.getElementById('fechaFinDetalle')
        estadoTareaDetalle = document.getElementById('estadoTareaDetalle')
        descripcionTareaDetalle = document.getElementById('descripcionTareaDetalle')
        indTarea = document.getElementById('indTarea')
        comentariosTareaTotales = document.getElementById('comentariosTareaTotales')

        nombreTareaDetalle.value = ''
        fechaInicioDetalle.value = ''
        fechaFinDetalle.value = ''
        estadoTareaDetalle.value = ''
        descripcionTareaDetalle.value = ''
        indTarea.innerHTML = ''
        comentariosTareaTotales.innerHTML = ''
        
        nombreTareaDetalle.value = data.nombreTarea
        fechaInicioDetalle.value = data.fechaInicio
        fechaFinDetalle.value = data.fechaFin
        estadoTareaDetalle.value = data.estadoTarea
        descripcionTareaDetalle.value = data.descripcionTarea
        indTarea.innerHTML = data.idTarea

        for(let j = 0; j < data.comentariosTotales.length; j++)
        {
            seccionComentario = `
            <div class="row mb-3">
                <div class="col-3">
                    ${data.comentariosTotales[j][0]}
                </div>
                <div class="col-9">
                    ${data.comentariosTotales[j][1]}
                </div>
            </div>
            `
            comentariosTareaTotales.innerHTML = comentariosTareaTotales.innerHTML + seccionComentario
        }

    })
}

function enviarComentario()
{
    url = '/publicarComentario'
    datos = {
        'comentario':document.getElementById('comentarioUsuario').value,
        'idTarea':document.getElementById('indTarea').innerHTML
    }
    fetch(url,
    {
        method:"POST",
        headers:
        {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body:JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        cargarInformacionTarea(document.getElementById('indTarea').innerHTML)
        document.getElementById('comentarioUsuario').value = ''
    })
}


function getCookie(name)
{
    let cookieValue = null;
    if (document.cookie && document.cookie !== "")
    {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++)
        {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "="))
            {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function cargarInformacionUsuario(idUsuario) {
    fetch(`/obtenerDatosUsuario?idUsuario=${idUsuario}`)
    .then(response => response.json())
    .then(data => {
        username =document.getElementById("usernameUsuario")
        userNombre =document.getElementById("nombreUsuario")
        userApellido =document.getElementById("apellidoUsuario")
        userProfesion =document.getElementById("profesionUsuario")
        userEmail =document.getElementById("emailUsuario")
        userCelular =document.getElementById("nroCelular")

        username.value=''
        userNombre.value=''
        userApellido.value=''
        userProfesion.value=''
        userEmail.value=''
        userCelular.value=''

        username.value=data.username
        userNombre.value=data.nombre
        userApellido.value=data.apellido
        userProfesion.value=data.profesion
        userEmail.value=data.email
        userCelular.value=data.nroCelular
    });
}

window.onload = async () => {
    const form = document.getElementById('form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const datos =JSON.stringify(data)
        console.log(datos)
        try {
            await fetch('/actualizarUsuario', {
                method: 'PUT', // Cambiado de UPDATE a PUT
                headers: {
                    'Content-Type': 'application/json', // Agregado el Content-Type
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: datos,
            });
        } catch (err) {
            console.log('Algo salió mal', err);
        }
    };
};

function  eliminar (id){
    const nodo = document.getElementById(`${id}`)
    console.log(nodo)

    nodo.parentElement.parentElement.remove()

    fetch('/eliminarUsuario',{
        method : 'DELETE',
        headers : {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body : JSON.stringify({ id : id})
    })
    .then( ()=>{
        console.log('Elemento eliminado')
    })
    .catch(err => console.log(`Ocurrio un error: 
    ${err}`))
};


