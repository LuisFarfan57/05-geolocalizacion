const fs = require('fs')
const axios = require('axios')

class Busquedas {
    /**
     * Array de strings
     */
    historial = []

    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
    }

    get paramsMapbox() {
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get historialCapitalizado() {
        return this.historial.map((lugar = '') => {
            return lugar.charAt(0).toUpperCase() + lugar.slice(1);
        })
    }

    getParamsWeather(lat, lon) {
        return {
            'lat': lat,
            'lon': lon,
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async buscarCiudades(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const response = await instance.get()

            return response.data.features.map((lugar) => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))
        } catch (error) {
            return []
        }
    }

    async buscarClimaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: this.getParamsWeather(lat, lon)
            })

            const response = await instance.get()

            const {weather, main} = response.data

            return {
                descripcion: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temperatura: main.temp,
            }

        } catch (error) {
            console.log(error)
            return {}
        }
    }

    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLowerCase()))
            return

        //Para mantener siempre los ultimos 5 nada mas
        this.historial = this.historial.splice(0, 5)

        this.historial.unshift(lugar.toLowerCase())

        this.guardarDB()
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath))
            return

        const datos = JSON.parse(fs.readFileSync(this.dbPath, {encoding: 'utf-8'}))

        this.historial = datos.historial
    }
}

module.exports = Busquedas