import './App.css';
import { Main } from '../components/main';
import { Sidebar } from '../components/sidebar';

function App() {
  return (
    <div className="h-screen w-screen bg-main flex">
      <Sidebar />
      <Main />
    </div>
  );
}

export default App;
