import { useState, useEffect } from 'react';
import NavigationBar from '../components/navbar';
import List from '../components/list';
import ExpenseForm from '../components/common/from';
import ConfirmPopup from '../components/common/popup';
import type { Expense } from '../types/expense';
import { getExpenses, createExpense, deleteExpense } from '../services/apiService';
import Table from '../components/tableView';
import expenseColumns from '../types/expenseColum';


function Home() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [totalcategories, setTotalCategories] = useState<{ category: string; total: number }[]>([]);

    // initialize the expenses state with an empty array to avoid undefined errors
    useEffect(() => {
        // load expesnses from the backend API and set the state accordingly
         const loadExpenses = async () => {
            await getExpenses('expenses').then((data:any) => {
            setExpenses(data);
            setTimeout(() => setLoading(false), 2000); // Add a slight delay to show the loading state
                }).catch((error:any) => {
                    setError(error.message);
                    setLoading(false);
                });
            };
// load categories from the backend API and set the state accordingly
        const loadCategories = async () => {    
            await getExpenses('expense-categories').then((categoryData:any) => {
                setCategories(categoryData);
            }).catch((error:any) => {
                setError(error.message);
            });

            await getExpenses('filtered-categories-total').then((data:any) => {
                setTotalCategories(data);
            }).catch((error:any) => {
                setError(error.message);
            });
        };
        loadCategories();
        loadExpenses();
            console.log('Expenses loaded:', expenses);
    }, 
    
    []);

// handle delete function to remove an expense from the list and backend
const handleDelete = async (id: string) => {
    setSelectedId(id);
    setShowPopup(true);
  }
    const confirmDelete = async (id: string) => {
        try {
            await deleteExpense(id);
            setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));
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
        setExpenses((currentExpenses) => editingExpense
            ? currentExpenses.map((currentExpense) => currentExpense.id === expense.id ? expense : currentExpense)
            : [expense, ...currentExpenses]);
            if (!editingExpense) {
            await createExpense(expense, 'create-expense').then((data:any) => {
            console.log('Expense created:', data);
        }).catch((error:any) => {
            console.error('Error creating expense:', error);
        });
    }else {
        console.log('Updating expense:', expense);
        await createExpense(expense, `update-expense`).then((data:any) => {
            console.log('Expense updated:', data);
        }).catch((error:any) => {
            console.error('Error updating expense:', error);
        });
    }
        setEditingExpense(null);
    };

    return (   
    <>
        <NavigationBar />
        <div className="container">
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
            <ExpenseForm categories={categories} template={expenses[0]} initialExpense={editingExpense} onSubmit={handleFormSubmit} onCancel={() => setEditingExpense(null)} />
            <div className="list-container">
                {loading && <p>Loading expenses...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && expenses.length === 0 && <p>No expenses found.</p>}
                {!loading && !error && <List data={totalcategories} />}
            </div>
            <div className="table-container">
                        <div className="table-panel"> 
                    <Table data={expenses} columns={expenseColumns} onEdit={setEditingExpense} onDelete={handleDelete}/>
                </div>
                <div className="list-wrapper">
                    
                </div>   
            </div>          
        </div>
    </>
    );
}
export default Home;