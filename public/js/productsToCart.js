
  const buttons = document.querySelectorAll('.btnEnviarId');

  // Agrega un manejador de eventos a cada botón
  buttons.forEach((button) => {
    button.addEventListener('click', async() => {
      // Obtiene el ID del producto del atributo data-id del botón clickeado
      const productId = button.getAttribute('data-id')
      const idCarrito = document.getElementById("idcarrito").value
      console.log(idCarrito)
      if(!idCarrito){
        alert("ingrese un id carrito")
        return
      }

      //crear objeto json con id y quantity y mandarlo por req.body proximamente...


    // Enviar datos al servidor
    try {
      // Enviar datos al servidor y esperar la respuesta
      const response = await fetch(`/api/carts/${idCarrito}/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(formData),
       
      });
  
      // Parsear la respuesta como JSON
      const data = await response.json();
      console.log(data)
      if(data.status=="200"){
      alert(data.message)
      }else{
        alert(data.error)
      }

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
      
    });
  });