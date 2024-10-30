'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  botStateMachine,
  botStateConfig,
  STATE_STOCK_EXCHANGE_SELECTION,
} from '@/services/chatbot-service';

export default function Home() {
  const chatContainerRef = useRef(null);
  const [chatEntries, setChatEntries] = useState([
    { message: "Hello! Welcome to LSEG, I'm here to help you.", isBot: true },
    { ...botStateConfig[STATE_STOCK_EXCHANGE_SELECTION](), isBot: true },
  ]);

  const handleOptionClick = useCallback(
    (option) => {
      const nextState = botStateMachine.transition(option);

      setChatEntries((prevChatEntries) => [
        ...prevChatEntries,
        { message: option, isBot: false },
        { ...nextState, isBot: true },
      ]);
    },
    [botStateMachine]
  );

  const handleMainMenuClick = useCallback(() => {
    if (botStateMachine.state === STATE_STOCK_EXCHANGE_SELECTION) {
      return;
    }

    const nextState = botStateMachine.reset();
    setChatEntries((prevChatEntries) => [...prevChatEntries, { ...nextState, isBot: true }]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatEntries]);

  return (
    <div className="w-4/5 h-5/6 flex flex-col border">
      <div className="bg-blue-700 p-4 py-5 text-white">
        <span>LSEG Chatbot</span>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-scroll flex flex-col gap-4 p-4">
        {chatEntries.map(({ message, options = [], isBot }, index, array) => {
          const canInteract = index === array.length - 1;

          return (
            <div
              key={index}
              className={`flex flex-col items-start divide-y p-1 ${isBot ? 'bg-blue-200 w-2/3' : 'bg-gray-200 ml-auto'}`}
            >
              <span className="p-1">{message}</span>
              {options?.map((option, optionIndex) => (
                <button
                  className={`bg-white p-1 w-full text-left ${canInteract ? 'hover:bg-blue-100 cursor-pointer' : ''}`}
                  disabled={!canInteract}
                  key={optionIndex}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        })}
      </div>
      <div className="bg-gray-200 p-4">
        <span>
          Please pick an option. You can go back to the{' '}
          <button className="text-blue-500 underline" onClick={handleMainMenuClick}>
            Main Menu
          </button>{' '}
          anytime.
        </span>
      </div>
    </div>
  );
}
