const axios = require('axios')
const { auth } = require('./auth.js')
const base = 'https://api.hubapi.com'

let Contact = class {


    essentialProps = [
        'firstname',
        'lastname',
        'email'
    ]
    constructor() {

    }

    async load(id) {    

        let config = await auth.getConfig()
        let propList = this.essentialProps.join(',')
        let urlContact = base + '/crm/v3/objects/contacts/'+id+'?properties='+propList
        let res = await axios.get(urlContact, config)

        this.data = res.data.properties
        for(let i = 0; i<this.essentialProps.length ;i++){
            let prop = this.essentialProps[i]
            if(this.data[prop] == null){ //checking for null or undefined
                this.data[prop] = ''
            }
        }
    }

    async save() {    

        let config = await auth.getConfig()
  
        let urlContact = base + '/crm/v3/objects/contacts/'+this.data.hs_object_id

        let props = {}
        for(let i = 0; i<this.essentialProps.length ;i++){
            let prop = this.essentialProps[i]
            props[prop] = this.data[prop]
        }

        // return true
        let res = axios.patch(urlContact,{"properties": props} ,config)

        return res.then(payload=>{
            console.log(payload.data)
            return true
        }).catch(err=>{
            console.log(err)
            return false
        })
 
    }

}

exports.Contact = Contact

