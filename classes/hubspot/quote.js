const axios = require('axios')
const { auth } = require('./auth.js')
const { LineItem } = require('./lineItem.js')
const { Contact } = require('./contact.js')
const { Deal } = require('./deal.js')
const base = 'https://api.hubapi.com'

let Quote = class {


    essentialProps = [

        'hs_quote_amount',
        // 'hs_payment_status',
        'hs_quote_number',
        'hs_slug',


    ]

    lineItems = []
    contacts = []
    constructor() {

    }

    async load(id) {

        let config = await auth.getConfig()
        let propList = this.essentialProps.join(',')
        let url = base + '/crm/v3/objects/quotes/' + id + '?properties=' + propList
        let res = await axios.get(url, config)

        this.data = res.data.properties
        for (let i = 0; i < this.essentialProps.length; i++) {
            let prop = this.essentialProps[i]
            if (this.data[prop] == null) { //checking for null or undefined
                this.data[prop] = ''
            }
        }

        //load line items

        let urlLineItems = base + '/crm/v4/objects/quotes/' + id + '/associations/line_items'
        let resLineItems = await axios.get(urlLineItems, config)
        let dataLineItems = resLineItems.data.results
        for (let i = 0; i < dataLineItems.length; i++) {
            let lineItemId = dataLineItems[i]['toObjectId']
            let lineItem = new LineItem()
            await lineItem.load(lineItemId)
            this.lineItems.push(lineItem)
        }


        //load line contacts

        let urlContacts = base + '/crm/v4/objects/quotes/' + id + '/associations/contacts'
        let resContacts = await axios.get(urlContacts, config)
        let dataContacts = resContacts.data.results
        for (let i = 0; i < dataContacts.length; i++) {
            let contactId = dataContacts[i]['toObjectId']
            let contact = new Contact()
            await contact.load(contactId)
            this.contacts.push(contact)
        }

        //load line deal

        let urlDeals = base + '/crm/v4/objects/quotes/' + id + '/associations/deals'
        let resDeals = await axios.get(urlDeals, config)
        let dataDeals = resDeals.data.results
        if (dataDeals.length > 0) {
            let dealId = dataDeals[0]['toObjectId']
            let deal = new Deal()
            await deal.load(dealId)
            this.deal = deal
        }else{
            this.deal = false
        }

    }

    async save() {

        let config = await auth.getConfig()

        let urlContact = base + '/crm/v3/objects/quotes/' + this.data.hs_object_id

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
    static async search(key, value, operator = 'EQ') {

        let config = await auth.getConfig()
        let url = base + '/crm/v3/objects/quotes/search'
        let data = {
            "filterGroups": [
                {
                    "filters": [
                        {
                            "propertyName": key,
                            "operator": operator,
                            "value": value
                        }]
                }]
        }
        let res = await axios.post(url, data, config)
        console.log(res.data)
        if (res.data.total >= 1) {
            let quoteId = res.data.results[0]['id']
            let quote = new Quote()
            await quote.load(quoteId)
            return quote
        } else {
            return false
        }


    }

}

exports.Quote = Quote

// 'hs_all_assigned_business_unit_ids',
// 'hs_allowed_payment_methods',
// 'hs_approver_id',
// 'hs_collect_billing_address',
// 'hs_created_by_user_id',
// 'hs_createdate',
// 'hs_domain',
// 'hs_esign_date',
// 'hs_expiration_template_path',
// 'hs_feedback',
// 'hs_language',
// 'hs_lastmodifieddate',
// 'hs_line_item_global_term_hs_discount_percentage',
// 'hs_line_item_global_term_hs_discount_percentage_enabled',
// 'hs_line_item_global_term_hs_recurring_billing_period',
// 'hs_line_item_global_term_hs_recurring_billing_period_enabled',
// 'hs_line_item_global_term_hs_recurring_billing_start_date',
// 'hs_line_item_global_term_hs_recurring_billing_start_date_enabled',
// 'hs_line_item_global_term_recurringbillingfrequency',
// 'hs_line_item_global_term_recurringbillingfrequency_enabled',
// 'hs_locale',
// 'hs_locked',
// 'hs_merged_object_ids',
// 'hs_object_id',
// 'hs_payment_date',
// 'hs_payment_status',
// 'hs_payment_type',
// 'hs_pdf_download_link',
// 'hs_proposal_domain',
// 'hs_proposal_slug',
// 'hs_proposal_template_path',
// 'hs_public_url_key',
// 'hs_quote_total_preference',
// 'hs_sender_image_url',
// 'hs_slug',
// 'hs_template_type',
// 'hs_test_mode',
// 'hs_unique_creation_key',
// 'hs_updated_by_user_id',
// 'hs_user_ids_of_all_notification_followers',
// 'hs_user_ids_of_all_notification_unfollowers',
// 'hs_user_ids_of_all_owners',
// 'hubspot_owner_assigneddate',
// 'hs_sender_company_name',
// 'hs_sender_firstname',
// 'hs_title',
// 'hs_expiration_date',
// 'hs_sender_company_domain',
// 'hs_sender_lastname',
// 'hs_comments',
// 'hs_sender_company_address',
// 'hs_sender_email',
// 'hs_sender_company_address2',
// 'hs_sender_phone',
// 'hs_terms',
// 'hs_logo_url',
// 'hs_sender_company_city',
// 'hs_sender_jobtitle',
// 'hs_sender_company_state',
// 'hs_show_signature_box',
// 'hs_primary_color',
// 'hs_sales_email_last_replied',
// 'hs_sender_company_zip',
// 'hs_show_countersignature_box',
// 'hubspot_owner_id',
// 'notes_last_contacted',
// 'notes_last_updated',
// 'notes_next_activity_date',
// 'num_contacted_notes',
// 'num_notes',
// 'hs_currency',
// 'hs_sender_company_country',
// 'hubspot_team_id',
// 'hs_all_owner_ids',
// 'hs_sender_company_image_url',
// 'hs_timezone',
// 'hs_all_team_ids',
// 'hs_payment_enabled',
// 'hs_all_accessible_team_ids',
// 'hs_esign_enabled',
// 'hs_num_associated_deals',
// 'hs_esign_num_signers_required',
// 'hs_template',
// 'hs_esign_num_signers_completed',
// 'hs_quote_amount',
// 'hs_status',
// 'hs_quote_number',
// 'hs_collect_shipping_address'

