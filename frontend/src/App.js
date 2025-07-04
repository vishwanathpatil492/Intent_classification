import React from 'react';
import IntentClassificationApp from './components/intent_classification';
import './App.css';

console.log('IntentClassificationApp:', IntentClassificationApp);
// This should log a function, not undefined or an object

function App() {
  return (
    <div className="App">
      <IntentClassificationApp />
    </div>
  );
}

export default App;