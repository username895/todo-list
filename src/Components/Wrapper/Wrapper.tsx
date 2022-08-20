import React, {Suspense, MouseEvent, useState, useRef, useEffect} from 'react';
import {BrowserRouter, Routes, Route, NavLink} from "react-router-dom";
import {taskListInterface} from '../../interfaces/taskList'
import {taskInfo} from '../../interfaces/taskList'
import {createStore} from 'redux'
import {Provider, useDispatch, useSelector} from 'react-redux'

import taskInputIcon from '../../img/task-input__arrow.png'

const AllTasks = React.lazy(() => import('./../Tasks/AllTasks'));
const ActiveTasks = React.lazy(() => import('./../Tasks/ActiveTasks'));
const CompletedTasks = React.lazy(() => import('./../Tasks/CompletedTasks'));


function NothingFound () {
	return (
		<div className="task-list-empty">Тут пока пусто</div>
	)
}

function Wrapper () {
	const taskList: taskInfo[] = useSelector((state: any) => state)

	let inputInner = useRef<HTMLInputElement>(null);

	// const taskStateReducer = (state: any = taskList, action?: any) => {
	// 	switch(action.type){
	// 		case "toggle":
	// 			taskList.splice(action.id, 1, {...taskList[action.id], 'completed': !taskList[action.id].completed})
	// 			console.log('task list', taskList)
	// 			return taskList
	// 		case 'change': 
	// 			return taskList
	// 		case 'clean': 
	// 			return ([])
	// 		default:
	// 			return state;
	// 	}
	// }

	// const todoStore = createStore(taskStateReducer)
	let dispatch = useDispatch()

	let Navigation: React.FC<taskListInterface> = function ({taskList}) {
		let setActive = ({isActive} : {isActive: boolean}) => isActive ? "tasks-menu__route--active" : "tasks-menu__route";
		return (
			<div className="tasks-menu">
				<div className="tasks-menu-info tasks-menu-elem">{taskList.length} items left</div>
				<div className="tasks-menu-routes tasks-menu-elem">
					<NavLink className={setActive} to="/">All</NavLink>
					<NavLink className={setActive} to="/active">Active</NavLink>
					<NavLink className={setActive} to="/completed">Completed</NavLink>
				</div>
				<div className="tasks-menu-reset tasks-menu-elem">
					<button className="tasks-menu-reset__button" onClick={clearTaskList}>Clear all</button>
				</div>
			</div>
		)
	}

	function addTask () {	
		if (inputInner.current != null ) {
			if (inputInner.current.value != "") {
				// setTaskList([{"id": taskList.length, "taskText": inputInner.current.value}, ...taskList,])
				dispatch({type: "add", text: inputInner.current.value})
				inputInner.current.value = "";
			}	
		}
	}

	function clearTaskList () {
		dispatch({type: 'clean'})
	}


	interface KeyEvent {
		event: React.KeyboardEvent;
	}

	let inputHandler =  function ({event}: KeyEvent) {    //при фокусе на поле ввода нажатие на enter добавит новую задачу 
		if (event.key == 'Enter') {
			addTask();
		}
	}

	function checkCompletedTasks() {
		let activeTasksCount: number = 0;
		taskList.forEach ((task, id) => {
			if (task.completed) {
				activeTasksCount++;
			}
		})
		return activeTasksCount;
	}

	return (
		<main className="main">
			<h1 className="main-title">ToDo List</h1>
			<div className="main-wrapper">
				<div className="task-search-field">
					<input className="tasks-input" type="text" placeholder="Whats need to be done?" ref={inputInner} onKeyDown={(event) => inputHandler({event})}/>
					<img className="task-input__image" src={taskInputIcon} alt="taskInputIcon" onClick={addTask} />
				</div>
				<div className="tasks-list">
					<Suspense fallback={<div>Загрузка</div>}>
				        <Routes>
				        	<Route path="/" element={taskList.length == 0 ? <NothingFound/> : <AllTasks/>}/>
					        <Route path="/active" element={checkCompletedTasks() == 0 ? <NothingFound/> : <ActiveTasks/>}/>
					        <Route path="/completed" element={checkCompletedTasks() != 0 ? <NothingFound/> : <CompletedTasks/>}/>
				        </Routes>
			        </Suspense>
				</div>
				<Navigation taskList={taskList}/>
			</div>
		</main>
	)
}


export default Wrapper;