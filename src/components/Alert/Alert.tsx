import type { ReactNode } from "react";
import styles from './Alert.module.css'

export default function Alert({children} : {children : ReactNode}) { // generamos este codigo para pasarle el mensaje
  return (
    <div className={styles.alert}>{children}</div>
  )
}
