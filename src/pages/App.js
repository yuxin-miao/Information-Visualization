import './App.css';
import { Main } from '../components/main';
import { Sidebar } from '../components/sidebar';

function App() {
  return (
    <div className="h-screen w-screen bg-main grid gap-4 grid-cols-12 grid-rows-1">
      <Sidebar className="col-span-2" />
      <Main />
    </div>
  );
}

export default App;
