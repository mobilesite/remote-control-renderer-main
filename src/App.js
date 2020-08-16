import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ipcRenderer } from 'electron';
// const {ipcRenderer} = window.require('electron');

function App() {
  // 这里我们使用React Hooks
  const [remoteCode, setRemoteCode] = useState('');
  const [localCode, setLocalCode] = useState('');
  const [controlText, setControlText] = useState('');
  const login = async () => {
    let code = await ipcRenderer.invoke('login');
    setLocalCode(code);
  };
  const startControl = (remoteCode) => {
    ipcRenderer.send('control', remoteCode);
  };
  useEffect(() => {
    login();
    ipcRenderer.on('control-state-change', handleControlState);
    // 此前的这两句就相当于componentDidMount（组件挂载后）这个过程

    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState);
    };
  }, []);
  const handleControlState = (e, name, type) => {
    let text = '';
    if (type === 1) {
      // 控制别人
      text = `正在远程控制${name}`;
    } else if (type === 2) {
      // 被控制
      text = `被${name}控制中`;
    }
    setControlText(text);
  };
  return (
    <div className="App">
      {controlText === '' ? (
        <>
          <div>你的控制码{localCode}</div>
          <input
            type="text"
            value={remoteCode}
            onChange={(e) => {
              setRemoteCode(e.target.value);
            }}
          />
          <button onClick={() => startControl(remoteCode)}>确认</button>
        </>
      ) : (
        <div>{controlText}</div>
      )}
    </div>
  );
}

export default App;
