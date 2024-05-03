
var vProximaEvolucion = "";

document.addEventListener('DOMContentLoaded', function(){

    dqs('.buttonSearch').addEventListener("click", function(){
        var vNombre = "";
        var vImg = "";
        var vTipo = "";
        var vDescripcion = "";
        var vHabilidades = ""

        if(dqs('#in1').value == ''){
            alert("Por favor, ingrese el nombre de un Pokemon");
            return false;
        }else{
            


            const url = `https://pokeapi.co/api/v2/pokemon/${dqs('#in1').value}`;
            const options = {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', 
          },
        };
        
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Hubo un problema con la solicitud: ' + response.status);
            }
            return response.json(); 
          })
          .then(data => {
            vImg = data.sprites.other['official-artwork'].front_default;
            vNombre = data.name;
    
            data.types.forEach(element => {
                vTipo += (element.type.name + ", ");
            });

            data.abilities.forEach(element => {
                vHabilidades += (element.ability.name + ", ");
            });
            
            const url2 = `https://pokeapi.co/api/v2/pokemon-species/${data.id}`;

            fetch(url2)
            .then(response => {
              if (!response.ok) {
                throw new Error('Hubo un problema con la solicitud: ' + response.status);
              }
              return response.json(); 
            })
            .then(data => {
                for(var i = 0; i <= data.flavor_text_entries.length-1; i++){
                    console.log(data.flavor_text_entries[i].language.name)
                    if(data.flavor_text_entries[i].language.name == 'es'){
                        vDescripcion += data.flavor_text_entries[i].flavor_text
                } 
            }

            dqs('.pokemonName').innerHTML = vNombre;
            dqs('.pokemonImg').src = vImg;
            dqs('.pokemonType').innerHTML = vTipo.slice(0,-2);
            dqs('.pokemonDescrition').innerHTML = vDescripcion;
            dqs('.pokemonAbilities').innerHTML = vHabilidades.slice(0,-2);
            dqs('.containerInfo').style.display = "block"

            /*Evolucion tomar cadena*/
            var url3 = `https://pokeapi.co/api/v2/pokemon-species/${data.id}`;
            //var url3 = `https://pokeapi.co/api/v2/evolution-chain/${10}`;
            fetch(url3, {
                method: 'GET', 
                headers: {
                  'Content-Type': 'application/json',
                  
                }, 
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Error');
                }
                return response.json(); 
              })
              .then(data => {
                console.log("data3: ",data)
                console.log(data.evolution_chain.url)
                /*Consultar evolución*/ 
              
                fetch(data.evolution_chain.url, {
                    method: 'GET', 
                    headers: {
                      'Content-Type': 'application/json',
                      
                    }, 
                  })
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Error');
                    }
                    return response.json(); 
                  })
                  .then(data => {
                    var vNiveles = [];
                    

                    vNiveles[0] = data.chain.species.name
                    if(data.chain.evolves_to[0] != undefined){
                        vNiveles[1] = data.chain.evolves_to[0].species.name
                    }
                    if(data.chain.evolves_to[0].evolves_to[0] != undefined){
                        vNiveles[2] = data.chain.evolves_to[0].evolves_to[0].species.name
                    }

                    for(var i = 0; i <= vNiveles.length; i++){
                        if(vNiveles[i] == vNombre){
                            if(i == vNiveles.length - 1){
                                dqs('.containerEvolution').style.display = "none"

                            }else{

                                vProximaEvolucion = vNiveles[i+1]
                                dqs('.containerEvolution').style.display = "block"
                            }  
                        }
                    }
                    if(vProximaEvolucion != ""){
                        
                    }
                  })
                  .catch(error => {
                    
                    console.error('Error:', error);
                  });
                /*Consultar evolución*/ 

              })
              .catch(error => {
                
                console.error('Error:', error);
              });
            /*Evolucion*/

            })
            .catch(error => {
              console.log(error);
            });
          })
          .catch(error => {
            console.log(error);
            if(error.message.includes('404')){
                //alert("El nombre no pertenece a un Pokemon")
                dqs('.containerEvolution').style.display = "none"
                dqs('.containerInfo').style.display = "none"

                dqs('.containerError').style.display = "block"
                setTimeout(function(){
                    dqs('.containerError').style.display = "none"
                },4000)
            }

          });
        }
    })

    //in1
    dqs('.buttonEvolution').addEventListener("click",function(){
        dqs('#in1').value = vProximaEvolucion;
        dqs('.buttonSearch').click();

    })

})

function dqs(qs){
    return document.querySelector(qs)
}

