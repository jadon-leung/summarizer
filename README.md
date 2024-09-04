# summarizer
 
Sometimes we don't want to read an entire article, blog, webpage, or whatever it may be. Enter Summarizer (or SummarizerGPT according to my JSON). I built this simple extension using Node.js, HTML/CSS, JavaScript, Google's sidePanel, and OpenAi's Chat Completion API. 

## Challenges and Future Implementations
1. Figured out a way around the token limit. If I am trying to summarize a whole page's worth of content, I may exceed the API token limit. I found a way around this by segmenting the innerHTML into paragraphs and then passing it into OpenAI's API.

2. Depending on the website, there may be unreadable and/or security features that prevent the summarizer from working (e.g. encountered an issue with i-frames which basically prevented the extension from accessing Google docs). In the future, I may play around with Google Docs API to fix this.

3. Lastly, I plan on implementing a translation feature and a feature where users can select the length and vocabulary level of the summary.
