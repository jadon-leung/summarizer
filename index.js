import OpenAI from "openai";

const openai = new OpenAI({
    organization: 'org-EKMJOl4XH1a5j2yePj6IEsxy',
    // project: 'summarizer',
    apiKey: "sk-Qfs7-3BxDRbL3yaH-bmhl16i91RU7FM3NMk60u5IUNT3BlbkFJDzkha2XQ6sGFkVtBRptmz0Vfii7dr4clp1UjhI9EcA"
});

// const completion = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [
//         {role: "user", content: "Hello World"},
//     ]
// })

// console.log(completion.data.choices[0].messages)