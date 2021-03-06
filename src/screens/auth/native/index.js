import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { errorReason } from 'data/selectors/user'
import { loginNative } from 'data/actions/user'

import apple from './apple.ios'
import google from './google'

import { withOverlay } from 'co/navigation/screen'
import PreventClose from 'co/navigation/preventClose'
import { ScrollForm } from 'co/form'
import { ActivityIndicator } from 'co/native'
import { Error } from 'co/overlay'

const providers = { apple, google }

function NativeAuth({ route: { params={} } , navigation }) {
    const { provider } = params

    const dispatch = useDispatch()
    const error = useSelector(state=>errorReason(state).native)
    const [canceled, setCanceled] = useState(false)

    useEffect(()=>{
        providers[provider]()
            .then(params=>{
                if (params)
                    dispatch(loginNative(params))
                else{
                    setCanceled(true)
                    return navigation.goBack()
                }
            })
            .catch(e=>{
                Error(e)
                setCanceled(true)
                return navigation.goBack()
            })
    }, [])

    useEffect(()=>{
        if (error)
            Error(error)
    }, [error])
    
    return (
        <ScrollForm centerContent={true}>
            {error || canceled ? null : <PreventClose />}
            <ActivityIndicator color='blue' />
        </ScrollForm>
    )
}

export default withOverlay(NativeAuth)