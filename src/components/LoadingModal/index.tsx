import { Container } from './styles';
import logoReact from '../../assets/react.svg';

function LoadingModal() {
  return (
    <Container>
      <div>
        <img
          className='sk-rotating-plane'
          src={logoReact}
          alt="Carregando"
        />
      </div>
    </Container>
  );
}

export { LoadingModal };
