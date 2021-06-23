import styles from './styles.module.scss'

import copyImage from '../../assets/images/copy.svg'

export function RoomCode() {
  return (
    <button className={styles.room__code}>
      <div>
        <img src={copyImage} alt="Icone de copiar" />
      </div>
      <span>Sala #123456785454</span>
    </button>
  )
}