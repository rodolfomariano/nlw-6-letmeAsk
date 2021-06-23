import logoImage from '../../assets/images/logo.svg'
import { Button } from '../../components/Button'

import styles from './styles.module.scss'

export function Room() {
  return (
    <div className={styles.page__container}>
      <header>
        <div className={styles.room__header__content}>
          <img src={logoImage} alt="Logo letMeAsk" />
          <div>Codigo</div>
        </div>
      </header>

      <main className={styles.main__content}>
        <div className={styles.room__title}>
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form>
          <textarea
            placeholder="Qual a sua pergunta?"
          />

          <div className={styles.form__footer}>
            <span className={styles.footer__span}>Para enviar uma pergunta, <button>Faça seu login</button>. </span>
            <Button type="submit" >Enviar Pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  )
}