async function deleteTaskInOverlay(currentTask) {
    const board = await getData('board/');

    for (const [columnKey, tasks] of Object.entries(board)) {
        for (const [taskKey, task] of Object.entries(tasks)) {
            if (task.id === currentTask.id) {
                await deleteData(`board/${columnKey}/${taskKey}`);
                closeTaskInfoOverlay();
                await renderAllTasks();
                return;
            }
        }
    }
}