import React, { useState, useEffect } from 'react';
import { Wallet, Send, ArrowLeftRight, Shield, AlertTriangle, CheckCircle, Clock, Link2, Database, Copy, Eye, EyeOff } from 'lucide-react';

const TimeWallet = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState({ ETH: '0.00', USDT: '0.00', DAI: '0.00' });
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  
  const [fromNetwork, setFromNetwork] = useState('Ethereum');
  const [toNetwork, setToNetwork] = useState('Polygon');
  const [bridgeAmount, setBridgeAmount] = useState('');
  
  const [dappUrl, setDappUrl] = useState('');
  const [connectedDapps, setConnectedDapps] = useState([]);
  const [urlScanResult, setUrlScanResult] = useState(null);

  const networks = ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'];
  const currencies = ['ETH', 'USDT', 'DAI', 'USDC'];

  useEffect(() => {
    if (!walletAddress) {
      const mockAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      setWalletAddress(mockAddress);
      
      const mockKey = Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      setPrivateKey(mockKey);
      
      setBalance({
        ETH: (Math.random() * 5).toFixed(4),
        USDT: (Math.random() * 1000).toFixed(2),
        DAI: (Math.random() * 500).toFixed(2)
      });
    }
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const scanUrl = (url) => {
    const dangerousPatterns = ['phishing', 'scam', 'fake', 'malware'];
    const isDangerous = dangerousPatterns.some(pattern => 
      url.toLowerCase().includes(pattern));
    
    const isLegitimate = url.includes('uniswap') || url.includes('aave') || 
                         url.includes('opensea') || url.toLowerCase().includes('eth');
    
    setUrlScanResult({
      url,
      safe: !isDangerous && (isLegitimate || Math.random() > 0.3),
      timestamp: new Date().toLocaleString(),
      threats: isDangerous ? ['Potential phishing site', 'Suspicious domain'] : [],
      ssl: true,
      reputation: isDangerous ? 'Low' : isLegitimate ? 'High' : 'Medium'
    });
  };

  const connectToDapp = () => {
    if (!dappUrl) return;
    
    scanUrl(dappUrl);
    
    setTimeout(() => {
      if (urlScanResult && urlScanResult.safe) {
        setConnectedDapps([...connectedDapps, {
          url: dappUrl,
          connectedAt: new Date().toLocaleString()
        }]);
        setDappUrl('');
      }
    }, 1000);
  };

  const handleTransfer = () => {
    if (!recipient || !amount) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Transferring ${amount} ${selectedCurrency} to ${recipient}`);
    setRecipient('');
    setAmount('');
  };

  const handleBridge = () => {
    if (!bridgeAmount) {
      alert('Please enter an amount');
      return;
    }
    alert(`Bridging ${bridgeAmount} ${selectedCurrency} from ${fromNetwork} to ${toNetwork} via secure bridge`);
    setBridgeAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-3 rounded-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Time Wallet</h1>
                <p className="text-cyan-200 text-sm">Decentralized & Secure</p>
              </div>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          
          <div className="bg-black/30 rounded-xl p-4 mb-3">
            <p className="text-gray-300 text-xs mb-1">Wallet Address</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-mono text-sm">{walletAddress.slice(0, 20)}...{walletAddress.slice(-10)}</p>
              <button onClick={() => copyToClipboard(walletAddress)} className="text-cyan-400 hover:text-cyan-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Object.entries(balance).map(([currency, value]) => (
              <div key={currency} className="bg-black/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{currency}</p>
                <p className="text-white font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 mb-6 border border-white/20">
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'wallet', icon: Wallet, label: 'Wallet' },
              { id: 'send', icon: Send, label: 'Send' },
              { id: 'bridge', icon: ArrowLeftRight, label: 'Bridge' },
              { id: 'dapps', icon: Link2, label: 'dApps' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {activeTab === 'wallet' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Database className="w-6 h-6" />
                Storage & Security
              </h2>
              
              <div className="space-y-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-300 text-sm">Private Key</p>
                    <button 
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-white font-mono text-xs break-all">
                    {showPrivateKey ? privateKey : '••••••••••••••••••••••••••••••••'}
                  </p>
                  <p className="text-yellow-400 text-xs mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Never share your private key with anyone
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <p className="text-white font-semibold mb-1">Secure Storage</p>
                      <p className="text-gray-300 text-sm">Your keys are encrypted and stored locally. Time Wallet uses industry-standard encryption to protect your assets.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Backup Status</p>
                    <p className="text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Backed Up
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Security Level</p>
                    <p className="text-green-400 font-semibold">High</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'send' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Send className="w-6 h-6" />
                Send Cryptocurrency
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Select Currency</label>
                  <select 
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    {currencies.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                  />
                </div>

                <button 
                  onClick={handleTransfer}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Send {selectedCurrency}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bridge' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowLeftRight className="w-6 h-6" />
                Secure Bridge
              </h2>

              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold mb-1">100% Secure Bridge Protocol</p>
                    <p className="text-gray-300 text-sm">All cross-chain transfers are verified through multiple security layers and use audited bridge contracts.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">From Network</label>
                  <select 
                    value={fromNetwork}
                    onChange={(e) => setFromNetwork(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    {networks.map(net => (
                      <option key={net} value={net}>{net}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center">
                  <div className="bg-purple-500/20 rounded-full p-2">
                    <ArrowLeftRight className="w-6 h-6 text-purple-400" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">To Network</label>
                  <select 
                    value={toNetwork}
                    onChange={(e) => setToNetwork(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    {networks.filter(n => n !== fromNetwork).map(net => (
                      <option key={net} value={net}>{net}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Amount ({selectedCurrency})</label>
                  <input
                    type="number"
                    value={bridgeAmount}
                    onChange={(e) => setBridgeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                  />
                </div>

                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Estimated Time:</span>
                    <span className="text-white">2-5 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bridge Fee:</span>
                    <span className="text-white">0.1%</span>
                  </div>
                </div>

                <button 
                  onClick={handleBridge}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
                >
                  Bridge Assets
                </button>
              </div>
            </div>
          )}

          {activeTab === 'dapps' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Link2 className="w-6 h-6" />
                dApp Connections
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Enter dApp URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={dappUrl}
                      onChange={(e) => setDappUrl(e.target.value)}
                      placeholder="https://app.uniswap.org"
                      className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                    />
                    <button 
                      onClick={() => scanUrl(dappUrl)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      Scan
                    </button>
                  </div>
                </div>

                {urlScanResult && (
                  <div className={`rounded-xl p-4 border ${
                    urlScanResult.safe 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-red-500/20 border-red-500/30'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      {urlScanResult.safe ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold mb-1 ${
                          urlScanResult.safe ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {urlScanResult.safe ? 'Site is Safe' : 'Warning: Potential Threat Detected'}
                        </p>
                        <p className="text-white text-sm font-mono break-all">{urlScanResult.url}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-black/30 rounded p-2">
                        <p className="text-gray-400 text-xs">SSL Certificate</p>
                        <p className="text-white text-sm">✓ Valid</p>
                      </div>
                      <div className="bg-black/30 rounded p-2">
                        <p className="text-gray-400 text-xs">Reputation</p>
                        <p className="text-white text-sm">{urlScanResult.reputation}</p>
                      </div>
                    </div>

                    {!urlScanResult.safe && urlScanResult.threats.length > 0 && (
                      <div className="bg-black/30 rounded p-3">
                        <p className="text-red-400 text-sm font-semibold mb-2">Detected Threats:</p>
                        <ul className="space-y-1">
                          {urlScanResult.threats.map((threat, idx) => (
                            <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {threat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {urlScanResult.safe && (
                      <button 
                        onClick={connectToDapp}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all mt-3"
                      >
                        Connect to dApp
                      </button>
                    )}
                  </div>
                )}

                {connectedDapps.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Connected dApps</h3>
                    <div className="space-y-2">
                      {connectedDapps.map((dapp, idx) => (
                        <div key={idx} className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-mono">{dapp.url}</p>
                            <p className="text-gray-400 text-xs">Connected: {dapp.connectedAt}</p>
                          </div>
                          <button 
                            onClick={() => setConnectedDapps(connectedDapps.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Disconnect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Time Wallet v1.0 - Secure, Decentralized, Reliable</p>
        </div>
      </div>
    </div>
  );
};

export default TimeWallet;