import { Routing } from './router/Routing'
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className='layout'>
        <Routing></Routing>
      </div>
    </ThemeProvider>
  )
}

export default App
