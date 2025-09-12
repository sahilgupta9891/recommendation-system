const { GoogleGenAI } = require("@google/genai");
const { fetchFromAPI, fetchFromAPIByCategory, fetchFromAPIByManufacture, fetchFromAPIByName } = require("../../utilis/fatchtool");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
class QueryResponse {
  async foroneproduct(req, res) {
    const { query, id } = req.body;

    try {
      const idPrompt = `
You are given a user query that may contain a product ID.

USER QUERY: "${query}"

Task:
- Extract ONLY the product ID (nothing else).
- Example format: "671e6f1a9b1c9c0e8b5b3z01"
- Do not include extra text, labels, or explanations.

Output: just the product ID.
`;
      const idResponse = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: idPrompt,
      });
      const productId = idResponse.text.match(/[a-fA-F0-9]{24}/)?.[0];
      const data = await fetchFromAPI(`${productId}`);
      const prompt = `
You are given:
1. A user query: "${query}"
2. Product data: ${JSON.stringify(data)}

Task:
- Read the user query carefully.
- Use the product data to answer the query.
- If the query asks about product details, fetch them from the provided data.
- Respond naturally and directly to the user.

Final Output: a clear answer to the user query.
`;

      const response = await ai.models.generateContent({
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





  
  async forcategory(req, res) {
    const { query } = req.body;

    try {
      const categoryPrompt = `
You are given a user query that contains information about a product category.

USER QUERY: "${query}"

Task:
- Extract ONLY the product category from the query.
- Do not include extra words like "category:", "the product is", etc.
- Example output: milk, 5G smartphones, laptops under $500

Output: just the product category.
`;
      const categoryResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: categoryPrompt,
      });

      const category = categoryResponse.text.trim();
      const data = await fetchFromAPIByCategory(`${category}`);
      const prompt = `
You are given:
1. A user query: "${query}"
2. Product data: ${JSON.stringify(data)}

Task:
- Read the user query carefully.
- Use the provided product data to answer it.
- Include relevant product details.
- Respond naturally and directly to the user.

Final Output: a clear, helpful answer to the user’s query.
`;

      const response = await ai.models.generateContent({
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
    const { query} = req.body;

    try {
     const manufacturerPrompt = `
You are given a user query that contains information about a product manufacturer.

USER QUERY: "${query}"

Task:
- Extract ONLY the manufacturer name from the query.
- Do not include extra words like "manufacturer:", "produced by", etc.
- Example output: Amul, Sony, Dell

Output: just the manufacturer name.
`;
const manufacturerResponse = await ai.models.generateContent({
  model: "gemini-1.5-flash",
  contents: manufacturerPrompt,
});


const manufacturer = manufacturerResponse.text.trim();
const data = await fetchFromAPIByManufacture(`${manufacturer}`);


const prompt = `
You are given:
1. A user query: "${query}"
2. Product data: ${JSON.stringify(data)}

Task:
- Read the user query carefully.
- Use the provided product data to answer it.
- Include relevant product details.
- Respond naturally and directly to the user.

Final Output: a clear, helpful answer to the user's query.
`;

      const response = await ai.models.generateContent({
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
    const { query} = req.body;
    try {
     const productNamePrompt = `
You are given a user query that contains the name or variety of a product.

USER QUERY: "${query}"

Task:
- Extract ONLY the exact product name or variety mentioned in the query.
- Do not include extra words like "product name:", "the", "give me", etc.
- Example output: Amul Gold Full Cream Milk, Coca Cola Zero 500ml

Output: just the product name.
`;
const productNameResponse = await ai.models.generateContent({
  model: "gemini-1.5-flash",
  contents: productNamePrompt,
});
const productName = productNameResponse.text.trim();


const data = await fetchFromAPIByName(`${productName}`);

const prompt = `
You are given:
1. A user query: "${query}"
2. Product data: ${JSON.stringify(data)}

Task:
- Answer the user's query directly using the product data.
- Be specific, clear, and relevant.
- If details like price, ingredients, quantity, or expiry are available, include them.

Final Output: a helpful, user-friendly response.
`;


      const response = await ai.models.generateContent({
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
}

class QueryResponseHandler {
  async queryresponse(req, res) {
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
      const filteredQuery = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: promptContent,
      });
      const categoryNumber = filteredQuery.text.trim();
      async function response(categoryNumber) {
        switch (categoryNumber) {
          case "1":
            return await new QueryResponse().foroneproduct(req, res);
          case "2":
            return await new QueryResponse().forcategory(req, res);
          case "3":
            return await new QueryResponse().formanufacture(req, res);
          case "4":
            return await new QueryResponse().particularvarityofproduct(req,res);
          default:
            return await new QueryResponse().particularvarityofproduct(req,res);
        }
      }
      response(categoryNumber);
    } catch (error) {
      console.error("Error processing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new QueryResponseHandler();
