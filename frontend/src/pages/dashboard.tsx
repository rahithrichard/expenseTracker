import { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import NavigationBar from '../components/Navbar';
import List from '../components/expense/ExpenseList';
import ExpenseForm from '../components/common/Form';
import { createBudgetNotification, createLowBalanceNotification, useNotifications } from '../contexts/NotificationContext';
import BudgetForm from '../components/common/BudgetForm';
import ConfirmPopup from '../components/common/Popup';
import type { Expense } from '../types/expense';
import { getExpenses, createExpense, deleteExpense, getBudget, saveBudget, type Budget } from '../services/apiService';
import Table from '../components/expense/ExpenseTable';
import expenseColumns from '../types/expenseColumn';
import ExpenseTableSkeleton from '../components/expense/ExpenseTableSkeleton';
import SpendingChartSkeleton from '../components/expense/SpendingChartSkeleton';
import SpendingByTimeSkeleton from '../components/expense/SpendingByTimeSkeleton';

const SpendByCategory = lazy(() => import('../components/expense/SpendByCategory'));
const SpendingByTime = lazy(() => import('../components/expense/SpendingByTime'));


function Home() {
    const { addNotification } = useNotifications();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [tableloading, settableLoading] = useState(true);
    const [chartloading, setchartLoading] = useState(true);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [totalExpenses, setTotalExpenses] = useState<{ category: string; total: number }[]>([
        { category: 'total', total: 0 },
        { category: 'budget', total: 0 },
        { category: 'remaining', total: 0 },
    ]);
    const [totalcategories, setTotalCategories] = useState<{ category: string; total: number }[]>([]);
    const [activeForm, setActiveForm] = useState<'expense' | 'budget'>('expense');
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [budget, setBudget] = useState<Budget>({
        monthStart: `${new Date().toISOString().slice(0, 7)}-01`,
        amount: 0,
    });
    const previousRemainingBalance = useRef<number | null>(null);

    const refreshDashboard = useCallback(async () => {
        try {
            const [expenseData, categoryData, categoryTotals, expenseTotals, budgetData] = await Promise.all([
                getExpenses('expenses', selectedMonth),
                getExpenses('expense-categories'),
                getExpenses('filtered-categories-total', selectedMonth),
                getExpenses('totals-expenses', selectedMonth),
                getBudget(selectedMonth),
            ]);
            setError("");

            setExpenses(expenseData);
            setCategories(categoryData as unknown as string[]);
            setTotalCategories(categoryTotals as unknown as { category: string; total: number }[]);
            setBudget(budgetData);

            const totals = expenseTotals as unknown as {
                Total?: number;
                Budget?: number;
                Remaining?: number;
            };
            const nextRemainingBalance = Number(totals.Remaining || 0);
            const previousBalance = previousRemainingBalance.current;
            if (nextRemainingBalance < 20 && (previousBalance === null || previousBalance >= 20)) {
                addNotification(createLowBalanceNotification(nextRemainingBalance));
            }
            previousRemainingBalance.current = nextRemainingBalance;
            setTotalExpenses([
                { category: 'total', total: Number(totals.Total || 0) },
                { category: 'budget', total: Number(totals.Budget || 0) },
                { category: 'remaining', total: nextRemainingBalance },
            ]);
            setLoading(false);
            settableLoading(false);
            setchartLoading(false);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Failed to refresh dashboard');
            setLoading(false);
            settableLoading(false);
            setchartLoading(false);
        }
    }, [addNotification, selectedMonth]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            void refreshDashboard();
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [refreshDashboard]);

// handle delete function to remove an expense from the list and backend
const handleDelete = async (id: string) => {
    setSelectedId(id);
    setShowPopup(true);
  }
    const confirmDelete = async (id: string) => {
        try {
            await deleteExpense(id);
            await refreshDashboard();
        } catch (error) {
            console.error('Error deleting expense:', error);
        } finally {
            setShowPopup(false);
            setSelectedId('');
        }
    };
// common create and update function to handle form submission for both creating and updating expenses
    const handleFormSubmit = async (expense: Expense) => {
        console.log('Form submitted:', expense);
        try {
            await createExpense(expense, editingExpense ? 'update-expense' : 'create-expense');
            await refreshDashboard();
            setEditingExpense(null);
        } catch (submitError) {
            throw submitError;
        }
    };

    const handleEditExpense = (expense: Expense) => {
        setActiveForm('expense');
        setEditingExpense(expense);
    };

    const handleBudgetSubmit = async (amount: number, monthStart: string) => {
        try {
            await saveBudget(amount, monthStart);
            addNotification(createBudgetNotification(amount));
            await refreshDashboard();
            setEditingExpense(null);
            setActiveForm('expense');
        } catch (submitError) {
            throw submitError;
        }
    };

    const hasExpenseData = expenses.length > 0;
    const remainingBalance = totalExpenses.find((item) => item.category === 'remaining')?.total ?? 0;
    const budgetRequired = budget.amount <= 0 || remainingBalance <= 0;
    const displayedForm = budgetRequired ? 'budget' : activeForm;

    if (loading) {
        return (
            <>
                <NavigationBar />
                <div className="container">
                    <div className="dashboard-controls-row">
                        <div className="form-switcher" role="group" aria-label="Choose transaction or budget form">
                            <button className="form-switcher-button active" type="button" disabled>Expense</button>
                            <button className="form-switcher-button" type="button" disabled>Budget</button>
                        </div>
                        <div className="dashboard-month-filter">
                            <label htmlFor="dashboard-month">Viewing month</label>
                            <input id="dashboard-month" type="month" value={selectedMonth} readOnly />
                        </div>
                    </div>

                    <div className="list-container">
                        <div className="skeleton-container">
                            <div className="skeleton-card">
                                <div className="icon-img">
                                    <div className="react-loading-skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                </div>
                                <div className="content-st">
                                    <div className="react-loading-skeleton" style={{ width: '65%', height: '12px', marginBottom: '8px' }} />
                                    <div className="react-loading-skeleton" style={{ width: '50%', height: '18px' }} />
                                </div>
                            </div>
                            <div className="skeleton-card">
                                <div className="icon-img">
                                    <div className="react-loading-skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                </div>
                                <div className="content-st">
                                    <div className="react-loading-skeleton" style={{ width: '65%', height: '12px', marginBottom: '8px' }} />
                                    <div className="react-loading-skeleton" style={{ width: '50%', height: '18px' }} />
                                </div>
                            </div>
                            <div className="skeleton-card">
                                <div className="icon-img">
                                    <div className="react-loading-skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                </div>
                                <div className="content-st">
                                    <div className="react-loading-skeleton" style={{ width: '65%', height: '12px', marginBottom: '8px' }} />
                                    <div className="react-loading-skeleton" style={{ width: '50%', height: '18px' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <div className="table-panel">
                            <ExpenseTableSkeleton />
                        </div>
                        <div className="list-wrapper">
                            <SpendingChartSkeleton />
                            <SpendingByTimeSkeleton />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (   
    <>
    {/* navigation */}
        <NavigationBar />
        
        <div className="container">
            <div className="dashboard-controls-row">
                <div className="form-switcher" role="group" aria-label="Choose transaction or budget form">
                    <button
                        className={displayedForm === 'expense' ? 'form-switcher-button active' : 'form-switcher-button'}
                        type="button"
                        onClick={() => setActiveForm('expense')}
                        aria-pressed={displayedForm === 'expense'}
                        disabled={budgetRequired}
                    >
                        Expense
                    </button>
                    <button
                        className={displayedForm === 'budget' ? 'form-switcher-button active' : 'form-switcher-button'}
                        type="button"
                        onClick={() => setActiveForm('budget')}
                        aria-pressed={displayedForm === 'budget'}
                    >
                        Budget
                    </button>
                </div>
                <div className="dashboard-month-filter">
                    <label htmlFor="dashboard-month">Viewing month</label>
                    <input
                        id="dashboard-month"
                        type="month"
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(event.target.value)}
                    />
                </div>
            </div>
            <ConfirmPopup
                isOpen={showPopup}
                title="Delete Expense"
                message="Are you sure you want to delete this expense?"
                onConfirm={() => {
                    void confirmDelete(selectedId);
                }}
                onCancel={() => {
                    setShowPopup(false);
                    setSelectedId("");
                }}
            />
            {displayedForm === 'expense' ? (
                <ExpenseForm key={editingExpense?.id ?? `new-${expenses[0]?.id ?? 'empty'}`} categories={categories} template={expenses[0]} initialExpense={editingExpense} availableBalance={remainingBalance} onSubmit={handleFormSubmit} onCancel={() => setEditingExpense(null)} />
            ) : (
                <BudgetForm key={`${budget.monthStart}-${budget.amount}`} budget={budget} onSubmit={handleBudgetSubmit} />
            )}
            {!loading && (
                <div className="list-container">
                    <List data={totalExpenses} />
                </div>
            )}
            {!loading && !error && hasExpenseData && (
                <div className="table-container">
                    <div className="table-panel"> 
                        {tableloading ? (
                            <ExpenseTableSkeleton />
                        ) : (
                            <Table data={expenses} columns={expenseColumns} onEdit={handleEditExpense} onDelete={handleDelete} />
                        )}
                    </div>
                    <div className="list-wrapper">
                        {chartloading ? (
                            <>
                                <SpendingChartSkeleton />
                                <SpendingByTimeSkeleton />
                            </>
                        ) : (
                            <>
                                <Suspense fallback={<SpendingChartSkeleton />}>
                                    <SpendByCategory data={totalcategories} />
                                </Suspense>
                                <Suspense fallback={<SpendingByTimeSkeleton />}>
                                    <SpendingByTime expenses={expenses} />
                                </Suspense>
                            </>
                        )}
                    </div>   
                </div>
            )}
            {!loading && !error && !hasExpenseData && (
                <div className="list-container">
                    <p className="empty-state">No data available for this month.</p>
                </div>
            )}
        </div>
    </>
    );
}
export default Home;