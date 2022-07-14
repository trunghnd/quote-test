// const axios = require('axios')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
let serverUrl = process.env.SERVER_URL
let intervalMap={
    monthly : 'month',
    yearly : 'year',    
    weekly : 'week',
    daily : 'day',
}
let Session = class {

    constructor() {
    }

    async loadFromQuote(order) {    
        let mode = 'payment'
        let lineItemsStripe = []
        for(let i=0;i<order.lineItems.length;i++){
            let lineItem = order.lineItems[i]['data']
            let lineItemStripe = {
                price_data:{
                    currency:lineItem.hs_line_item_currency_code,
                    unit_amount:lineItem.price *100,
                    product_data:{
                        name:lineItem.name,
                    }
                },
                quantity:lineItem.quantity
            }

            if(lineItem.recurringbillingfrequency){
                lineItemStripe.price_data.recurring ={
         
                    interval: intervalMap[lineItem.recurringbillingfrequency],
                    // interval_count: lineItem.term_months,

                  }
                  mode = 'subscription'
            }
            lineItemsStripe.push(lineItemStripe)
        }
        
        const session = await stripe.checkout.sessions.create({
            success_url: serverUrl + '/success',
            cancel_url: 'https://welcome.advisible.com.au/'+order.data.hs_slug,
            line_items: lineItemsStripe,
            mode: mode,
            payment_method_types: ['card','au_becs_debit'],
            customer_email: order.contacts[0]['data']['email']

        })

        this.data = session
    }


}

exports.Session = Session





