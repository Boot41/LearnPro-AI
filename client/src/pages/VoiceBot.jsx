import React, { useState } from 'react'
import LiveKitElement from '../components/livekit/LiveKitElement'
export const LearnPage = () => {
    const livekit_creds = JSON.parse(localStorage.getItem('livekit_creds'))
    const [connectionDetails,updateConnectionDetails] = useState(livekit_creds) 

    return (
        <div>
            <LiveKitElement updateConnectionDetails={updateConnectionDetails} connectionDetails={connectionDetails} />
        </div>
    )
}

export default LearnPage
