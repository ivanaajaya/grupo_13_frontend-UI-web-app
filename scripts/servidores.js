window.addEventListener("load", function () {
  getServidoresUsuario();
});

function getServidoresUsuario() {
  const url = "http://127.0.0.1:5000/servidoresiduser"; // URL para obtener los servidores del usuario

  // Obtener el contenedor de la lista de servidores
  const containerListaServidores = document.getElementById(
    "container_lista_servidores"
  );

  // Limpiar el contenido anterior de la lista de servidores
  while (containerListaServidores.firstChild) {
    containerListaServidores.removeChild(containerListaServidores.firstChild);
  }

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          // data es un arreglo, puedes iterar sobre él para mostrar cada servidor
          const TituloElement = document.createElement("div");
          TituloElement.innerHTML = `
          <h1>Servidores en los que pertenece</h1>
        `;
          containerListaServidores.appendChild(TituloElement);
          for (let i = 0; i < data.length; i++) {
            const servidor = data[i];
            const servidorElement = document.createElement("li");
            servidorElement.innerHTML = `
              <header>
                <div>
                  <h3>Nombre: ${servidor.nombre_servidor}</h3>
                  <p>id_servidor: ${servidor.id_servidor}</p>
                  <p>descripcion: ${servidor.descripcion}</p>
                  <p>cantidad de usuario: ${servidor.cantUser}</p>
                  <div>
                  <button class="crear-canal">Añadir un Canal</button>
                  </div>
                  <div>
                    <button class="ver-canal">Mostrar Canal</button>
                  </div>
                  <div id="message"></div>
                </div>
              </header>
            `;

            const btn_crear = servidorElement.querySelector(".crear-canal");
            btn_crear.addEventListener("click", () => {
              crearCanal(servidor.id_servidor);
            });
            const btn_ver = servidorElement.querySelector(".ver-canal");
            btn_ver.addEventListener("click", () => {
              mostrarCanales(servidor.id_servidor);
            });
            // const btn_delete = servidorElement.querySelector(".btn_borrar");
            // btn_delete.addEventListener("click", () => {
            //   eliminarServidor(servidor.id_servidor);
            // });

            containerListaServidores.appendChild(servidorElement);
          }
        });
      } else {
        return response.json().then((data) => {
          document.getElementById("message").innerHTML = data.message;
        });
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "Ocurrio un Error";
    });
}

function mostrarCanales(servidor_id) {
  console.log("paso por mostrarCanales")
  const url = `http://127.0.0.1:5000/canales/servidor/${servidor_id}`;

  // Obtener el contenedor de la lista de canales
  const containerListaCanales = document.getElementById("container_lista_canales");

  // Limpiar el contenido anterior de la lista de canales
  while (containerListaCanales.firstChild) {
    containerListaCanales.removeChild(containerListaCanales.firstChild);
  }

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          // data es un arreglo de canales, puedes iterar sobre él para mostrar cada canal
          const TituloElement = document.createElement("div");
          TituloElement.innerHTML = `<h2>Canales del servidor</h2>`;

          containerListaCanales.appendChild(TituloElement);

          for (let i = 0; i < data.length; i++) {
            const canal = data[i];
            const canalElement = document.createElement("li");
            canalElement.innerHTML = `
              <header>
                <div>
                  <h3>Nombre del canal: ${canal.nombre_canal}</h3>
                  <p>id_canal: ${canal.id_canal}</p>
                  <p>id_servidor: ${canal.id_servidor}</p>
                  <p>fecha_creacion: ${canal.fecha_creacion}</p>
                  <div">
                    <button class="ver-mensajes">Ver chat</button>
                  </div>
                  
                </div>
                <div id="message"></div>
              </header>
            `;
            const btn_mensajes = canalElement.querySelector(".ver-mensajes");
            btn_mensajes.addEventListener("click", () => {
              mostrarMensajes(canal.id_canal);
            });
            containerListaCanales.appendChild(canalElement);

          }
        });
      } else {
        return response.json().then((data) => {
          document.getElementById("message").innerHTML = data.message;
        });
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "Ocurrió un Error al obtener los canales.";
    });
}

function mostrarMensajes(canal_id) {
  const url = `http://127.0.0.1:5000/mensajes/canalcanal/${canal_id}`;

  // Obtener el contenedor de la lista de mensajes
  const containerListaMensajes = document.getElementById("container_lista_mensajes");

  // Limpiar el contenido anterior de la lista de mensajes
  while (containerListaMensajes.firstChild) {
    containerListaMensajes.removeChild(containerListaMensajes.firstChild);
  }

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          // data es un arreglo de mensajes, puedes iterar sobre él para mostrar cada mensaje
          const TituloElement = document.createElement("div");
          TituloElement.innerHTML = `<h2>Mensajes del canal</h2>`;

          containerListaMensajes.appendChild(TituloElement);

          for (let i = 0; i < data.length; i++) {
            const mensaje = data[i];
            const mensajeElement = document.createElement("li");
            mensajeElement.innerHTML = `
              <div>
                <p>Contenido del mensaje: ${mensaje.id_mensaje}</p>
                <p>Fecha de envío: ${mensaje.contenido}</p>
                <p>Usuario: ${mensaje.fecha_mensaje}</p>
                <p>id canal: ${mensaje.id_usuario}</p>
                <p>id Usuario: ${mensaje.id_canal}</p>
                <div">
                    <button class="enviar-mensaje">Enviar mensaje</button>
                </div>
              </div>
              <div id="message"></div>
            `;
            const btn_mensajes = mensajeElement.querySelector(".enviar-mensaje");
            btn_mensajes.addEventListener("click", () => {
              enviarMensajes(mensaje.id_canal, mensaje.id_usuario);
            });

            containerListaMensajes.appendChild(mensajeElement);
          }
        });
      } else {
        return response.json().then((data) => {
          document.getElementById("message").innerHTML = data.message;
        });
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "Ocurrió un Error al obtener los mensajes.";
    });
}

function enviarMensajes(id_usuario, id_canal) {
  console.log("isusuario", id_usuario)
  console.log("canal", id_canal)
  const mensaje = prompt("Ingrese el mensaje:");
  console.log("mensaje", mensaje)
  if (mensaje) {
    const url = "http://127.0.0.1:5000/mensajes";
  
    // Datos a enviar en el cuerpo de la solicitud POST
    const data = {
      contenido: mensaje,
      id_usuario: id_usuario,
      id_canal:id_canal,
    };
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indicar que se está enviando JSON en el cuerpo
      },
      credentials: "include",
      body: JSON.stringify(data), // Convertir el objeto a JSON
    })
      .then((response) => {
        if (response.status === 201) {
          // El Mensaje se creó exitosamente
          // Puedes realizar acciones adicionales aquí si es necesario
          console.log("Mensaje creado con éxito.");
          // Actualiza la lista de servidores
          mostrarMensajes();
        } else {
          return response.json().then((data) => {
            // Mostrar un mensaje de error en caso de que falle la creación del canal
            document.getElementById("message").innerHTML = data.message;
          });
        }
      })
      .catch((error) => {
        document.getElementById("message").innerHTML = "Ocurrió un error al crear el canal.";
      });
  } else {
    // El usuario canceló la entrada o no proporcionó un nombre de canal
    console.log("El usuario canceló la creación del canal.");
  }
}


function crearCanal(id_servidor) {

  const nombre_canal = prompt("Ingrese el nombre del canal:");
  if (nombre_canal) {
    const url = "http://127.0.0.1:5000/canales";
  
    // Datos a enviar en el cuerpo de la solicitud POST
    const data = {
      nombre_canal: nombre_canal,
      servidor_id: id_servidor,
    };
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indicar que se está enviando JSON en el cuerpo
      },
      credentials: "include",
      body: JSON.stringify(data), // Convertir el objeto a JSON
    })
      .then((response) => {
        if (response.status === 201) {
          // El canal se creó exitosamente
          // Puedes realizar acciones adicionales aquí si es necesario
          console.log("Canal creado con éxito.");
          
          // Actualiza la lista de servidores
          mostrarCanales();
        } else {
          return response.json().then((data) => {
            // Mostrar un mensaje de error en caso de que falle la creación del canal
            document.getElementById("message").innerHTML = data.message;
          });
        }
      })
      .catch((error) => {
        document.getElementById("message").innerHTML = "Ocurrió un error al crear el canal.";
      });
  } else {
    // El usuario canceló la entrada o no proporcionó un nombre de canal
    console.log("El usuario canceló la creación del canal.");
  }
}


// Agrega un escuchador de eventos al botón "Explorar"
document.getElementById("explorar-all").addEventListener("click", function () {
  getservidor();
});

function getservidor() {
  const url = "http://127.0.0.1:5000/servidores";

  // Obtener el contenedor de la lista de servidores
  const containerListaServidores = document.getElementById(
    "container_lista_servidores"
  );

  // Limpiar el contenido anterior de la lista de servidores
  while (containerListaServidores.firstChild) {
    containerListaServidores.removeChild(containerListaServidores.firstChild);
  }

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          // data es un arreglo, puedes iterar sobre él para mostrar cada servidor
          for (let i = 0; i < data.length; i++) {
            const servidor = data[i];
            const servidorElement = document.createElement("li");
            servidorElement.innerHTML = `
                        <header>
                          <div>
                            <h3>Nombre: ${servidor.nombre_servidor}</h3>
                            <p>id_servidor: ${servidor.id_servidor}</p>
                            <p>descripcion: ${servidor.descripcion}</p>
                            <p>cantidad de usuario: ${servidor.cantUser}</p>
                            <button class="unirse">Unirme</button>
                            
                            <div id="message"></div>
                          </div>
                        </header>
                        `;
            //<button class="btn_borrar">Delete</button> 
            //const btn_delete = servidorElement.querySelector(".btn_borrar");
            // btn_delete.addEventListener("click", () => {
            //   eliminarServidor(servidor.id_servidor);
            // });

            const unirse = servidorElement.querySelector(".unirse");
            unirse.addEventListener("click", () => {
              unirseAServidor(servidor.id_servidor);
            });

            containerListaServidores.appendChild(servidorElement);
          }
        });
      } else {
        return response.json().then((data) => {
          document.getElementById("message").innerHTML = data.message;
        });
      }
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = "An error occurred.";
    });
}
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-modal");
  const openModalButton = document.getElementById("open-modal");

  openModalButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Agrega un evento de clic al botón "Crear Servidor" dentro del formulario
  const crearServidorButton = document.querySelector(
    '#nuevo_servidor_form button[type="submit"]'
  );
  crearServidorButton.addEventListener("click", function (e) {
    e.preventDefault(); // Evita que se envíe el formulario por defecto
    enviarDatosServidor(); // Llama a la función para enviar los datos al servidor
  });
});


// function eliminarServidor(servidorId) {
//   const url = `http://127.0.0.1:5000/servidores/${servidorId}`;

//   fetch(url, {
//     method: "DELETE",
//   })
//     .then((response) => {
//       if (response.status === 204) {
//         // Éxito, el servidor se eliminó con éxito
//         console.log("Servidor eliminado con éxito.");
//         // Actualiza la lista de servidores
//         getservidor();
//       } else {
//         console.error("Error al eliminar el servidor.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error de red:", error);
//     });
// }


function enviarDatosServidor() {
  const url = "http://127.0.0.1:5000/servidores";

  const nombreServidor = document.getElementById("nombre_servidor").value;
  const descripcion = document.getElementById("descripcion").value;

  // Crear un objeto con los datos del servidor, incluyendo id_usuario
  const nuevoServidor = {
    // id_usuario:idUsuario,
    nombre_servidor: nombreServidor,
    descripcion: descripcion,
  };
  // Realizar la solicitud POST al servidor
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(nuevoServidor),
  })
    .then((response) => {
      if (response.status === 201) {
        // El servidor ha sido creado con éxito
        console.log("Servidor creado con éxito.");
        // Cierra el modal después de crear el servidor
        modal.style.display = "none";
        // Actualiza la lista de servidores
        getservidor();
      } else {
        return response.json().then((data) => {
          // Manejar errores, por ejemplo, mostrar un mensaje de error
          console.error("Error al crear el servidor:", data.message);
        });
      }
    })


    .catch((error) => {
      console.error("Error de red:", error);
    });
}


function unirseAServidor(id_servidor) {
  console.log("paso por el unirseAServidor");
  console.log("numero", id_servidor);
  const url = "http://127.0.0.1:5000/unirse_a_servidor"; // Ruta para unirse a un servidor
  console.log("paso por el url");
  // Verifica si se obtuvo un ID de servidor válido
  if (!id_servidor) {
    console.error("ID de servidor inválido.");
    return;
  }
  const servidor = {
    id_servidor: id_servidor,
  };
  // Realiza la solicitud POST al servidor
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(servidor),
  })
    .then((response) => {
      if (response.status === 200) {
        // El usuario se ha unido al servidor con éxito
        console.log("Te has unido al servidor con éxito.");
        // Puedes realizar acciones adicionales, como actualizar la lista de servidores, etc.
      } else {
        return response.json().then(data => {
          document.getElementById("message").innerHTML = data.message;
        });
      }
    })
    .catch((error) => {
      console.error("Error de red:", error);
    });
}
