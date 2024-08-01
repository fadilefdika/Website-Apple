import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Highlight from './components/Highlight';
import Model from './components/Model';

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlight />
      <Model />
    </main>
  );
};

export default App;
