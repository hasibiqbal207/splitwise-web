import ThemeProvider from "./theme"
import AppRoutes from "./AppRoutes"

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
