## Getting Started

First, install the dependencies:
```bash
npm ci
# or
yarn
# or
pnpm ci
```

Now, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using the application

You can, by clicking, select one of the available options that the chatbot provides in its last message. You will be able to view the prices of the available stocks given as data. You can also go back to the main menu any time you want, just press on the **Main Menu** button at the bottom of the chat.

## Other considerations

I have updated the stock selection message by adding the current Stock Exchange name for better UX.

As time was limited during this challenge, I would for this app add the following details if more time was given:
1. Design completion (chatbot icons, rounded borders, etc.)
2. Responsiveness;
3. Handling of page 404.
4. If the data were to be sent from the backend, I would rate limit the amount of requests.

And also a few implementation details:
1. Rewrite the data JS object such that the keys of the Stock Exchanges and stocks are represented by the codes, not the names;
2. Use fontawesome for icons such as the chatbot icon and the *send message* button;
3. Cleanup remaining files created by the project initialization itself (such as unused svgs and stylings);
4. Update the project folder structure so that future pages can be added more easily (i.e. the pages folder).
