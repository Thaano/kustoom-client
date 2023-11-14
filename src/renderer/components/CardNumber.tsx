import { styled } from 'styled-components';

interface Props {
  cardNumber: number;
}

const Card = styled.div`
  padding: 2em;

  //glass neumorphism
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(190, 190, 190, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardNumber = ({ cardNumber }: Props) => {
  return (
    <Card className="card-number">
      <div className="card-number__number">{cardNumber}</div>
    </Card>
  );
};

export default CardNumber;
