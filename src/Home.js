import React, { useEffect, useState } from 'react';
import Create from './Create';
import api from './api';
import { BsCircle, BsFillCheckCircleFill, BsFillTrashFill, BsPencil, BsCheckLg } from 'react-icons/bs';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Share+Tech+Mono&display=swap');

  :root {
    --bg: #07070f;
    --panel: #0d0d1c;
    --cyan: #00f0ff;
    --pink: #ff2a6d;
    --yellow: #f9f002;
    --purple: #7b2cff;
    --text: #d6f8ff;
    --muted: #5d6b85;
  }

  * { box-sizing: border-box; }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    font-family: 'Share Tech Mono', monospace;
    color: var(--text);
    background-color: var(--bg);
    -webkit-tap-highlight-color: transparent;
  }

  /* Background lives on a fixed layer (iOS Safari ignores background-attachment: fixed) */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 15% 10%, rgba(123, 44, 255, 0.25), transparent 45%),
      radial-gradient(circle at 85% 90%, rgba(255, 42, 109, 0.2), transparent 45%),
      linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px),
      var(--bg);
    background-size: auto, auto, 40px 40px, 40px 40px, auto;
  }

  /* CRT scanlines */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0px,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0.18) 3px
    );
    z-index: 999;
  }

  .todo-app {
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
    padding:
      calc(56px + env(safe-area-inset-top, 0px))
      calc(20px + env(safe-area-inset-right, 0px))
      calc(40px + env(safe-area-inset-bottom, 0px))
      calc(20px + env(safe-area-inset-left, 0px));
  }

  /* ---------- Header ---------- */
  .todo-header {
    text-align: center;
    margin-bottom: 30px;
  }
  .todo-header h1 {
    margin: 0;
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: clamp(1.6rem, 8vw, 2.6rem);
    letter-spacing: clamp(2px, 1.2vw, 6px);
    text-transform: uppercase;
    color: var(--cyan);
    overflow-wrap: anywhere;
    text-shadow:
      2px 0 var(--pink),
      -2px 0 var(--yellow),
      0 0 18px rgba(0, 240, 255, 0.8);
    animation: glitch 3s infinite;
  }
  .todo-header p {
    margin: 10px 0 0;
    color: var(--pink);
    font-size: clamp(0.75rem, 3.2vw, 0.9rem);
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 0 8px rgba(255, 42, 109, 0.8);
  }

  @keyframes glitch {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-3px, 1px); }
    94% { transform: translate(3px, -1px); }
    96% { transform: translate(-2px, 0); }
  }

  /* ---------- Card ---------- */
  .todo-card {
    position: relative;
    background: rgba(13, 13, 28, 0.9);
    border: 1px solid var(--cyan);
    padding: 24px;
    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px));
    box-shadow: inset 0 0 40px rgba(0, 240, 255, 0.08);
  }
  .todo-card::before {
    content: '// SYSTEM.TASKS';
    position: absolute;
    top: 6px;
    left: 14px;
    font-size: 0.65rem;
    letter-spacing: 2px;
    color: var(--muted);
  }
  .todo-card > .create-wrap { margin-top: 12px; }

  /* ---------- Create form (input + ADD button) ---------- */
  .create-wrap { margin-bottom: 22px; }

  .create-wrap form,
  .create-wrap > div {
    display: flex !important;
    flex-direction: row !important;
    align-items: stretch !important;
    gap: 12px !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
  }

  .create-wrap input[type='text'],
  .create-wrap input:not([type]) {
    flex: 1 !important;
    min-width: 0 !important;
    width: 100% !important;
    height: 52px !important;
    padding: 0 16px !important;
    margin: 0 !important;
    background: rgba(0, 240, 255, 0.05) !important;
    color: var(--cyan) !important;
    border: 1px solid rgba(0, 240, 255, 0.4) !important;
    border-left: 4px solid var(--cyan) !important;
    border-radius: 0 !important;
    font-family: 'Share Tech Mono', monospace !important;
    font-size: 16px !important; /* 16px stops iOS from zooming on focus */
    letter-spacing: 1px;
    outline: none !important;
    -webkit-appearance: none;
    appearance: none;
    transition: all 0.25s !important;
  }
  .create-wrap input::placeholder {
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .create-wrap input:focus {
    border-color: var(--pink) !important;
    border-left-color: var(--pink) !important;
    background: rgba(255, 42, 109, 0.07) !important;
    box-shadow: 0 0 18px rgba(255, 42, 109, 0.35) !important;
    color: #fff !important;
  }

  .create-wrap button {
    position: relative !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    height: 52px !important;
    min-width: 110px !important;
    padding: 0 28px !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    background: linear-gradient(110deg, var(--pink) 0%, var(--purple) 55%, var(--cyan) 100%) !important;
    background-size: 200% 100% !important;
    color: #fff !important;
    font-family: 'Orbitron', sans-serif !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
    letter-spacing: 3px !important;
    text-transform: uppercase !important;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
    cursor: pointer !important;
    touch-action: manipulation;
    clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
    transition: background-position 0.4s, transform 0.15s, filter 0.2s !important;
  }
  .create-wrap button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -80%;
    width: 50%;
    height: 100%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.55), transparent);
    transform: skewX(-20deg);
  }
  .create-wrap button:active { transform: translateY(1px) scale(0.97); }

  /* ---------- Todo list ---------- */
  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .todo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    background: var(--panel);
    border: 1px solid rgba(0, 240, 255, 0.2);
    border-left: 3px solid var(--cyan);
    transition: all 0.25s;
    animation: slideIn 0.35s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-14px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .todo-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
  }

  .todo-check {
    font-size: 1.4rem;
    flex-shrink: 0;
    color: var(--muted);
    cursor: pointer;
    padding: 6px;
    box-sizing: content-box;
    margin: -6px;
    touch-action: manipulation;
    transition: all 0.2s;
  }
  .todo-check.done {
    color: var(--yellow);
    filter: drop-shadow(0 0 6px var(--yellow));
    cursor: default;
  }

  .todo-text {
    margin: 0;
    font-size: 1.05rem;
    letter-spacing: 0.5px;
    color: var(--text);
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  .todo-text.done {
    text-decoration: line-through;
    text-decoration-color: var(--pink);
    color: var(--muted);
  }

  .todo-edit-input {
    flex: 1;
    min-width: 0;
    width: 100%;
    padding: 10px 12px;
    background: rgba(255, 42, 109, 0.08);
    color: #fff;
    border: 1px solid var(--pink);
    border-radius: 0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px; /* prevents iOS zoom */
    outline: none;
    box-shadow: 0 0 14px rgba(255, 42, 109, 0.4);
  }

  .todo-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  .todo-btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: 1px solid var(--muted);
    border-radius: 0;
    color: var(--muted);
    font-size: 1.05rem;
    cursor: pointer;
    touch-action: manipulation;
    clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
    transition: all 0.2s;
  }
  .todo-btn.save {
    color: var(--yellow);
    border-color: var(--yellow);
    background: rgba(249, 240, 2, 0.1);
  }
  .todo-btn.edit:active {
    color: var(--cyan);
    border-color: var(--cyan);
    background: rgba(0, 240, 255, 0.12);
  }
  .todo-btn.delete:active {
    color: var(--pink);
    border-color: var(--pink);
    background: rgba(255, 42, 109, 0.15);
  }

  .todo-empty {
    text-align: center;
    padding: 36px 16px;
    color: var(--muted);
    letter-spacing: 3px;
    text-transform: uppercase;
  }
  .todo-empty span {
    display: block;
    font-size: 2rem;
    margin-bottom: 8px;
    color: var(--cyan);
    text-shadow: 0 0 12px var(--cyan);
  }

  /* ---------- Hover effects only on devices that can hover (no sticky hover on phones) ---------- */
  @media (hover: hover) and (pointer: fine) {
    .create-wrap button:hover {
      background-position: 100% 0 !important;
      filter: brightness(1.2) saturate(1.2);
      transform: translateY(-2px);
    }
    .create-wrap button:hover::before {
      left: 130%;
      transition: left 0.6s;
    }
    .todo-item:hover {
      border-color: var(--cyan);
      border-left-color: var(--pink);
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(0, 240, 255, 0.05);
      transform: translateX(4px);
    }
    .todo-check:hover {
      color: var(--cyan);
      filter: drop-shadow(0 0 6px var(--cyan));
      transform: scale(1.15);
    }
    .todo-btn.edit:hover {
      color: var(--cyan);
      border-color: var(--cyan);
      background: rgba(0, 240, 255, 0.12);
    }
    .todo-btn.save:hover { background: rgba(249, 240, 2, 0.25); }
    .todo-btn.delete:hover {
      color: var(--pink);
      border-color: var(--pink);
      background: rgba(255, 42, 109, 0.15);
    }
  }

  /* ---------- Tablets / large phones ---------- */
  @media (max-width: 600px) {
    .todo-app {
      padding-top: calc(36px + env(safe-area-inset-top, 0px));
      padding-left: calc(14px + env(safe-area-inset-left, 0px));
      padding-right: calc(14px + env(safe-area-inset-right, 0px));
    }
    .todo-header { margin-bottom: 22px; }
    .todo-card {
      padding: 18px 14px;
      clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    }
    .todo-card::before { left: 10px; }
    .create-wrap { margin-bottom: 18px; }
    .create-wrap button {
      min-width: 88px !important;
      padding: 0 18px !important;
      letter-spacing: 2px !important;
    }
    .todo-item { padding: 12px; gap: 10px; }
    .todo-left { gap: 10px; }
    .todo-text { font-size: 1rem; }
  }

  /* ---------- Small phones: stack input over button ---------- */
  @media (max-width: 400px) {
    .create-wrap form,
    .create-wrap > div {
      flex-direction: column !important;
      gap: 10px !important;
    }
    .create-wrap button {
      width: 100% !important;
      min-width: 0 !important;
    }
    .todo-actions { gap: 6px; }
    .todo-btn { width: 38px; height: 38px; }
  }

  /* ---------- Very small screens (320px) ---------- */
  @media (max-width: 340px) {
    .todo-header h1 { letter-spacing: 1px; }
    .todo-item { flex-wrap: wrap; }
    .todo-actions { width: 100%; justify-content: flex-end; }
  }

  /* Respect users who turn animations off */
  @media (prefers-reduced-motion: reduce) {
    .todo-header h1, .todo-item { animation: none; }
    * { transition: none !important; }
  }
`;

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');

    useEffect(() => {
        api.get('/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const edit = (id) => {
        api.put(`/edit/${id}`)
            .then(result => {
                console.log(result.data);
                setTodos(todos.map(todo =>
                    todo._id === id ? { ...todo, done: !todo.done } : todo
                ));
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        api.put(`/update/${id}`, { task: updatedTask })
            .then(result => {
                console.log(result.data);
                setTodos(todos.map(todo =>
                    todo._id === id ? { ...todo, task: updatedTask } : todo
                ));
                setTaskid('');
                setUpdatetask('');
            })
            .catch(err => console.log(err));
    };

    const Hdelete = (id) => {
        api.delete(`/delete/${id}`)
            .then(result => {
                console.log(result.data);
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(err => console.log(err));
    };

    const remaining = todos.filter(t => !t.done).length;

    return (
        <main className='todo-app'>
            <style>{styles}</style>

            <header className='todo-header'>
                <h1>Dibbo`s Task to Complete </h1>
                <p>
                    {todos.length === 0
                        ? '> no active tasks'
                        : `> ${remaining} of ${todos.length} tasks pending`}
                </p>
            </header>

            <div className='todo-card'>
                <div className='create-wrap'>
                    <Create />
                </div>

                {todos.length === 0 ? (
                    <div className='todo-empty'>
                        <span>[ ! ]</span>
                        No tasks found
                    </div>
                ) : (
                    <div className='todo-list'>
                        {todos.map((todo) => (
                            <div className='todo-item' key={todo._id}>
                                <div className='todo-left'>
                                    {todo.done
                                        ? <BsFillCheckCircleFill className='todo-check done' />
                                        : <BsCircle className='todo-check' onClick={() => edit(todo._id)} />}

                                    {taskid === todo._id ? (
                                        <input
                                            className='todo-edit-input'
                                            type='text'
                                            autoFocus
                                            value={updatetask}
                                            onChange={e => setUpdatetask(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') Update(todo._id, updatetask);
                                                if (e.key === 'Escape') { setTaskid(''); setUpdatetask(''); }
                                            }}
                                        />
                                    ) : (
                                        <p className={`todo-text ${todo.done ? 'done' : ''}`}>{todo.task}</p>
                                    )}
                                </div>

                                <div className='todo-actions'>
                                    <button
                                        className={`todo-btn ${taskid === todo._id ? 'save' : 'edit'}`}
                                        title={taskid === todo._id ? 'Save' : 'Edit'}
                                        onClick={() => {
                                            if (taskid === todo._id) {
                                                Update(todo._id, updatetask);
                                            } else {
                                                setTaskid(todo._id);
                                                setUpdatetask(todo.task);
                                            }
                                        }}
                                    >
                                        {taskid === todo._id ? <BsCheckLg /> : <BsPencil />}
                                    </button>
                                    <button
                                        className='todo-btn delete'
                                        title='Delete'
                                        onClick={() => Hdelete(todo._id)}
                                    >
                                        <BsFillTrashFill />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Home;