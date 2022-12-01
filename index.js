require('dotenv').config()
require('colors')
const { pausa, inquirerMenu, leerInput, listarLugares } = require('./helpers/inquirer')
const Busquedas = require('./models/busquedas')

const main = async () => {
    let opcion = -1

    const busquedas = new Busquedas()

    do {
        opcion = await inquirerMenu()

        switch (opcion) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ')

                //Buscar los lugares
                const lugares = await busquedas.buscarCiudades(termino)

                //Seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares)
                if (idSeleccionado === 0) continue

                const lugarSeleccionado = lugares.find((lugar) => {
                    return lugar.id === idSeleccionado
                })

                //Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre)

                //Adquirir datos de clima
                const clima = await busquedas.buscarClimaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)

                //Mostrar resultados
                console.clear()
                console.log('\nInformación de la ciudad\n'.green)
                console.log(`Ciudad: ${lugarSeleccionado.nombre}`.green)
                console.log(`Lat: ${lugarSeleccionado.lat}`)
                console.log(`Lng: ${lugarSeleccionado.lng}`)
                console.log(`Descripción del clima: ${clima.descripcion}`)
                console.log(`Mínima: ${clima.min}`)
                console.log(`Máxima: ${clima.max}`)
                console.log(`Temperatura: ${clima.temperatura}`.green)
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const index = `${i + 1}`.green
                    console.log(`${index}. ${lugar}`)
                })
                break
        }

        if (opcion !== 0) await pausa()
    } while (opcion !== 0)
}

main()