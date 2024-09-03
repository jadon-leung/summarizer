import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import punycode from 'punycode/punycode.js';

const openai = new OpenAI({
    organization: "org-EKMJOl4XH1a5j2yePj6IEsxy",
    apiKey: "sk-SELpgpnQtHUc0_S5OjifiZE11PbPKhd1I0EpPxAdUhT3BlbkFJQ0H4b1HxbVeHm-D-9hh0sazdrQN1PlAgCnnq38Lr0A"
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res) => {

    const {message} = req.body;
    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `${message}` }],
        stream: true,
    });

    let responseContent = '';

    for await (const chunk of stream) {
        const chunkContent = chunk.choices[0]?.delta?.content || '';
        responseContent += chunkContent;
        process.stdout.write(chunkContent);  // Optionally write to stdout
    }

    res.json({
        completion: responseContent
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
