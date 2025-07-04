import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Brain, Zap, Target, CheckCircle2, AlertCircle, Loader, Wifi, WifiOff } from 'lucide-react';

const IntentClassificationApp = () => {
  const [selectedModel, setSelectedModel] = useState('naive_bayes');
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  const API_BASE_URL = 'http://127.0.0.1:8000';

  const models = [
    {
      id: 'naive_bayes',
      name: 'Naive Bayes',
      description: 'Probabilistic classifier based on Bayes theorem',
      icon: Brain,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      id: 'logistic_regression',
      name: 'Logistic Regression',
      description: 'Linear classifier using logistic function',
      icon: Zap,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    {
      id: 'linear_svm',
      name: 'Linear SVM',
      description: 'Support Vector Machine with linear kernel',
      icon: Target,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    }
  ];

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000
      });
      setApiStatus('connected');
    } catch (err) {
      setApiStatus('disconnected');
      setError('Cannot connect to API. Please make sure the FastAPI server is running on port 8000.');
    }
  };

  const handlePredict = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to classify');
      return;
    }

    if (apiStatus !== 'connected') {
      setError('API is not connected. Please check if the FastAPI server is running.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        text: inputText,
        model_name: selectedModel
      }, {
        timeout: 10000
      });

      setPrediction(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'Failed to get prediction');
      } else if (err.request) {
        setError('Cannot connect to the API. Please check if the server is running.');
        setApiStatus('disconnected');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePredict();
    }
  };

  const getSelectedModelInfo = () => {
    return models.find(model => model.id === selectedModel);
  };

  const selectedModelInfo = getSelectedModelInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-900">Intent Classification</h1>
              <p className="text-slate-600 mt-2">Classify text intent using machine learning models</p>
            </div>
            <div className="flex items-center space-x-2">
              {apiStatus === 'connected' && (
                <>
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">API Connected</span>
                </>
              )}
              {apiStatus === 'disconnected' && (
                <>
                  <WifiOff className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">API Disconnected</span>
                </>
              )}
              {apiStatus === 'checking' && (
                <>
                  <Loader className="h-5 w-5 text-yellow-600 animate-spin" />
                  <span className="text-sm text-yellow-600 font-medium">Checking API...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Choose Model</h2>
              <div className="space-y-3">
                {models.map((model) => {
                  const Icon = model.icon;
                  const isSelected = selectedModel === model.id;
                  
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected 
                          ? `${model.bgColor} ${model.borderColor} ring-2 ring-offset-1 ring-opacity-50` 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${model.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${isSelected ? model.textColor : 'text-slate-900'}`}>
                            {model.name}
                          </h3>
                          <p className={`text-sm mt-1 ${isSelected ? model.textColor : 'text-slate-600'}`}>
                            {model.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Retry API Connection Button */}
              {apiStatus === 'disconnected' && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={checkApiStatus}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Wifi className="h-4 w-4" />
                    <span>Retry Connection</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Input and Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Text Classification</h2>
              
              {/* Input Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Enter text to classify:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your text here... (e.g., 'is the mattress available?')"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  rows="4"
                />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Selected model: <span className={`font-medium ${selectedModelInfo.textColor}`}>
                      {selectedModelInfo.name}
                    </span>
                  </p>
                  <button
                    onClick={handlePredict}
                    disabled={loading || !inputText.trim() || apiStatus !== 'connected'}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Classifying...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Classify</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700 font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              )}

              {/* Results Display */}
              {prediction && (
                <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Classification Result</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-700 mb-2">Input Text</h4>
                      <p className="text-slate-900 italic">"{prediction.text}"</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-700 mb-2">Model Used</h4>
                      <p className={`font-medium ${selectedModelInfo.textColor}`}>
                        {selectedModelInfo.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-700 mb-2">Predicted Intent</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-slate-900 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {prediction.predicted_intent}
                      </span>
                      {prediction.confidence && (
                        <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          Confidence: {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Texts */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-700 mb-2">Sample Texts to Try:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Is the mattress available?",
                    "I want to cancel my order",
                    "How much does shipping cost?",
                    "What is your return policy?",
                    "I need help with my account",
                    "When will my order arrive?"
                  ].map((sampleText, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(sampleText)}
                      className="text-left p-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors"
                    >
                      "{sampleText}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentClassificationApp;