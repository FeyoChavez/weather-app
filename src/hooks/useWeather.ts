import axios from 'axios'
import type { SearchType } from '../types'
import {z} from 'zod'
import { useMemo, useState } from 'react'
//import {object, string, number, type InferOutput, parse} from 'valibot'

/* TYPE GUARDS
function isWeatherResponse(weather : unknown) : weather is Weather { 
    return ( 
        Boolean(weather) && 
        typeof weather === 'object' &&
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main.temp === 'number' && 
        typeof (weather as Weather).main.temp_max === 'number' && 
        typeof (weather as Weather).main.temp_min === 'number'  
    )
} */

// ZOD
//Weather no es referencia al objeto Weather, asi se hizo la declaracion
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number(),
    })
}) 

export type Weather = z.infer<typeof Weather>


/* VALIBOT
const WeatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_max: number(),
        temp_min: number()
    })
}) 
    type Weather = InferOutput<typeof WeatherSchema> 
*/

const initialState = {
        name: '',
        main: {
            temp: 0,
            temp_max: 0,
            temp_min: 0
        }
}

export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState) 
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false) // si es true, mostrara un msj de error

    const fetchWeather = async (search : SearchType) => {

        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState) // soluciona el problema de spinner y los datos sobrepuestos
        try{

            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

            const {data} = await axios(geoUrl) // default es axios.get
            
            //Comprobar si existe
            if(!data[0]){
                setNotFound(true)
                return
            }

            // variables globales
            const lat = data[0].lat
            const lon = data[0].lon
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

        /* CASTEAR EL TYPE
            const {data: weatherResult} = await axios<Weather>(weatherUrl) // axios siempre espera data, pero como ya existe, lo renombramos
            console.log(weatherResult) */

        /* TYPE GUARDS
            const {data: weatherResult} = await axios(weatherUrl) 
            const result = isWeatherResponse(weatherResult)
            if(result) {
                console.log(weatherResult.name)
            } else {
                console.log('respuesta mal formada...')
            } */

        /* VALIBOT
        const {data: weatherResult} = await axios(weatherUrl)
        const result = parse(WeatherSchema, weatherResult)
        if(result) {
            console.log(result.name)
        } */

        // ZOD
        const {data: weatherResult} = await axios(weatherUrl) 
        const result = Weather.safeParse(weatherResult) // extraccion de weatherResult
        if(result.success){
            setWeather(result.data)
        } 

        } catch (error) {
            console.log(error)

        } finally{
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name , [weather]) //weather.name tiene algo? :

    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData
    }
}