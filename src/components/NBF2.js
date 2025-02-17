// Client Information

import Clients from './Clients'
import NewClient from './NewClient'

import {useState, useEffect} from 'react'
import { useAuth } from "../hooks/useAuth"
import {ROOT_URL} from '../constants'
const NBF2 = ({client,setClient, onNextClicked, onPrevClicked, forInsured=false}) => {
    const [clients, setClients] = useState([])

    const { user } = useAuth()
    useEffect(()=>{
        const getClients = async() =>{
            const possibleClients = await fetchClient(client.search_first_name, client.search_last_name)
            setClients(possibleClients)
        }
        getClients()
    },[])

    const fetchClient = async(first_name, last_name) =>{
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        let url = ROOT_URL+'/api/clients/'
        if(first_name!==''){
            url = url + '?first_name='+first_name
        } 
        if(last_name!==''){
            if(first_name===''){
              url = url+'?'
            }else{
              url=url+"&"
            }
            url = url + 'last_name='+last_name
        }
        const res = await fetch(url,{headers:headers})
        const data = await res.json()
        return data
    }


  return (
    <div>
        <h2>New Business Form -  {forInsured? ('Insured Information'):('Applicant Information')} </h2>
    {
      clients.length > 0?
        (<Clients clients={clients} client={client} setClient={setClient} onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} />):
        (<NewClient client={client} setClient={setClient} onNextClicked={onNextClicked} onPrevClicked={onPrevClicked}></NewClient>)
    }
    </div>
  )
}

export default NBF2