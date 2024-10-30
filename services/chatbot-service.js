export const STATE_STOCK_EXCHANGE_SELECTION = 'stock-exchange-selection';
export const STATE_STOCK_SELECTION = 'stock-selection';
export const STATE_STOCK_PRICE = 'stock-price';

const stockExchangeData = {
  'London Stock Exchange': {
    code: 'LSE',
    stockExchange: 'London Stock Exchange',
    topStocks: {
      'CRODA INTERNATIONAL PLC': {
        code: 'CRDA',
        stockName: 'CRODA INTERNATIONAL PLC',
        price: 4807.0,
      },
      'GSK PLC': {
        code: 'GSK',
        stockName: 'GSK PLC',
        price: 1574.8,
      },
      'ANTOFAGASTA PLC': {
        code: 'ANTO',
        stockName: 'ANTOFAGASTA PLC',
        price: 1746.0,
      },
      'FLUTTER ENTERTAINMENT PLC': {
        code: 'FLTR',
        stockName: 'FLUTTER ENTERTAINMENT PLC',
        price: 16340.0,
      },
      'BARRATT DEVELOPMENTS PLC': {
        code: 'BDEV',
        stockName: 'BARRATT DEVELOPMENTS PLC',
        price: 542.6,
      },
    },
  },
  'New York Stock Exchange': {
    code: 'NYSE',
    stockExchange: 'New York Stock Exchange',
    topStocks: {
      'Ashford Hospitality Trust': {
        code: 'AHT',
        stockName: 'Ashford Hospitality Trust',
        price: 1.72,
      },
      'Kuke Music Holding Ltd': {
        code: 'KUKE',
        stockName: 'Kuke Music Holding Ltd',
        price: 1.2,
      },
      'Ashland Inc.': {
        code: 'ASH',
        stockName: 'Ashland Inc.',
        price: 93.42,
      },
      'Nomura Holdings Inc.': {
        code: 'NMR',
        stockName: 'Nomura Holdings Inc.',
        price: 5.84,
      },
      'LendingClub Corp': {
        code: 'LC',
        stockName: 'LendingClub Corp',
        price: 9.71,
      },
    },
  },
  'NASDAQ Stock Exchange': {
    code: 'NASDAQ',
    stockExchange: 'NASDAQ Stock Exchange',
    topStocks: {
      'Advanced Micro Devices, Inc.': {
        code: 'AMD',
        stockName: 'Advanced Micro Devices, Inc.',
        price: 164.21,
      },
      'Tesla, Inc.': {
        code: 'TSLA',
        stockName: 'Tesla, Inc.',
        price: 190.35,
      },
      'SoFi Technologies, Inc.': {
        code: 'SOFI',
        stockName: 'SoFi Technologies, Inc.',
        price: 8.24,
      },
      'Paramount Global': {
        code: 'PARA',
        stockName: 'Paramount Global',
        price: 14.92,
      },
      'Alphabet Inc.': {
        code: 'GOOGL',
        stockName: 'Alphabet Inc.',
        price: 141.91,
      },
    },
  },
};

export const botStateConfig = {
  [STATE_STOCK_EXCHANGE_SELECTION]: () => ({
    message: 'Please select a Stock Exchange.',
    options: [...Object.values(stockExchangeData).map(({ stockExchange }) => stockExchange)],
  }),
  [STATE_STOCK_SELECTION]: (input) => {
    const stockExchange = stockExchangeData[input];
    if (!stockExchange) {
      throw new Error('Invalid stock exchange');
    }

    return {
      message: 'Please select a stock.',
      options: Object.values(stockExchange.topStocks).map(({ stockName }) => stockName),
    };
  },
  [STATE_STOCK_PRICE]: (input, initialStockExchange) => {
    const stockExchange = stockExchangeData[initialStockExchange];
    if (!stockExchange) {
      throw new Error('Invalid stock exchange');
    }
    const stock = stockExchange.topStocks[input];
    if (!stock) {
      throw new Error('Invalid stock');
    }

    return {
      message: `Stock price of ${stock.stockName} is ${stock.price}. Please select an option.`,
      options: ['Main Menu', 'Go Back'],
    };
  },
};

const INITIAL_STATE = botStateConfig[STATE_STOCK_EXCHANGE_SELECTION]();

export const botStateMachine = {
  state: STATE_STOCK_EXCHANGE_SELECTION, // initial state
  stockExchange: null,

  transition(input) {
    switch (this.state) {
      case STATE_STOCK_EXCHANGE_SELECTION:
        try {
          const config = botStateConfig[STATE_STOCK_SELECTION](input);
          this.stockExchange = input;
          this.state = STATE_STOCK_SELECTION;

          return config;
        } catch {
          return INITIAL_STATE;
        }

      case STATE_STOCK_SELECTION:
        try {
          const config = botStateConfig[STATE_STOCK_PRICE](input, this.stockExchange);
          this.state = STATE_STOCK_PRICE;

          return config;
        } catch {
          return botStateConfig[STATE_STOCK_SELECTION](this.stockExchange);
        }

      case STATE_STOCK_PRICE:
        if (input === 'Go Back') {
          this.state = STATE_STOCK_SELECTION;
          return botStateConfig[STATE_STOCK_SELECTION](this.stockExchange);
        }

        return this.reset();

      default:
        return this.reset();
    }
  },

  reset() {
    this.state = STATE_STOCK_EXCHANGE_SELECTION;
    this.stockExchange = null;

    return INITIAL_STATE;
  },
};
