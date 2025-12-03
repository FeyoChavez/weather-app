export type SearchType = {
    city: string
    country: string
}

// types de countries.ts
export type Country = {
    code: string
    name: string
}

export type Weather = {
    name: string
    main: {
        temp: number
        temp_max : number
        temp_min: number
    }
}