function setColumnHeight () {
    const table = document.querySelector('.calendar__table');
    const calendarItem = table.querySelectorAll('.calendar__item-box');

    let maxHeight = 0;
    calendarItem.forEach ((el) => {
        console.log('el  => ',el)
        if (el.offsetHeight > maxHeight) { maxHeight = el.offsetHeight; }
    })
    calendarItem.forEach ((el) => {
        el.style.height = `${maxHeight}px`;
    })
}
document.addEventListener('DOMContentLoaded', setColumnHeight)