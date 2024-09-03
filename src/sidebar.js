document.getElementById('summarizeBtn').addEventListener('click', async () => {
    try {
        // Get the content of the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getContent,
        }, async (results) => {
            try {
                if (results && results[0] && results[0].result) {
                    const content = results[0].result;
                    const sections = content.split('\n\n'); // Break content into sections or paragraphs
                    
                    let summary = '';
                    for (let section of sections) {
                        try {
                            // Summarize each section separately
                            const sectionSummary = await getSummary(section);
                            summary += sectionSummary + '\n\n';
                        } catch (err) {
                            console.error("Error summarizing a section:", err);
                            break; // Stop processing if there's an error
                        }
                    }
                    
                    // Display the summary in the side panel
                    document.getElementById('chat-log').innerText = summary;
                } else {
                    throw new Error("Failed to extract content from the active tab.");
                }
            } catch (err) {
                console.error("Error in executing script or fetching summary:", err);
                document.getElementById('chat-log').innerText = "An error occurred while summarizing the content.";
            }
        });

    } catch (err) {
        console.error("Error fetching active tab or executing script:", err);
        document.getElementById('chat-log').innerText = "An error occurred. Please try again.";
    }
});

// Function to extract text content from the webpage
function getContent() {
    try {
        return document.body.innerText;
    } catch (err) {
        console.error("Error extracting content:", err);
        throw new Error("Failed to extract content from the webpage.");
    }
}

// Function to call the ChatGPT API and get a summary
async function getSummary(content) {
    try {
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
                    { role: "user", content: `Summarize the following content:\n\n${content}. Use around 500 words and be descriptive` }
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (err) {
        console.error("Error calling ChatGPT API:", err);
        throw new Error("Failed to get a summary from the ChatGPT API.");
    }
}
