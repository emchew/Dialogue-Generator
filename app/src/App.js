import './css/App.css';
import './css/line.css';
import Canvas from './components/Canvas';

export const nodeType = {
  DIALOGUE: 'dialogue',
  DEFAULT: 'default',
  OPTION: 'option',
  NODE_OPTION: 'node_option'
}

function App() {
  return (
    <main>
      <Canvas/>
    </main>
  );
}

export default App;
