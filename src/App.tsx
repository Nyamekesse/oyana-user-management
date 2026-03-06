import { useCallback, useEffect, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser } from './api/users';
import './App.css';
import AvatarCell from './components/AvatarCell';
import Modal from './components/Modal';
import SkeletonRow from './components/SkeletonRow';
import Toast from './components/Toast';
import UserFormFields from './components/UserFormFields';
import type { User, UserFormData } from './types';

const EMPTY_FORM: UserFormData = { first_name: '', last_name: '', email: '' };

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UserFormData>(EMPTY_FORM);
  const [editLoading, setEditLoading] = useState<boolean>(false);

  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<UserFormData>(EMPTY_FORM);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [toast, setToast] = useState<string | null>(null);
  const [localIdCounter, setLocalIdCounter] = useState<number>(1000);

  const showToast = (msg: string) => setToast(msg);

  const loadUsers = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await fetchUsers(p);
      setUsers(data.data);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch {
      showToast('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(page);
  }, [page, loadUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.first_name?.toLowerCase().includes(q) || u.last_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setEditForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      await updateUser(editUser.id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...editForm } : u)));
      showToast('User updated successfully.');
      setEditUser(null);
    } catch {
      showToast('Update failed. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async () => {
    const { first_name, last_name, email } = createForm;
    if (!first_name || !last_name || !email) {
      showToast('Please fill in all fields.');
      return;
    }
    setCreateLoading(true);
    try {
      const data = await createUser(createForm);
      const newUser: User = {
        ...createForm,
        id: Number(data.id) || localIdCounter,
        avatar: undefined,
      };
      setLocalIdCounter((c) => c + 1);
      setUsers((prev) => [newUser, ...prev]);
      setTotal((t) => t + 1);
      showToast('User created successfully.');
      setCreateOpen(false);
      setCreateForm(EMPTY_FORM);
    } catch {
      showToast('Create failed. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      showToast('User deleted.');
      setDeleteTarget(null);
    } catch {
      showToast('Delete failed. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-mark">U</div>
          <span className="logo-text">Oyana User Manager</span>
        </div>
      </header>

      <main className="main">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">{total > 0 ? `${total} total users across ${totalPages} pages` : 'Loading user data…'}</p>

        <div className="toolbar">
          <input
            className="search-box"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setCreateForm(EMPTY_FORM);
              setCreateOpen(true);
            }}
          >
            <span aria-hidden>+</span>
            Add User
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">{search ? `No users matching "${search}"` : 'No users found.'}</div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <AvatarCell user={user} />
                    </td>
                    <td className="muted">{user.email}</td>
                    <td>
                      <span className="badge">Active</span>
                    </td>
                    <td className="align-right">
                      <div className="actions-cell">
                        <button className="btn btn-secondary" onClick={() => handleOpenEdit(user)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => setDeleteTarget(user)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="pagination">
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <div className="page-buttons">
              <button className="page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1} aria-label="Previous page">
                ‹
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`page-btn${page === i + 1 ? ' active' : ''}`}
                  onClick={() => setPage(i + 1)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={page === i + 1 ? 'page' : undefined}
                >
                  {i + 1}
                </button>
              ))}
              <button className="page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} aria-label="Next page">
                ›
              </button>
            </div>
          </div>
        )}
      </main>

      {editUser && (
        <Modal
          title="Edit User"
          subtitle={`Updating details for ${editUser.first_name} ${editUser.last_name}`}
          onClose={() => setEditUser(null)}
          onSubmit={handleEditSave}
          loading={editLoading}
        >
          <UserFormFields form={editForm} onChange={(k, v) => setEditForm((f) => ({ ...f, [k]: v }))} />
        </Modal>
      )}

      {createOpen && (
        <Modal
          title="Add New User"
          subtitle="Fill in the details to create a new user record."
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreate}
          loading={createLoading}
        >
          <UserFormFields form={createForm} onChange={(k, v) => setCreateForm((f) => ({ ...f, [k]: v }))} />
        </Modal>
      )}

      {deleteTarget && (
        <Modal
          title="Delete User"
          subtitle={`Are you sure you want to delete ${deleteTarget.first_name} ${deleteTarget.last_name}? This action cannot be undone.`}
          small
          onClose={() => setDeleteTarget(null)}
          onSubmit={handleDelete}
          loading={deleteLoading}
          submitLabel="Delete User"
          submitClassName="btn-destructive"
        >
          <></>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
