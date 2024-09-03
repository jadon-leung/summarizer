
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
        document.getElementById('chat-log').innerText = summary;
      }
    });
  });
  
  // Function to extract text content from the webpage
  function getContent() {
    return document.body.innerText;
  }
  
  // Function to call the ChatGPT API and get a summary
  async function getSummary(content) {
    const apiKey = 'sk-SELpgpnQtHUc0_S5OjifiZE11PbPKhd1I0EpPxAdUhT3BlbkFJQ0H4b1HxbVeHm-D-9hh0sazdrQN1PlAgCnnq38Lr0A'; // Replace with your OpenAI API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Specify the model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: `Summarize the following content:\n\n${content}` }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
  