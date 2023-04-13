# GPT-4 & LangChain - A Chatbot for your german PDF Files

## Development

1. Clone the repo

```
git clone [github https url]
```

2. Install packages

```
npm install
```

3. Set up your `.env` file

- Copy `.env.example` into `.env`
  Your `.env` file should look like this:

```
OPENAI_API_KEY=

PINECONE_API_KEY=
PINECONE_ENVIRONMENT=

PINECONE_INDEX_NAME=

```

- Visit [openai](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to retrieve API keys and insert into your `.env` file.
- Visit [pinecone](https://pinecone.io/) create a index with 1536 dimensions and retrieve your API keys, your environment and index name from the dashboard to insert into your `.env` file.

4. In the `config` folder, replace the `PINECONE_NAME_SPACE` with a `namespace` where you'd like to store your embeddings on Pinecone when you run `pnpm run ingest`. This namespace will later be used for queries and retrieval.

5. In `utils/makechain.ts` chain change the `QA_PROMPT` for your own usecase. Change `modelName` in `new OpenAIChat` to `gpt-3.5-turbo`, if you don't have access to `gpt-4`. Please verify outside this repo that you have access to `gpt-4`, otherwise the application will not work with it.

## Convert your PDF files to embeddings

**This repo can load multiple PDF files**

1. Inside `docs` folder, add your pdf files or folders that contain pdf files.

2. Run the script `npm run ingest` to 'ingest' and embed your docs. If you run into errors troubleshoot below.

3. Check Pinecone dashboard to verify your namespace and vectors have been added.

## Run the app

Once you've verified that the embeddings and content have been successfully added to your Pinecone, you can run the app `npm run dev` to launch the local dev environment, and then type a question in the chat interface.

## Credit

This repo is a fork with little to no changes from [gpt4-pdf-chatbot-langchain](https://github.com/mayooear/gpt4-pdf-chatbot-langchain).

