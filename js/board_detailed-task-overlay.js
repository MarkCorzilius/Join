async function deleteTaskInOverlay(task) {
    const rawBoard = await getData('board/');
    const board = Object.values(rawBoard);
    console.log(board);

}