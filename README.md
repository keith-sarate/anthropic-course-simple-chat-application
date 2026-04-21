# Anthropic Course — Simple Chat Application

This project is part of the **Anthropic API course**. The goal is to understand the basics of making a request to Claude using the Anthropic SDK — specifically the `messages.create` call with `model`, `max_tokens`, and `messages` parameters — and displaying the response.

`model` - The name of the Claude model you want to use;

`max_tokens` - A safety limit on response length (not a target);

`messages` - The conversation history you're sending to Claude;

`system` - System prompts provide Claude guidance on how to respond, Shape Claude'stone, style, and approach to match your specific use case;

## Structure

```
pages/
  index.js        # Chat UI
  api/
    chat.js       # Backend route that calls the Anthropic API
.env.local        # Place your ANTHROPIC_API_KEY here
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
