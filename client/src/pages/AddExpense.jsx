import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import ExpenseForm from '../components/ExpenseForm';

export default function AddExpense({ reload }) {
  const nav = useNavigate();
  const submit = async (form) => {
    await api.addExpense(form);
    await reload();
    nav('/expenses');
  };
  return (
    <>
      <h2 className="page-title">Add Expense</h2>
      <ExpenseForm onSubmit={submit} />
    </>
  );
}