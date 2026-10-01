import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './components/common/Form.css'
import './components/common/BudgetForm.css'
import './components/expense/SpendByCategory.css'
import './components/expense/SpendingByTime.css'
import './pages/Dashboard.css'
import './components/expense/ExpenseTable.css'
import './components/expense/ExpenseList.css'
import './components/common/Popup.css'
import './pages/Auth.css'
import './components/Navbar.css'
import './components/expense/Skeletons.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
