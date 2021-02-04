import React, { useEffect, useRef, useState } from 'react';

const App = () => {
  const [ws, setWs] = useState(null);

  const nameRef = useRef();
  const messagesRef = useRef();
  const messageBoxRef = useRef();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    const newWs = new WebSocket('ws://localhost:6969');
    newWs.onopen = () => {
      console.log('Connection to WebSocket opened!');
    }
    newWs.onmessage = ({ data }) => setMessages(prevMessages => [...prevMessages, JSON.parse(data)]);
    newWs.onclose = function() {
      setWs(null);
    }

    setWs(newWs);

    return () => {
      ws.close();
      setWs(null);
    }
  }, []);

  const onSend = () => {
    const user = nameRef.current.value || 'Unknown';
    const message = messageBoxRef.current.value;

    if (!message) return;

    if (!ws) {
      console.log("No WebSocket connection :(");
      return;
    }

    ws.send(JSON.stringify({ user, message }));
    setMessages(prevMessages => [...prevMessages, { message }]);
    messageBoxRef.current.value = '';
  };

  const onMessageBoxPress = (e) => {
    if (e.charCode !== 13) return ;

    e.preventDefault();
    onSend();
  }

  const messagesHeight = messagesRef?.current?.scrollHeight || 0;

  useEffect(() => {
    messagesRef.current.scrollTop = messagesHeight;
  }, [messagesHeight]);

  return (
    <div className='app'>
      <h1 className='title'>WebSocket Chat Example</h1>
      <label>You are: </label>
      <input className='input-name' type="text" placeholder="Input your name" ref={nameRef} />
      <div ref={messagesRef} className='messages'>
        {
          messages.length === 0 && <span className='message system'>You are online!</span>
        }
        {
          messages.map((message, i) => (
            <span key={i} className={`message ${!message.user ? 'my' : 'income'}`}>
              {message.user && <span className='bold'>{`${message.user}:`}</span>}
              {message.message}
            </span>
          ))
        }
      </div>
      <input className='input-message' type="text" placeholder="Type your message here" ref={messageBoxRef} onKeyPress={onMessageBoxPress}/>
      <button className='send-message' title="Send Message!" onClick={onSend}>Send Message</button>
    </div>
  );
}

export default App;
