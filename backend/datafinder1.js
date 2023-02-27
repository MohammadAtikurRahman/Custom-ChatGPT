  function getDeliveryPrice(weight) {
      // Find the delivery rule that matches the weight
      const deliveryRule = deliveryDataArray.find(rule => {
      
      
      
        if (rule.operator === '<') {
          return weight < rule['weight-dl'];
        } else if (rule.operator === '=') {
          return weight == rule['weight-dl'];
        }



      });
      
      // If a matching rule was found, return the delivery price
      if (deliveryRule) {
        return deliveryRule.deliveryPrice;
      } else {
        return 'No delivery price found for weight ' + weight;
      }
    }
    
    console.log(getDeliveryPrice(10)); // Output: 22