import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import {useEffect, useState} from "react"
import { useAuth } from "../hooks/useAuth"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {ROOT_URL} from '../constants'
const BusinessDetailsInsurance = ({insurance, collectPayload ,writeAccess}) => {
    const { user } = useAuth()
    const [myInsurance, setMyInsurance] = useState(null)
    const [myPlan, setMyPlan] = useState(null)
    const [myPlanType, setMyPlanType] = useState(null)
    const [myProvider, setMyProvider] = useState(null)

    const [plans, setPlans] = useState(null)
    const [planTypes, setPlanTypes] = useState(null)
    const [providers, setProviders] = useState(null)


    const [editMode, setEditMode] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [updatePayload, setUpdatePayload] = useState({})

    useEffect(()=>{
        if(!editMode){
        const getPlan = async () => {
            const plan = await fetchObject(insurance.plan)
            const type = await fetchObject(insurance.plan_type)
            const provider = await fetchObject(insurance.provider)
            setMyInsurance(insurance)
            setMyPlan(plan)
            setMyPlanType(type)
            setMyProvider(provider)
        }

        const getAvailablePlans = async () => {
            const base = ROOT_URL+"/api/" 
            let url = base + "insuranceplan/"
            const plansResults = await fetchObject(url)
            const plans = plansResults['results']
            return plans    
        }

        const getAvailablePlanTypes = async () => {
            const base = ROOT_URL+"/api/"
            let url = base + "insuranceplantype/"
            const planTypesResults = await fetchObject(url)
            const planTypes = planTypesResults['results']
            return planTypes
        }

        const getAvailableProviders = async () => {
            const base = ROOT_URL+"/api/"
            let url = base + "insuranceprovider/"
            const providersResults = await fetchObject(url)
            const providers = providersResults['results']
            return providers
        }


        //getPlan().then((p)=>{
        //    }
        //)
        getPlan()

        getAvailablePlans().then((p)=>{
                setPlans(p)
            }   )
        getAvailablePlanTypes().then((p)=>{
                setPlanTypes(p)
            })
        getAvailableProviders().then((p)=>{
                setProviders(p)
            })
        }
        
        if(editMode){
          setBackgroundColor('lightblue')
          collectPayload('insuranceapplication', {...updatePayload, id:insurance.id})
        }
    }, [insurance, editMode, updatePayload])

    const fetchObject = async (url) =>{
        if(!url){
            return
        }
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        const res = await fetch(url,{headers:headers})
        const data = await res.json()
        return data
    }

    const handleChange = (event) => {
        setEditMode(true)
        let { name, value } = event.target
        switch(name){
            case 'myProvider':
                setMyProvider({...myProvider, id:value})
                setUpdatePayload({...updatePayload, provider:value})
            break
            case 'myPlan':
                setMyPlan({...myPlan, id:value})
                setUpdatePayload({...updatePayload, plan:value})
                break
            case 'myPlanType':
                setMyPlanType({...myPlanType, id:value})
                setUpdatePayload({...updatePayload, plan_type:value})
                break
            case 'FaceAmount':
                if(value.charAt(0)=== '$')
                    value = value.substring(1)
                setMyInsurance({...myInsurance, face_amount:value})
                setUpdatePayload({...updatePayload, face_amount:value})
                break
            case 'PlannedPremium':

                if(value.charAt(0)=== '$'){
                    value = value.substring(1)
                }
                setMyInsurance({...myInsurance, planned_premium:value})
                setUpdatePayload({...updatePayload, planned_premium:value})
                break

            default:
                break
        }
    }

    return (
        <div className="container" style={{backgroundColor}}>
            <h2>Insurance Information</h2>
            <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >


        <div>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Provider</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={myProvider? myProvider.id:''}
          label="Provider"
          name='myProvider'
          onChange={handleChange}
          disabled={!writeAccess}
        >
          {providers?providers.map((provider) => (
          <MenuItem key = {provider.id} value={provider.id}>
            {provider.insurance_provider_name}
          </MenuItem>
        )):''}
        </Select>
        </FormControl>
        </div>
<br></br>
        <div>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Plan</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={myPlan? myPlan.id:''}
          label="Plan"
          name='myPlan'
          onChange={handleChange}
          disabled={!writeAccess}
        >
          {plans?plans.map((plan) => (
          <MenuItem key = {plan.id} value={plan.id}>
            {plan.insurance_plan_name}
          </MenuItem>
        )):''}
        </Select>
        </FormControl>
        </div>
<br></br>
        <div>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Plan Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={myPlanType? myPlanType.id:''}
          label="Plan Type"
          name='myPlanType'
          onChange={handleChange}
          disabled={!writeAccess}
        >
          {planTypes?planTypes.map((planType) => (
          <MenuItem key = {planType.id} value={planType.id}>
            {planType.insurnace_plan_type_name}

          </MenuItem>
        )):''}
        </Select>
        </FormControl>
        </div>


            <div> 
                <TextField 
                id="standard-basic" 
                label="Face Amount" 
                variant="standard" 
                value={myInsurance ? (myInsurance.face_amount?'$'+myInsurance.face_amount:'') : ''}
                name="FaceAmount"
                onChange={handleChange}
                disabled={!writeAccess}
                /> 
                <TextField 
                id="standard-basic" 
                label="Planned Premium" 
                variant="standard" 
                value={myInsurance ? (myInsurance.planned_premium?'$'+myInsurance.planned_premium:'') : ''}
                name = "PlannedPremium"
                onChange={handleChange}
                disabled={!writeAccess}
                /> 
            </div>
            </Box>
        </div>
    )
}

export default BusinessDetailsInsurance