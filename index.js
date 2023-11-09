async function buscarPokemon() {
                    
        const evoluBtn = document.getElementById("evolucionarBtn");
        const pokemonInfoDiv = document.getElementById("pokemonInfo");
        // Hacer visible el botón de evolución
        evoluBtn.style.display = "block";

        mostrarError(""); 
        const nombrePokemon = document.getElementById("pokemonInput").value.toLowerCase();
        if (!nombrePokemon) {
            mostrarError("Por favor, ingresa el nombre del Pokémon.");
            return;
        }
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
            if (!response.ok) {
                pokemonInfoDiv.classList.add("hidden");
                throw new Error("Pokémon no encontrado.");
            }
            const data = await response.json();
            const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const imagen = data.sprites.front_default;
            const habilidades = data.abilities.map(ability => ability.ability.name);
            const evolucionURL = data.species.url;
            
            // Obtener descripción del Pokémon
            const especiesResponse = await fetch(evolucionURL);
            const especiesData = await especiesResponse.json();
            const descripcion = especiesData.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
            const evolucionChain = especiesData.evolution_chain.url;

            // Obtener información de la evolución del pokemon
            const evolResponse = await fetch(evolucionChain);
            const evolData = await evolResponse.json();
            
            // Rellenar los datos obtenidos en los elementos del DOM
            document.getElementById("pokemonNombre").textContent = nombre;
            document.getElementById("pokemonImagen").src = imagen;
            document.getElementById("pokemonDescripcion").textContent = `DESCRIPCIÓN: ${descripcion}`;
            document.getElementById("habilidadesLista").innerHTML = habilidades.map(habilidad => `<li>${habilidad}</li>`).join('');

            let evolucionBtn = document.getElementById("evolucionarBtn");

            if (evolData.chain.evolves_to.length === 0) {
                // Si 'evolves_to' está vacío, el Pokémon no tiene evolución
                evolucionBtn.style.display = "none"; // Deshabilita el botón de Evolucionar
                
            } else{
                const evolName = evolData.chain.evolves_to[0].evolves_to[0].species.name; // Nombre del pokemon evolucionado
                const evolURL = evolData.chain.evolves_to[0].evolves_to[0].species.url; // url del pokemon evolucionado
                document.getElementById("evolucion").textContent = `Evolución: ${evolName}`;

                document.getElementById("evolucionarBtn").addEventListener("click", async()=>{

                    try {
                        document.getElementById("evolucion").textContent = ``;
                        const evolresponse = await fetch(evolURL);
                        
                        if (!evolresponse.ok) {
                            throw new Error("Pokémon no encontrado.");
                        }
                        const data1 = await evolresponse.json();
                        const nombre = data1.name.charAt(0).toUpperCase() + data1.name.slice(1);
                        const responseHabili = await fetch(`https://pokeapi.co/api/v2/pokemon/${data1.name}`)
                        const dataHabili = await responseHabili.json();
                        const habilidades = dataHabili.abilities.map(ability => ability.ability.name);
                        const imagen = dataHabili.sprites.front_default;

                        // Obtener descripción del Pokémon
                        const descripcion = data1.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;

                        // Rellenar los datos obtenidos en los elementos del DOM
                        document.getElementById("pokemonNombre").textContent = nombre;
                        document.getElementById("pokemonImagen").src = imagen;
                        document.getElementById("pokemonDescripcion").textContent = `DESCRIPCIÓN: ${descripcion}`;
                        document.getElementById("habilidadesLista").innerHTML = habilidades.map(habilidad => `<li>${habilidad}</li>`).join(''); 
                        
                        // Eliminar el evento click del botón después de hacer la evolución
                        evolucionBtn.removeEventListener("click", null);
                        
                        // Ocultar el botón de evolución después de hacer clic
                        evolucionBtn.style.display = "none";
                    } catch (error) {
                        console.error(error.message);
                    }
            
                });
            }
            
            // Mostrar la sección de información del Pokémon
            document.getElementById("pokemonInfo").classList.remove("hidden");
        } catch (error) {
            // Captura el error y muestra un mensaje al usuario
            mostrarError(error.message);
        }
}

// Oculta información del Pokémon al cargar la página
document.getElementById("pokemonInfo").classList.add("hidden");

function mostrarError(mensaje) {
        const mensajeErrorDiv = document.getElementById("mensaje-error");
        mensajeErrorDiv.textContent = mensaje;
        mensajeErrorDiv.style.display = "block"; // Muestra el mensaje de error
}

    