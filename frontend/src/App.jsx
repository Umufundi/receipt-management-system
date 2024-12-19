import React from 'react';
import ReceiptUpload from './components/ReceiptUpload';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Receipt Management System</h1>
      </header>
      <main>
        <ReceiptUpload />
      </main>
    </div>
  );
}

export default App; 