import OpenAI from "oepnai";

const openai = new OpenAI({
    organization: 'org-EKMJOl4XH1a5j2yePj6IEsxy',
    project: 'summarizer',
});


document.getElementById('summarizeBtn').addEventListener('click', async () => {
    // Get the content of the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getContent,
    }, async (results) => {
      if (results && results[0] && results[0].result) {
        const content = results[0].result;
  
        // Now send this content to the ChatGPT API for summarization
        const summary = await getSummary(content);
        
        // Display the summary in the side panel
        document.getElementById('summary').innerText = summary;
      }
    });
  });
  
  // Function to extract text content from the webpage
  function getContent() {
    return document.body.innerText;
  }
  
  // Function to call the ChatGPT API and get a summary
  async function getSummary(content) {
    const apiKey = 'sk-SHo3X0YX6jQAOX8Fx6lLWOUcjKTffuSpi2oRQfFgkhT3BlbkFJHAo-nfaMENaPYDXAuDCoqADRGIiiosmKgckoE4TowA'; // Replace with your OpenAI API key
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Summarize the following content:\n\n${content}\n\nSummary:`,
        max_tokens: 150,
        n: 1,
        stop: ['\n'],
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
    return data.choices[0].text.trim();
  }
  