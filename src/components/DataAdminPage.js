import React, { useState, useEffect } from 'react';
import { Download, BarChart3, Users, ThumbsUp, ThumbsDown, ExternalLink, RefreshCw, FileSpreadsheet, Calendar, Copy, Check, Settings, Database, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui';
import { BUTTON_VARIANTS } from '../constants';
import { getDataStats, generateDailySummary, getAirtableConfig, saveAirtableConfig, initializeAirtable } from '../utils';

const AirtableSetup = ({ onAirtableConfigured }) => {
  const [baseId, setBaseId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [maskedToken, setMaskedToken] = useState('');

  const handleSaveConfig = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      
      // Save configuration
      await saveAirtableConfig(baseId, accessToken);
      
      // Test the connection
      const result = await initializeAirtable();
      
      if (result.success) {
        setIsConfigured(true);
        setTestResult({ success: true, message: result.message });
        onAirtableConfigured?.(baseId, accessToken);
      } else {
        setTestResult({ success: false, message: result.error });
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    const config = getAirtableConfig();
    if (config.isConfigured) {
      setIsConfigured(true);
      setMaskedToken(config.accessToken);
      setBaseId(config.baseId);
    }
  }, []);

  if (isConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Airtable Connected</span>
            </h3>
            <p className="text-sm text-green-700">
              Data is being automatically saved to your Airtable base
            </p>
            <div className="mt-2 text-xs text-green-600">
              <p>Base ID: {baseId}</p>
              <p>Token: {maskedToken}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant={BUTTON_VARIANTS.OUTLINE}
              onClick={() => setIsConfigured(false)}
              className="inline-flex items-center space-x-2 text-green-700 border-green-300"
            >
              <Settings className="w-4 h-4" />
              <span>Reconfigure</span>
            </Button>
            <Button
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={() => window.open(`https://airtable.com/${baseId}`, '_blank')}
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Base</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
        <Database className="w-5 h-5 text-blue-600" />
        <span>Connect Airtable</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-2">Step 1: Create Your Airtable Base</h4>
          <div className="bg-white rounded-lg p-4 border">
            <ol className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">1</span>
                <span>Go to <a href="https://airtable.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Airtable.com</a></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">2</span>
                <span>Create a new blank base</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">3</span>
                <span>Name it "Exposr Analytics" (or whatever you prefer)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">4</span>
                <span>Copy the Base ID from the URL (the "app..." part)</span>
              </li>
            </ol>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-2">Step 2: Paste Your Airtable Base ID</h4>
          <div className="bg-white rounded-lg p-4 border space-y-3">
            <div>
              <input
                type="text"
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                placeholder="app1234567890abcde"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Should look like: app1234567890abcde (from your Airtable URL)
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-2">Step 3: Get Personal Access Token</h4>
          <div className="bg-white rounded-lg p-4 border space-y-3">
            <div>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="pat1234567890abcdef.1234567890abcdef"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Create at: <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">airtable.com/create/tokens</a>
              </p>
            </div>
            
            <Button
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={handleSaveConfig}
              disabled={!baseId.trim() || !accessToken.trim() || testing}
              loading={testing}
              className="w-full"
            >
              {testing ? 'Testing Connection...' : 'Connect to Airtable'}
            </Button>
            
            {testResult && (
              <div className={`p-3 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start space-x-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${testResult.success ? 'text-green-900' : 'text-red-900'}`}>
                      {testResult.success ? 'Success!' : 'Connection Failed'}
                    </p>
                    <p className={`text-xs ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {testResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Why Airtable is Better</span>
          </h4>
          <div className="bg-white rounded-lg p-4 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium text-gray-900 mb-1">🔒 Security</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Token-based authentication</li>
                  <li>• No public editing required</li>
                  <li>• Granular permissions</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">⚡ Features</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Rich data types & validation</li>
                  <li>• Powerful filtering & views</li>
                  <li>• Built-in automations</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-600">
                <strong>Setup Guide:</strong> <a href="https://github.com/yourusername/exposr/blob/main/AIRTABLE_SETUP.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">📖 View Complete Setup Guide</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataAdminPage = () => {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [airtableConfigured, setAirtableConfigured] = useState(false);

  const loadStats = async () => {
    setRefreshing(true);
    try {
      const currentStats = await getDataStats();
      setStats(currentStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Set empty stats on error
      setStats({
        totalAnalyses: 0,
        totalFeedback: 0,
        feedbackRate: 0,
        accurateFeedback: 0,
        inaccurateFeedback: 0,
        consentedImages: 0,
        aiDetected: 0,
        humanDetected: 0,
        avgConfidence: 0,
        airtableUrl: null,
        airtableConfigured: getAirtableConfig().isConfigured
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
    const config = getAirtableConfig();
    setAirtableConfigured(config.isConfigured);
  }, []);

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const summary = await generateDailySummary();
      if (summary) {
        console.log('📊 Daily summary generated:', summary);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleAirtableConfigured = (baseId, accessToken) => {
    setAirtableConfigured(true);
    loadStats(); // Refresh to get updated Airtable stats
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Exposr Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time data collection with Airtable integration
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant={BUTTON_VARIANTS.OUTLINE}
                onClick={loadStats}
                disabled={refreshing}
                className="inline-flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              {airtableConfigured && (
                <Button
                  variant={BUTTON_VARIANTS.SECONDARY}
                  onClick={handleGenerateSummary}
                  disabled={generatingSummary}
                  loading={generatingSummary}
                  className="inline-flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Generate Daily Summary</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Airtable Setup/Status */}
        <div className="mb-8">
          <AirtableSetup onAirtableConfigured={handleAirtableConfigured} />
        </div>

        {/* Stats Grid - Only show if Airtable is configured */}
        {airtableConfigured && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Analyses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Feedback Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.feedbackRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ThumbsUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgConfidence}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consented Images</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.consentedImages}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Tables Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>Analyses Table</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Records:</span>
                    <span className="font-medium">{stats.totalAnalyses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">AI Detected:</span>
                    <span className="font-medium">{stats.aiDetected}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Human/Authentic:</span>
                    <span className="font-medium">{stats.humanDetected}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Contains all image analysis data, metadata, and results
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span>Feedback Table</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Feedback:</span>
                    <span className="font-medium">{stats.totalFeedback}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accurate:</span>
                    <span className="font-medium text-green-600">{stats.accurateFeedback}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inaccurate:</span>
                    <span className="font-medium text-red-600">{stats.inaccurateFeedback}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  User feedback and comments on detection accuracy
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Daily Summary</span>
                </h3>
                <div className="space-y-3">
                  <Button
                    variant={BUTTON_VARIANTS.OUTLINE}
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                    loading={generatingSummary}
                    className="w-full text-sm"
                  >
                    Generate Today's Summary
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Aggregated daily statistics and trends
                </p>
              </div>
            </div>
          </>
        )}

        {/* Quick Start Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What This Creates</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Analyses Table</h3>
              <p className="text-sm text-gray-600 mb-3">
                Every image analysis creates a record with:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Timestamp, Analysis ID</li>
                <li>• Image metadata (size, dimensions, format)</li>
                <li>• AI detection results and confidence</li>
                <li>• User location and browser info</li>
                <li>• Research consent status</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">💬 Feedback Table</h3>
              <p className="text-sm text-gray-600 mb-3">
                User feedback creates records with:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Feedback timestamp and ID</li>
                <li>• Feedback type (accurate/inaccurate)</li>
                <li>• Optional user comments</li>
                <li>• Browser and platform info</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📈 Daily Summary</h3>
              <p className="text-sm text-gray-600 mb-3">
                Daily aggregations include:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Total analyses and detection rates</li>
                <li>• Average confidence scores</li>
                <li>• Feedback rates and accuracy</li>
                <li>• Research consent statistics</li>
                <li>• Daily trends and insights</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>💡 Why Airtable?</strong> More secure than Google Sheets, with rich data types, powerful filtering, and no public editing requirements.
            </p>
            <p className="text-xs text-gray-500">
              <strong>Setup Guide:</strong> Need help? Check out our <a href="https://github.com/yourusername/exposr/blob/main/AIRTABLE_SETUP.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">complete Airtable setup guide</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAdminPage;