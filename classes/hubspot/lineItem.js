const axios = require('axios')
const { auth } = require('./auth.js')
const base = 'https://api.hubapi.com'

let LineItem = class {


    essentialProps = [
        'amount',
        'description',
        'discount',
        'name',
        'price',
        'product_type',
        'quantity',
        'recurringbillingfrequency',
        'tax',
        'term_months',
        'hs_term_in_months',
        'hs_total_discount',
        'hs_sku',
        'hs_line_item_currency_code',
    ]
    constructor() {

    }

    async load(id) {

        let config = await auth.getConfig()
        let propList = this.essentialProps.join(',')
        let urlContact = base + '/crm/v3/objects/line_items/' + id + '?properties=' + propList
        let res = await axios.get(urlContact, config)

        this.data = res.data.properties
        for (let i = 0; i < this.essentialProps.length; i++) {
            let prop = this.essentialProps[i]
            if (this.data[prop] == null) { //checking for null or undefined
                this.data[prop] = ''
            }
        }
    }

    async save() {

        let config = await auth.getConfig()

        let urlContact = base + '/crm/v3/objects/line_items/' + this.data.hs_object_id

        let props = {}
        for (let i = 0; i < this.essentialProps.length; i++) {
            let prop = this.essentialProps[i]
            props[prop] = this.data[prop]
        }

        // return true
        let res = axios.patch(urlContact, { "properties": props }, config)

        return res.then(payload => {
            console.log(payload.data)
            return true
        }).catch(err => {
            console.log(err)
            return false
        })

    }

}

exports.LineItem = LineItem


// Line items
// 'amount',
// 'createdate',
// 'description',
// 'discount',
// 'feedback_rounds',
// 'hs_acv',
// 'hs_all_accessible_team_ids',
// 'hs_all_assigned_business_unit_ids',
// 'hs_all_owner_ids',
// 'hs_all_team_ids',
// 'hs_allow_buyer_selected_quantity',
// 'hs_arr',
// 'hs_cost_of_goods_sold',
// 'hs_created_by_user_id',
// 'hs_createdate',
// 'hs_discount_percentage',
// 'hs_external_id',
// 'hs_images',
// 'hs_lastmodifieddate',
// 'hs_line_item_currency_code',
// 'hs_margin',
// 'hs_margin_acv',
// 'hs_margin_arr',
// 'hs_margin_mrr',
// 'hs_margin_tcv',
// 'hs_merged_object_ids',
// 'hs_mrr',
// 'hs_object_id',
// 'hs_position_on_quote',
// 'hs_pre_discount_amount',
// 'hs_product_id',
// 'hs_recurring_billing_end_date',
// 'hs_recurring_billing_number_of_payments',
// 'hs_recurring_billing_period',
// 'hs_recurring_billing_start_date',
// 'hs_recurring_billing_terms',
// 'hs_sku',
// 'hs_sync_amount',
// 'hs_tcv',
// 'hs_term_in_months',
// 'hs_total_discount',
// 'hs_unique_creation_key',
// 'hs_updated_by_user_id',
// 'hs_url',
// 'hs_user_ids_of_all_notification_followers',
// 'hs_user_ids_of_all_notification_unfollowers',
// 'hs_user_ids_of_all_owners',
// 'hs_variant_id',
// 'hubspot_owner_assigneddate',
// 'hubspot_owner_id',
// 'hubspot_team_id',
// 'monthly_ad_spend',
// 'name',
// 'price',
// 'product_type',
// 'quantity',
// 'recurringbillingfrequency',
// 'tax',
// 'term_months',
// 'xero_sales_account_code'