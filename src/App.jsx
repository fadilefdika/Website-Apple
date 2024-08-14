import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Highlight from './components/Highlight';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';

import * as Sentry from '@sentry/react';
import Footer from './components/Footer';

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlight />
      <Model />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
};

export default Sentry.withProfiler(App);
