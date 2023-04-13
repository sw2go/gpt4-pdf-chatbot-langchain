import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';

const lang = 1;   // 0 = EN, 1 = DE


const CONDENSE_PROMPT_TEXT = [
`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`,

`Gegeben ist die folgende Unterhaltung und eine Folgefrage. Formuliere die Folgefrage um, so dass sie eine eigenständige Frage wird.

Chat-Verlauf:
{chat_history}
Folgefrage: {question}
Eigenständige Frage:`
]

const QA_PROMPT_TEXT = [

`You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

Question: {question}
=========
{context}
=========
Answer in Markdown:`,

`Du bist ein KI-Assistent, der hilfreiche Ratschläge gibt. 
Dir werden folgende auszugsweise Teile eines langen Dokuments und eine Frage gegeben. 
Gib eine konversationsbasierte Antwort basierend auf dem bereitgestellten Kontext.
Stelle bitte nur Hyperlinks bereit, die sich auf den untenstehenden Kontext beziehen. Bitte erfinde keine Hyperlinks.
Falls du die Antwort im untenstehenden Kontext nicht finden kannst, sage einfach "Hmm, ich bin mir nicht sicher." Versuche nicht, eine Antwort zu erfinden.
Falls die Frage nicht mit dem Kontext zusammenhängt, antworte höflich, dass du darauf abgestimmt bist, nur Fragen zu beantworten, die mit dem Kontext zusammenhängen.
  
Frage: {question}
=========
{context}
=========
Antworte in Markdown:`

]

const CONDENSE_PROMPT = PromptTemplate.fromTemplate(CONDENSE_PROMPT_TEXT[lang]);

const QA_PROMPT = PromptTemplate.fromTemplate(QA_PROMPT_TEXT[lang],);

export const makeChain = (
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0,
      modelName: 'gpt-3.5-turbo', //  'gpt-3.5-turbo'  'gpt-4'        change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
              onTokenStream(token);
              console.log(token);
            },
          })
        : undefined,
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
    k: 2, //number of source documents to return
  });
};
