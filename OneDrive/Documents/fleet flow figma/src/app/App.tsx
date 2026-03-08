import { RouterProvider } from 'react-router';
import { router } from './routes';
import ClickSpark from './components/ClickSpark';

export default function App() {
  return (
    <ClickSpark
      sparkColor='#3b82f6'
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={500}
      easing='ease-out'
      extraScale={1.2}
    >
      <RouterProvider router={router} />
    </ClickSpark>
  );
}