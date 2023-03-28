const levenshtein = require("fast-levenshtein");

if (message.startsWith("recom")) {
  const searchTerm = message.substring(5).trim();
  const minSimilarityThreshold = 0.2;

  // Define a function to calculate the similarity score
  function similarityScore(productName, searchTerm) {
    return (
      1 -
      levenshtein.get(productName, searchTerm) /
        Math.max(productName.length, searchTerm.length)
    );
  }

  const similarProducts = recomArray
    .map((product) => ({
      ...product,
      similarity: similarityScore(product.name, searchTerm),
    }))
    .filter((product) => product.similarity >= minSimilarityThreshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10);

  if (similarProducts.length > 0) {
    let botResponse = "\n\n" + "Similar products (up to 10):\n";

    for (const product of similarProducts) {
      botResponse += "- " + product.name + " (ref: " + product.ref + ")\n";
    }

    res.json({
      botResponse: botResponse,
    });
  } else {
    // Handle case when no similar products are found
    res.json({
      botResponse: "There are no similar products.",
    });
  }
} else {
  // Handle other types of messages
}
