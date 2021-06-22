import illustrationImage from '../../assets/images/illustration.svg'
import logoImage from '../../assets/images/logo.svg'
import googleIconImage from '../../assets/images/google-icon.svg'

import './styles.scss'
import { Button } from '../../components/Button'

export function NewRoom() {
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
          <h2>Criar uma nova sala</h2>
          <form>
            <input
              type="text "
              placeholder="Nome da sala"
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em ua sala já existente? <a href="#">clique aqui</a>
          </p>
        </div>
      </main>
    </div>
  )
}