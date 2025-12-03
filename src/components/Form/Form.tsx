import { useState, type ChangeEvent, type FormEvent } from "react";
import type { SearchType } from "../../types";
import { countries } from "../../data/countries";
import styles from './Form.module.css'
import Alert from "../Alert/Alert";

type FormProps = {
    fetchWeather: (search: SearchType) => Promise<void> // soluciona el error de app.tsx 15
}

export default function Form({fetchWeather} : FormProps) {

    const [search, setSearch] = useState<SearchType>({
        city: '',
        country: ''
    })

    const [alert, setAlert] = useState('')

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setSearch({
            ...search,
            [e.target.name] : e.target.value
        })
    }

    // validacion
    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(Object.values(search).includes('')) {
            setAlert('Todos los campos son obligatorios')
            return
        }
        fetchWeather(search) // se manda a llamar cuando se pasa la validacion
    }

  return (

    <form 
    className={styles.form}
    onSubmit={handleSubmit}
    >
        {alert && <Alert>{alert}</Alert> /*si hay algo en alert entonces renderiza Alert*/} 
        <div className={styles.field}>
            <label htmlFor="city">Ciudad</label>
            <input 
            id="city"
            name="city"
            placeholder="Ciudad"
            type="text"
            value={search.city}
            onChange={handleChange} />
        </div>


        <div className={styles.field}>
            <label htmlFor="country">País</label>

            <select
                id="country"
                value={search.country}
                name="country"
                onChange={handleChange}
            >
                
            <option className={styles.option} value="">--Seleccione un país--</option>
            {countries.map(country => (
                <option 
                    key={country.code}
                    value={country.code}
                    className={styles.option}
                >{country.name}
                </option>
            ))}
            </select>
        </div>

        <input className={styles.submit} type="submit" value='Consultar Clima' />
    </form>
  )
}
