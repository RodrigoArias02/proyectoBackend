const socket=io( )
let div = document.getElementById("productContainer")
let btnEnviarId = document.getElementById("enviarId")

function renderProducts(datos){
  let html = '';

  // Usando Array.map para transformar el array en el formato deseado
  datos.forEach(product => {
    html += `
      <div>
        <p><b>id:</b>${product._id}</p>
        <p><b>Titulo: </b>${product.title}</p>
        <p>$${product.price}</p>
        <p><b>Descripcion: </b>${product.description}</p>
        <p><b>Stock: </b>${product.stock}</p>
        <p><b>Category: </b>${product.category}</p>
        <img src=${product.thumbnail} width="400px" alt="">
      </div>
      <hr/>
    `;
  });

  div.innerHTML=html
}
//funcion que hace un fetch tipo get para pedir los productos
async function obtenerProductos() {
  try {
    // Supongamos que tienes una ruta en tu servidor que maneja la lógica para obtener productos
    const url = '/api/products';

    //solicitud GET al servidor y esperar la respuesta
    const response = await fetch(url);

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error al realizar la solicitud: ${response.status}`);
    }

    // Parsea la respuesta como JSON
    const data = await response.json();
    //retorno datos
    return data

  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

btnEnviarId.addEventListener('click', async ()=>{
  const id = document.getElementsByName('id')[0].value;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
      
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        alert(data.message)
        return false;
      }
  
      const data = await response.json();
      console.log(data)
      if(data.status==201){
        alert("eliminado con exito")
        const nuevosProductos= await obtenerProductos()
        //emitimos el nuevo array al servidor
        socket.emit('ProductoEliminado', nuevosProductos);
      }
    } catch (error) {
      console.error('Error:', error);
      
    }
})

async function enviarFormulario() {
    // Obtener datos del formulario
    const title = document.getElementsByName('title')[0].value;
    const description = document.getElementsByName('description')[0].value;
    const code = document.getElementsByName('code')[0].value;
    const price = document.getElementsByName('price')[0].value;
    let status = document.getElementsByName('status')[0].value;
    const stock = document.getElementsByName('stock')[0].value;
    const category = document.getElementsByName('category')[0].value;
    const url = document.getElementsByName('url')[0].value;
    status = status === "true" ? true : false;
    // Crear un objeto JSON con los datos del formulario
    const formData = {
      title: title,
      description: description,
      code: parseInt(code),
      price: parseInt(price),
      status: status, // Convertir a booleano
      stock: parseInt(stock), // Convertir a número
      category: category,
      thumbnail: [url],
    };
    // Enviar datos al servidor
    try {
      // Enviar datos al servidor y esperar la respuesta
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
       
      });
  
      // Parsear la respuesta como JSON
      const data = await response.json();
      if(data.status=="201"){
      // Obtener productos después de enviar el formulario
      const productos = await obtenerProductos();
      alert(data.message)
      // Emitir productos al servidor
      socket.emit('producto', productos);
      }else{
        alert(data.error)
      }

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  }

//el cliente escuchara y renderizara cada vez que llegue un nuevo array
socket.on("NuevoProducto", async datos=>{
  renderProducts(datos)
   
})
socket.on("nuevoProductoEliminado", async datos=>{
  renderProducts(datos)
})

