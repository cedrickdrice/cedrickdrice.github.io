export function onInit(lines) {
    if (lines != null) {
    lines.forEach(function (line) {
    line.record["Component_Custom_Total__c"] = 0;
    });
    }
    console.log('TEST TEST TEST');
    };
    
    export function onAfterCalculate(quoteModel, quoteLines) {
        console.log('onAfterCalculate 4');
        debugger;
    if (quoteLines != null) {
    quoteLines.forEach(function (line) {
    var parent = line.parentItem;
    if (parent != null) {
    var pComponentCustomTotal = parent.record["Component_Custom_Total__c"] || 0;
    var cListPrice = line.ProratedListPrice__c || 0;
    var cQuantity = line.Quantity__c == null ? 1 : line.Quantity__c;
    var cPriorQuantity = line.PriorQuantity__c || 0;
    var cPricingMethod = line.PricingMethod__c == null ? "List" : line.PricingMethod__c;
    var cDiscountScheduleType = line.DiscountScheduleType__c || '';
    var cRenewal = line.Renewal__c || false;
    var cExisting = line.Existing__c || false;
    var cSubscriptionPricing = line.SubscriptionPricing__c || '';
    
    var cTotalPrice = getTotal(cListPrice, cQuantity, cPriorQuantity, cPricingMethod, cDiscountScheduleType, cRenewal, cExisting, cSubscriptionPricing, cListPrice);
    pComponentCustomTotal += cTotalPrice;
    
    parent.record["Component_Custom_Total__c"] = pComponentCustomTotal;
    }
    });
    }
    };
    
    function getTotal(price, qty, priorQty, pMethod, dsType, isRen, isExist, subPricing, listPrice) {
    if ((isRen === true) && (isExist === false) && (priorQty == null)) {
    // Personal note: In onAfterCalculate, we specifically make sure that priorQuantity can't be null.
    // So isn't this loop pointless?
    return 0;
    } else {
    return price * getEffectiveQuantity(qty, priorQty, pMethod, dsType, isRen, isExist, subPricing, listPrice);
    }
    }
    
    function getEffectiveQuantity(qty, priorQty, pMethod, dsType, isRen, exists, subPricing, listPrice) {
    var delta = qty - priorQty;
    
    if (pMethod == 'Block' && delta == 0) {
    return 0;
    } else if (pMethod == 'Block') {
    return 1;
    } else if (dsType == 'Slab' && (delta == 0 || (qty == 0 && isRen == true))) {
    return 0;
    } else if (dsType == 'Slab') {
    return 1;
    } else if (exists == true && subPricing == '' && delta < 0) {
    return 0;
    } else if (exists == true && subPricing == 'Percent Of Total' && listPrice != 0 && delta >= 0) {
    return qty;
    } else if (exists == true) {
    return delta;
    } else {
    return qty;
    }
}