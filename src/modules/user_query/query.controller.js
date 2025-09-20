const { GoogleGenAI } = require("@google/genai");
const cosineSimilarity = require("compute-cosine-similarity");
const { fetchFromAPIforALL } = require("../../utilis/fatchtool");
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

let product_vectors = [];
let products = [];
async function fetchProductEmbeddings() {
  const resp = await fetchFromAPIforALL();
if (Array.isArray(resp.products)) {
  products = resp.products;
} else if (Array.isArray(resp.data?.products)) {
  products = resp.data.products;
} else if (Array.isArray(resp)) {
  products = resp;
} else {
  products = [resp];
}


const productTexts = products.map(p => {
  const nameText = p.name || '';
  const descriptionText = Array.isArray(p.description) ? p.description.join('. ') : '';
  const manufactureText = Array.isArray(p.manufactureDetails) ? p.manufactureDetails.map(m => m.name).join(', ') : '';
  const categoryText = Array.isArray(p.categoryDetails) ? p.categoryDetails.map(c => c.name).join(', ') : '';
  const ingredientsText = Array.isArray(p.indigrents) ? p.indigrents.join(', ') : '';
  const nutrientsText = Array.isArray(p.nutrients) ? p.nutrients.join(', ') : '';

  return `${nameText}. ${descriptionText}. Manufacturer: ${manufactureText}. Category: ${categoryText}. Ingredients: ${ingredientsText}. Nutrients: ${nutrientsText}`;
});



  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: productTexts,
    taskType: 'RETRIEVAL_DOCUMENT'
  });
  product_vectors = response.embeddings.map(e => e.values);
}

// Endpoint
async function embeddingsForAllProducts(req, res) {
  try {
    const { query } = req.body;
    if (product_vectors.length === 0) {
      await fetchProductEmbeddings();
    }
    const queryResponse = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: [query],
      taskType: 'RETRIEVAL_QUERY'
    });
    const query_vector = queryResponse.embeddings[0].values;

  const scoredProducts = products.map((product, i) => {
  const score = cosineSimilarity(query_vector, product_vectors[i]);
  return {
    ...product,
    score: (typeof score === "number" ? score : -1) 
  };
});


   const topProducts = scoredProducts
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
    return res.status(200).json({
      message: "Top products retrieved successfully",
      topProducts
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { embeddingsForAllProducts };

