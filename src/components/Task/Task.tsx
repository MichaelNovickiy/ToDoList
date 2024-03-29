import React, {useCallback} from 'react'
import {EditableText} from '../../features/EditableSpan/EditableText'
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '../../api/api'
import {removeTaskTC, updateTaskTC} from '../../redux/tasks-reducer';
import {useDispatch} from 'react-redux';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
// @ts-ignore
import style from './Task.module.css'

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    const dispatch = useDispatch()

    const removeTask = useCallback((id: string, todolistId: string) => dispatch(removeTaskTC(id, todolistId)), [task.id, todolistId])
    const onTitleChangeHandler = useCallback((newValue: string) => dispatch(updateTaskTC(task.id, {title: newValue}, todolistId)), [task.id, todolistId]);
    const changeStatus = useCallback((taskId: string, checked: boolean, todolistId: string) => {
        let status = checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(taskId, {status}, todolistId))
    }, [task.id, todolistId])

    return <div key={task.id}
                className={style.task + ' ' + `${task.status === TaskStatuses.Completed ? `${style.isDone}` : ''}`}>
        <div className={style.text}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                icon={<RadioButtonUncheckedIcon/>} checkedIcon={<RadioButtonCheckedIcon/>}
                color="default"
                onChange={(e) => {
                    changeStatus(task.id, e.currentTarget.checked, todolistId)
                }}
            />
            <EditableText value={task.title} onChange={onTitleChangeHandler}/>
        </div>
        <IconButton onClick={() => removeTask(task.id, todolistId)}><ClearIcon/></IconButton>
    </div>
})
