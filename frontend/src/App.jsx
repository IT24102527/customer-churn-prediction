import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import ModelInfo from './components/ModelInfo';
import Footer from './components/Footer';

export default function App() {
  const [predictionResult, setPredictionResult] = useState(null);

  const handleResult = (result) => {
    setPredictionResult(result);
  };

  const handleReset = () => {
    setPredictionResult(null);
    // Scroll back to the form
    const el = document.querySelector('#predict');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PredictionForm onResult={handleResult} />
        {predictionResult && (
          <PredictionResult result={predictionResult} onReset={handleReset} />
        )}
        <ModelInfo />
      </main>
      <Footer />
    </>
  );
}
