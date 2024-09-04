document.getElementById('summarizeBtn').addEventListener('click', async () => {
    try {
        // Get the content of the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getContent,
        }, async (results) => {
            if (results && results[0] && results[0].result) {
                const content = results[0].result;
                const sections = content.split('\n\n'); // Split content into sections

                let summary = '';
                for (let section of sections) {
                    try {
                        // Introduce a delay between API requests to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                        
                        // Summarize each section separately
                        console.log("Extracted content: ", section);
                        const sectionSummary = await getSummary(section);
                        summary += sectionSummary + '\n\n';
                    } catch (err) {
                        console.error("Error summarizing a section:", err);
                        summary += "[Error summarizing this section]\n\n"; // Add a placeholder for the failed section
                    }
                }

                // Display the summary in the side panel
                document.getElementById('chat-log').innerText = summary;
            } else {
                console.error("Failed to extract content from the active tab.");
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

// Function to call the ChatGPT API and get a summary with rate limiting and retries
async function getSummary(content, retries = 3) {
    try {
        // const apiKey = put your api key here
        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        const response = await fetch(apiUrl, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: `Summarize the following content:\n\n${content}. Use around 500 words in your description of the content.` }
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            if (response.status === 429 && retries > 0) {
                // Handle rate limiting with exponential backoff
                const retryAfter = Math.pow(2, 3 - retries) * 1000; // 1s, 2s, 4s delay
                console.warn(`Rate limited. Retrying in ${retryAfter / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter));
                return getSummary(content, retries - 1);
            } else {
                console.error(`API request failed with status ${response.status}: ${response.statusText}`);
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (err) {
        console.error("Error calling ChatGPT API:", err);
        throw new Error("Failed to get a summary from the ChatGPT API.");
    }
}
