import illustrationImage from '../../assets/images/illustration.svg'
import logoImage from '../../assets/images/logo.svg'
import googleIconImage from '../../assets/images/google-icon.svg'

import './styles.scss'
import { Button } from '../../components/Button'

export function Home() {
  return (
    <div className="page__container">
      <aside>
        <img src={illustrationImage} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas para perguntas ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main__content">
          <img src={logoImage} alt="Logo da aplicação" />
          <button className="create__rom">
            <img src={googleIconImage} alt="Logo do google" />
              Crie sua sala com o google
            </button>
          <div className="main__separator">Ou entre em uma sala</div>
          <form>
            <input
              type="text "
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}