
function getDeliveryPrice(location, weight) {
    // Find the delivery rule that matches the location and weight
    const deliveryRule = deliveryDataArray.find(rule => {
      return rule.location === location && (
        (rule.operator === '<' && weight < rule['weight-dl']) ||
        (rule.operator === '=' && weight == rule['weight-dl'])
      );
    });
    
    // If a matching rule was found, return the delivery price
    if (deliveryRule) {
      return deliveryRule.deliveryPrice;
    } else {
      return `No delivery price found for location ${location} and weight ${weight}`;
    }
  }
  
  console.log(getDeliveryPrice('Shipping - Waiheke', 10)); // Output: 40
  console.log(getDeliveryPrice('Shipping - Bay of Plenty', 10)); // Output: 120
  