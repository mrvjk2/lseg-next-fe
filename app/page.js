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
    <div className="w-4/5 h-4/5 flex flex-col">
      <div
        ref={chatContainerRef}
        className="flex-1 bg-blue-300 overflow-y-scroll flex flex-col gap-4 p-4"
      >
        {chatEntries.map(({ message, options = [], isBot }, index, array) => (
          <div
            key={index}
            className={`flex flex-col items-start gap-2 p-4 bg-white ${!isBot ? 'ml-auto' : ''}`}
          >
            <span className={`${options?.length ? 'mb-4' : ''}`}>{message}</span>
            {options?.map((option, optionIndex) => (
              <button
                disabled={index !== array.length - 1}
                key={optionIndex}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ))}
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
