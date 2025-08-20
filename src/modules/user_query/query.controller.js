const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

class QueryResponse {
  async foroneproduct(req, res){
    const { query, id}= req.body;

    try{
      const prompt =`
      You are give a product ID , user query and the content url 
      Product ID: ${id}
      task details: ${query}
      content url: ${process.env.CONTENT_URL+ id}
      Your task is to first fetch the product details from the content url and then generate a response based on the user query.
      Make sure to include the product details in your response.
      `
    
    const response = await ai.chats.completions.create({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    return res.status(200).json({
      message: "Query processed successfully",
      response: response.text,
    });
    }
    catch (error) {
      console.error("Error processing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async forcategory(req, res) {
    const { query, category } = req.body;

    try {
      const prompt = `
      You are given a product category , user query and the content url .
      Category: ${category}
      User Query: ${query}
      content url: ${process.env.CONTENT_URL + category}
      Your task is to  first fatch the product details from the content url and then generate a response based on the user query.
      `;

      const response = await ai.chats.completions.create({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      return res.status(200).json({
        message: "Query processed successfully",
        response: response.text,
      });
    } catch (error) {
      console.error("Error processing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async formanufacture(req, res) {
    const { query, manufacture } = req.body;

    try {
      const prompt = `
      You are given a product manufacture , user query and the content url .
      Manufacture: ${manufacture}
      User Query: ${query}
      content url: ${process.env.CONTENT_URL + manufacture}
      Your task is to first fetch the product details from the content url and then generate a response based on the user query.
      `;

      const response = await ai.chats.completions.create({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      return res.status(200).json({
        message: "Query processed successfully",
        response: response.text,
      });
    } catch (error) {
      console.error("Error processing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async particularvarityofproduct(req, res) {
    const { query, name  } = req.body;
    try {
         const prompt = `
      You are given a product name , user query and the content url .
      Name: ${name}
      User Query: ${query}
      content url: ${process.env.CONTENT_URL + name}
      Your task is to first fetch the product details from the content url and then generate a response based on the user query.
      `;

      const response = await ai.chats.completions.create({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      return res.status(200).json({
        message: "Query processed successfully",
        response: response.text,
      });
}
catch(error) {
      console.error("Error processing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
class QueryResponseHandler {
async  queryresponse(req, res) {
  const { query } = req.body;
  try {
    const promptContent = `
    You are a highly efficient query classification engine.
Your only job is to categorize the user's query and output the corresponding category number.

Here are the categories:
1: Single Product Query (e.g., "price of iPhone 15 Pro", "MacBook Air M3 review")
2: Product Category Query (e.g., "show me 5G smartphones", "laptops under $500")
3: Manufacturer Query (e.g., "latest products from Sony", "Dell monitors")
4: General or Other Query (e.g., "best tech for students", "what is a good gift")

---
Read the following user query and respond with ONLY the single digit number of the matching category.
Do not add any words, explanation, or punctuation. Your entire response must be a single number.

USER QUERY: "${query}"
`;
    const filteredQuery = await ai.chats.completions.create({
      model: "gemini-1.5-flash",
      contents: promptContent,
    });
    const categoryNumber= filteredQuery.text.trim();
    async  function response (categoryNumber){
      switch (categoryNumber) {
        case '1':
          return await new QueryResponse().foroneproduct(r, res);
        case '2':
          return await new QueryResponse().forcategory(req, res);
        case '3':
          return await new QueryResponse().formanufacture(req, res);
        case '4':
          return await new QueryResponse().particularvarityofproduct(req, res);
        default:
          return res.status(400).json({ error: "Invalid category number" });
      }
    }
    response(categoryNumber);

  }
  catch (error) {
    console.error("Error processing query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
}
module.exports = new QueryResponseHandler();
