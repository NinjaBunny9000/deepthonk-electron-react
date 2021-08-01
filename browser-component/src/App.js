import React from 'react'
import { CssBaseline } from '@material-ui/core'

// assets
import './app.styles.scss'

// color theme => https://material.io/resources/color/#!/?view.left=1&view.right=0&primary.color=FF9800&primary.text.color=000000&secondary.color=2979FF&secondary.text.color=ECEFF1

/// CONFIG ///
const env = process.env.NODE_ENV || 'development'
const apiURL = process.env.API_URL

// copy this to make new class compoenents
class ClassTemplate extends React.Component {
    render() {
        return <div></div>
    }
}

// or this to make new function components
function functionTemplate() {
    return <div></div>
}

class DevBar extends React.Component {
    render() {
        return <div></div>
    }
}

class Layout extends React.Component {
    render() {
        return (
            <div className='flex items-center justify-center h-screen'>{env === 'development' ? <DevBar /> : null}</div>
        )
    }
}

function App() {
    return (
        <div id='app-wrapper' className=''>
            <CssBaseline />
            <Layout />
        </div>
    )
}

export default App
