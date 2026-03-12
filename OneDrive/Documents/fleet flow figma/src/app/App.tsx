import { RouterProvider } from 'react-router';
import { router } from './routes';
import ClickSpark from './components/ClickSpark';

export default function App() {
  return (
    <ClickSpark
      sparkColor='#60a5fa'
      sparkSize={14}
      sparkRadius={25}
      sparkCount={10}
      duration={600}
      easing='ease-out'
      extraScale={1.3}
    >
      <RouterProvider router={router} />
    </ClickSpark>
  );
}